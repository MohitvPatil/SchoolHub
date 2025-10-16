import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { ratingSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institution_id, stars } = ratingSchema.parse(body);
    
    const userIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    const conn = await getDbConnection();

    // Check if user has already rated this institution (simple IP-based check)
    const [existing] = await conn.execute(
      'SELECT id FROM ratings WHERE institution_id = ? AND user_ip = ?',
      [institution_id, userIp]
    );

    if ((existing as any).length > 0) {
      // Update existing rating
      await conn.execute(
        'UPDATE ratings SET stars = ?, created_at = CURRENT_TIMESTAMP WHERE institution_id = ? AND user_ip = ?',
        [stars, institution_id, userIp]
      );
    } else {
      // Insert new rating
      await conn.execute(
        'INSERT INTO ratings (institution_id, stars, user_ip) VALUES (?, ?, ?)',
        [institution_id, stars, userIp]
      );
    }

    // Update institution's average rating
    const [ratingResult] = await conn.execute(
      'SELECT AVG(stars) as avg_rating FROM ratings WHERE institution_id = ?',
      [institution_id]
    );

    const avgRating = (ratingResult as any)[0].avg_rating;
    await conn.execute(
      'UPDATE institutions SET rating = ? WHERE id = ?',
      [avgRating, institution_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}