import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: Request) {
  try {
    // 1. Auth Check
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await pool.query('SELECT id FROM "Users" WHERE email = $1', [session.user.email]);
    if (userResult.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const userId = userResult.rows[0].id;

    // 2. Fetch Context Data
    
    // A. Top 5 highest emission activities in last 30 days
    const activitiesQuery = `
      SELECT e.name, e.category, a.co2_emitted 
      FROM "Activities" a
      JOIN "EmissionFactors" e ON a.emission_factor_id = e.id
      WHERE a.user_id = $1 AND a.activity_date >= NOW() - INTERVAL '30 days'
      ORDER BY a.co2_emitted DESC
      LIMIT 5
    `;
    const activitiesRes = await pool.query(activitiesQuery, [userId]);
    
    // B. All available generic recommendations
    const recsQuery = `SELECT id, title, category, estimated_co2_saving FROM "Recommendations"`;
    const recsRes = await pool.query(recsQuery);
    
    // C. Existing todos to prevent duplicates
    const existingQuery = `SELECT recommendation_id FROM "Todos" WHERE user_id = $1`;
    const existingRes = await pool.query(existingQuery, [userId]);
    const existingIds = existingRes.rows.map(r => r.recommendation_id);
    // console.log('activities==>>', activitiesRes.rows);
    // 3. Construct Gemini Prompt
    const prompt = `
      You are an expert sustainability coach.
      
      User's highest carbon activities (last 30 days): 
      ${JSON.stringify(activitiesRes.rows)}

      List of available recommendations (ID, Title, Category, Saving):
      ${JSON.stringify(recsRes.rows)}

      IDs the user has already added: ${JSON.stringify(existingIds)}

      TASK: Select exactly 3 distinct recommendation IDs from the available list that are most relevant to reducing this specific user's footprint. 
      Prioritize high CO2 savings and relevance to their recent activities. Do not select IDs they already have.
      
      OUTPUT FORMAT: Return ONLY a raw JSON array of integers. Example: [1, 5, 12]. Do not add markdown blocks or text.
    `;
    console.log("prompt===>>>", prompt);
    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log("text==>>>", response.text());
    
    // Clean and Parse JSON
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestedIds: number[] = JSON.parse(cleanedText);

    if (!Array.isArray(suggestedIds) || suggestedIds.length === 0) {
      return NextResponse.json({ message: 'No new suggestions found' });
    }

    // 5. Insert New Todos
    // We need to fetch the titles for these IDs to insert into the Todos table
    const selectedRecs = recsRes.rows.filter(r => suggestedIds.includes(r.id));
    
    for (const rec of selectedRecs) {
      await pool.query(
        `INSERT INTO "Todos" (user_id, title, recommendation_id, status, priority) VALUES ($1, $2, $3, 'pending', 1)`,
        [userId, rec.title, rec.id]
      );
    }

    return NextResponse.json({ message: 'Plan generated', count: suggestedIds.length }, { status: 201 });

  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}