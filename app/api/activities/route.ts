import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db'; 
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

// --- Types ---
interface AddActivityRequest {
  emission_factor_id: string | number;
  value: number;
  activity_date: string;
  notes?: string;
}

// --- GET Method ---
// Kept for external API usage, though page.tsx will now fetch directly.
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await pool.query('SELECT id FROM "Users" WHERE email = $1', [session.user.email]);
    if (userResult.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const userId = userResult.rows[0].id;

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const category = searchParams.get('category');

    let sql = `
      SELECT 
        a.id, a.activity_date, a.value, a.co2_emitted, a.notes,
        e.name as activity_name, e.category, e.unit, e.factor
      FROM "Activities" a
      JOIN "EmissionFactors" e ON a.emission_factor_id = e.id
      WHERE a.user_id = $1
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    if (from) { sql += ` AND a.activity_date >= $${paramIndex}`; params.push(from); paramIndex++; }
    if (to) { sql += ` AND a.activity_date <= $${paramIndex}`; params.push(to); paramIndex++; }
    if (category && category !== 'All') { sql += ` AND e.category = $${paramIndex}`; params.push(category); paramIndex++; }

    sql += ` ORDER BY a.activity_date DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error("History API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST Method ---
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions); 
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userResult = await pool.query('SELECT id FROM "Users" WHERE email = $1', [session.user.email]);
    if (userResult.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const userId = userResult.rows[0].id;

    const body: AddActivityRequest = await request.json();
    const { emission_factor_id, value, activity_date, notes } = body;

    if (!emission_factor_id || !value || !activity_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) {
       return NextResponse.json({ error: 'Value must be positive' }, { status: 400 });
    }

    const factorResult = await pool.query('SELECT factor FROM "EmissionFactors" WHERE id = $1', [emission_factor_id]);
    if (factorResult.rows.length === 0) return NextResponse.json({ error: 'Invalid activity' }, { status: 400 });

    const factor = parseFloat(factorResult.rows[0].factor);
    const co2Emitted = factor * numericValue;

    const insertQuery = `
      INSERT INTO "Activities" 
      (user_id, emission_factor_id, value, co2_emitted, activity_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, co2_emitted;
    `;

    const insertValues = [userId, emission_factor_id, numericValue, co2Emitted, new Date(activity_date), notes || null];
    const result = await pool.query(insertQuery, insertValues);
    const newActivity = result.rows[0];

    // --- CRITICAL: Purge the cache ---
    revalidateTag('activities');

    return NextResponse.json({ message: 'Logged successfully', activity: newActivity }, { status: 201 });

  } catch (error: any) {
    console.error('API Error POST /api/activities:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}