import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { unstable_cache } from "next/cache";
import { processActivityData } from "@/utils/processActivityData";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

const getActivitiesByUser = async (userId: number) => {
  "use cache";
  cacheTag("activities");

  const sql = `
      SELECT
        a.id,
        a.activity_date,
        a.value,
        a.co2_emitted,
        a.notes,
        e.name as activity_name,
        e.category,
        e.unit
      FROM "Activities" a
      JOIN "EmissionFactors" e ON a.emission_factor_id = e.id
      WHERE a.user_id = $1
      ORDER BY a.activity_date DESC
    `;
  const result = await pool.query(sql, [userId]);
  return result.rows.map((row) => ({
    ...row,
    activity_date: new Date(row.activity_date).toISOString(),
  }));
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/api/signin");
  }

  // Fetch User ID
  const userRes = await pool.query('SELECT id FROM "Users" WHERE email = $1', [
    session.user.email,
  ]);

  if (userRes.rows.length === 0) {
    return <div className="p-8">User account not found.</div>;
  }

  const userId = userRes.rows[0].id;

  // Fetch Activities (Server-Side)
  const rawActivities = await getActivitiesByUser(userId);

  // Process Data
  const dashboardData = processActivityData(rawActivities);

  return (
    // Pass the prepared data to the Client Component
    <DashboardClient initialData={dashboardData} />
  );
}
