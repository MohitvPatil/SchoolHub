import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conn = await getDbConnection();
    const institutionId = parseInt(params.id);

    // Get institution with rating
    const [institutionRows] = await conn.execute(
      `SELECT i.*, COALESCE(AVG(r.stars), 0) as rating, COUNT(r.id) as rating_count
       FROM institutions i
       LEFT JOIN ratings r ON i.id = r.institution_id
       WHERE i.id = ?
       GROUP BY i.id`,
      [institutionId]
    );

    const institutions = institutionRows as any[];
    if (institutions.length === 0) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    const institution = institutions[0];

    // Get type-specific details
    let details = null;
    if (institution.type === 'School') {
      const [schoolRows] = await conn.execute(
        'SELECT * FROM school_details WHERE institution_id = ?',
        [institutionId]
      );
      details = (schoolRows as any[])[0] || null;
    } else if (institution.type === 'College') {
      const [collegeRows] = await conn.execute(
        'SELECT * FROM college_details WHERE institution_id = ?',
        [institutionId]
      );
      details = (collegeRows as any[])[0] || null;
    }

    return NextResponse.json({
      ...institution,
      [`${institution.type.toLowerCase()}_details`]: details,
    });
  } catch (error) {
    console.error('Error fetching institution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution' },
      { status: 500 }
    );
  }
}