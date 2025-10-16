import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'School' | 'College';

    const conn = await getDbConnection();

    const queries = [
      'SELECT DISTINCT city FROM institutions WHERE type = ? ORDER BY city',
      'SELECT DISTINCT state FROM institutions WHERE type = ? ORDER BY state',
    ];

    let additionalQuery = '';
    if (type === 'School') {
      additionalQuery = 'SELECT DISTINCT pattern FROM school_details sd JOIN institutions i ON sd.institution_id = i.id WHERE i.type = ? ORDER BY pattern';
    } else if (type === 'College') {
      additionalQuery = 'SELECT DISTINCT fields FROM college_details cd JOIN institutions i ON cd.institution_id = i.id WHERE i.type = ? ORDER BY fields';
    }

    const [cities, states, additional] = await Promise.all([
      conn.execute(queries[0], [type]),
      conn.execute(queries[1], [type]),
      additionalQuery ? conn.execute(additionalQuery, [type]) : Promise.resolve([[]]),
    ]);

    const response: any = {
      cities: (cities as any)[0].map((row: any) => row.city),
      states: (states as any)[0].map((row: any) => row.state),
    };

    if (type === 'School') {
      response.patterns = (additional as any)[0].map((row: any) => row.pattern);
    } else if (type === 'College') {
      response.fields = (additional as any)[0].map((row: any) => row.fields);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}