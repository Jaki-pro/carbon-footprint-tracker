import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/lib/auth';

// Helper to get User ID
async function getUserId(email: string) {
    const res = await pool.query('SELECT id FROM "Users" WHERE email = $1', [email]);
    return res.rows[0]?.id;
}

// --- UPDATE Status ---
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Await the params to access the ID
        const { id } = await params;

        const userId = await getUserId(session.user.email);

        const body = await request.json();
        const { status } = body;

        // 3. Use the awaited 'id' variable
        const result = await pool.query(
            `UPDATE "Todos" SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
            [status, id, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// --- DELETE Todo ---
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = await getUserId(session.user.email);
        const { id } = await params;
        await pool.query(`DELETE FROM "Todos" WHERE id = $1 AND user_id = $2`, [id, userId]);

        return NextResponse.json({ message: 'Deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}