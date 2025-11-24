import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db'; // Your raw Postgres client 
import { authOptions } from '@/lib/auth';

// --- Types for Request Body ---
interface AddActivityRequest {
  emission_factor_id: string | number;
  value: number;
  activity_date: string;
  notes?: string;
}

// --- GET: Fetch History with Filters ---
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
        a.id, 
        a.activity_date, 
        a.value, 
        a.co2_emitted, 
        a.notes,
        e.name as activity_name,
        e.category,
        e.unit,
        e.factor -- Needed for frontend optimistic updates if desired
      FROM "Activities" a
      JOIN "EmissionFactors" e ON a.emission_factor_id = e.id
      WHERE a.user_id = $1
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    if (from) {
      sql += ` AND a.activity_date >= $${paramIndex}`;
      params.push(from);
      paramIndex++;
    }

    if (to) {
      sql += ` AND a.activity_date <= $${paramIndex}`;
      params.push(to);
      paramIndex++;
    }

    if (category && category !== 'All') {
        sql += ` AND e.category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
    }

    sql += ` ORDER BY a.activity_date DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error("History API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: Log New Activity ---
export async function POST(request: Request) {
  try {
    // 1. Security: Check if user is authenticated
    const session = await getServerSession(authOptions); 
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    
    // Get the User ID from the database using the email from session
    const userResult = await pool.query(
      'SELECT id FROM "Users" WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // 2. Input Parsing & Validation
    const body: AddActivityRequest = await request.json();
    const { emission_factor_id, value, activity_date, notes } = body;

    if (!emission_factor_id || !value || !activity_date) {
      return NextResponse.json(
        { error: 'Missing required fields (activity, value, or date)' },
        { status: 400 }
      );
    }

    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) {
       return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      );
    }

    // 3. Logic: Fetch Emission Factor & Calculate CO2
    // We need the factor to calculate the total CO2 emitted
    const factorResult = await pool.query(
      'SELECT factor, unit FROM "EmissionFactors" WHERE id = $1',
      [emission_factor_id]
    );

    if (factorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid activity type selected' },
        { status: 400 }
      );
    }

    const factor = parseFloat(factorResult.rows[0].factor);
    
    // Calculation: CO2 = Factor * Value
    // Example: 0.21 kg/km * 10 km = 2.1 kg CO2
    const co2Emitted = factor * numericValue;

    // 4. Database Action: Insert the Activity
    const insertQuery = `
      INSERT INTO "Activities" 
      (user_id, emission_factor_id, value, co2_emitted, activity_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, co2_emitted;
    `;

    const insertValues = [
      userId,
      emission_factor_id,
      numericValue,
      co2Emitted,
      new Date(activity_date), // Ensure valid Date object
      notes || null // Handle optional notes
    ];

    const result = await pool.query(insertQuery, insertValues);
    const newActivity = result.rows[0];

    // 5. Optional: Gamification Hook
    // (This is where you would check for badges later, e.g., "checkAndAwardBadge(userId)")

    return NextResponse.json(
      { 
        message: 'Activity logged successfully',
        activity: newActivity
      }, 
      { status: 201 }
    );
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error POST /api/activities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}