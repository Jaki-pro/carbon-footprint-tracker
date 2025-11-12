import pool from "@/lib/db";
import { NextResponse } from "next/server"
import bcrypt from "bcrypt";
export async function POST(req: Request) {
    const { email, password, name } = await req.json();
    const query = `
    INSERT INTO "Users" (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING *;
  `; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [email, hashedPassword, name];
    try {
        // TODO: gotta user already exists check
        const { rows } = await pool.query(query, values);
        const user = rows[0];
        return NextResponse.json({ message: "User created", user }, { status: 201 });
    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
