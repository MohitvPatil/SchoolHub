import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { Institution, FilterOptions, PaginationInfo } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const type = searchParams.get('type') as 'School' | 'College';
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const pattern = searchParams.get('pattern');
    const fields = searchParams.get('fields');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const conn = await getDbConnection();
    let query = `
      SELECT DISTINCT i.*, 
        COALESCE(AVG(r.stars), 0) as rating
      FROM institutions i 
      LEFT JOIN ratings r ON i.id = r.institution_id
    `;
    
    let countQuery = `
      SELECT COUNT(DISTINCT i.id) as total
      FROM institutions i
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (type) {
      conditions.push('i.type = ?');
      params.push(type);
    }

    if (city) {
      conditions.push('i.city = ?');
      params.push(city);
    }

    if (state) {
      conditions.push('i.state = ?');
      params.push(state);
    }

    if (search) {
      conditions.push('(i.name LIKE ? OR i.city LIKE ? OR i.state LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add pattern filter for schools
    if (pattern && type === 'School') {
      query += ' LEFT JOIN school_details sd ON i.id = sd.institution_id';
      countQuery += ' LEFT JOIN school_details sd ON i.id = sd.institution_id';
      conditions.push('sd.pattern = ?');
      params.push(pattern);
    }

    // Add fields filter for colleges
    if (fields && type === 'College') {
      query += ' LEFT JOIN college_details cd ON i.id = cd.institution_id';
      countQuery += ' LEFT JOIN college_details cd ON i.id = cd.institution_id';
      conditions.push('cd.fields LIKE ?');
      params.push(`%${fields}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' GROUP BY i.id';

    // Add rating filter after GROUP BY
    if (rating) {
      query += ' HAVING rating >= ?';
      params.push(parseFloat(rating));
    }

    // Add sorting
    const validSortColumns = ['name', 'city', 'state', 'rating', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    query += ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Get total count
    const countParams = params.slice(0, -2); // Remove limit and offset for count query
    if (rating) {
      countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT i.id, COALESCE(AVG(r.stars), 0) as rating
          FROM institutions i 
          LEFT JOIN ratings r ON i.id = r.institution_id
          ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
          GROUP BY i.id
          HAVING rating >= ?
        ) as filtered_institutions
      `;
    }

    const [institutions, [{ total }]] = await Promise.all([
      conn.execute(query, params),
      conn.execute(countQuery, rating ? countParams : countParams.slice(0, -1))
    ]);

    const totalPages = Math.ceil(total / limit);

    const response = {
      institutions: (institutions as any)[0],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      } as PaginationInfo,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institutions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      image_url,
      city,
      state,
      address,
      contact_number,
      email,
      ...details
    } = body;

    const conn = await getDbConnection();

    // Check for duplicate institutions
    const [existing] = await conn.execute(
      'SELECT id FROM institutions WHERE name = ? AND city = ? AND state = ?',
      [name, city, state]
    );

    if ((existing as any).length > 0) {
      return NextResponse.json(
        { error: 'An institution with this name already exists in this location' },
        { status: 409 }
      );
    }

    // Insert institution
    const [result] = await conn.execute(
      `INSERT INTO institutions (type, name, image_url, city, state, address, contact_number, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, name, image_url || null, city, state, address, contact_number, email]
    );

    const institutionId = (result as any).insertId;

    // Insert type-specific details
    if (type === 'School') {
      await conn.execute(
        `INSERT INTO school_details (institution_id, standards_offered, pattern, medium, total_strength, principal_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          institutionId,
          details.standards_offered,
          details.pattern,
          details.medium,
          details.total_strength || null,
          details.principal_name || null,
        ]
      );
    } else if (type === 'College') {
      await conn.execute(
        `INSERT INTO college_details (institution_id, fields, subfields, university_type, university_name, course_duration, dean_name)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          institutionId,
          details.fields,
          details.subfields || null,
          details.university_type,
          details.university_name,
          details.course_duration || null,
          details.dean_name || null,
        ]
      );
    }

    return NextResponse.json({ success: true, id: institutionId });
  } catch (error) {
    console.error('Error creating institution:', error);
    return NextResponse.json(
      { error: 'Failed to create institution' },
      { status: 500 }
    );
  }
}