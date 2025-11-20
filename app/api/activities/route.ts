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

// --- GET: Fetch Activity History ---
export async function GET(request: Request) {
  try {
    // 1. Security: Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get User ID
    const userResult = await pool.query(
      'SELECT id FROM "Users" WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // 3. Parse Query Parameters (Date Filtering)
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // 4. Build Dynamic SQL Query
    // We JOIN with EmissionFactors to get the name, category, and unit for display
    let sql = `
      SELECT 
        a.id, 
        a.value, 
        a.co2_emitted, 
        a.activity_date, 
        a.notes,
        e.name AS activity_name, 
        e.category, 
        e.unit
      FROM "Activities" a
      JOIN "EmissionFactors" e ON a.emission_factor_id = e.id
      WHERE a.user_id = $1
    `;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [userId];
    let paramIndex = 2;

    // Add Date Filters if present
    if (fromDate) {
      sql += ` AND a.activity_date >= $${paramIndex}`;
      params.push(new Date(fromDate));
      paramIndex++;
    }

    if (toDate) {
      sql += ` AND a.activity_date <= $${paramIndex}`;
      params.push(new Date(toDate));
      paramIndex++;
    }

    // Order by newest first
    sql += ` ORDER BY a.activity_date DESC`;

    // 5. Execute pool.query
    const result = await pool.query(sql, params);

    return NextResponse.json(result.rows);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error GET /api/activities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
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