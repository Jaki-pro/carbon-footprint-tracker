import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userResult = await pool.query('SELECT id FROM "Users" WHERE email = $1', [session.user.email]);
    if (userResult.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const userId = userResult.rows[0].id;

    const sql = `
      SELECT 
        t.id, t.title, t.status, t.priority,
        r.description, r.category, r.estimated_co2_saving
      FROM "Todos" t
      LEFT JOIN "Recommendations" r ON t.recommendation_id = r.id
      WHERE t.user_id = $1
      ORDER BY t.status DESC, t.id DESC
    `;

    const result = await pool.query(sql, [userId]);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}