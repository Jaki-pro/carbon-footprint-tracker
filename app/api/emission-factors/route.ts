import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM "EmissionFactors" ORDER BY id ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}