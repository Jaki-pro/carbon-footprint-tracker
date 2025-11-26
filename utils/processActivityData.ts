type ActivityRecord = {
  activity_date: string; // e.g., "2025-11-19T00:00:00.000Z"
  activity_name: string;
  category: string;
  co2_emitted: string; // Stored as a string, must be parsed to number
  id: string;
  notes: string;
  unit: string;
  value: string;
};

// 2. Define the required output type (DashboardData)
type DashboardData = {
  stats: {
    today: number;
    week: number;
    month: number;
  };
  byCategory: { category: string; total: number }[];
  weeklyTrend: { date: string; total: number }[];
};

export function processActivityData(records: ActivityRecord[]): DashboardData {
  // --- Initialization ---
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate the start of the current week (assuming Sunday as the start of the week: 0)
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay()); 
  
  // Calculate the start of the current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalToday = 0;
  let totalThisWeek = 0;
  let totalThisMonth = 0;

  const totalsByCategory = new Map<string, number>();
  const totalsByDate = new Map<string, number>();

  // --- Main Aggregation Loop ---
  for (const record of records) {
    const co2 = parseFloat(record.co2_emitted);
    
    // Safety check for invalid numbers
    if (isNaN(co2)) continue;

    const recordDate = new Date(record.activity_date);
    
    // Normalize date string for aggregation (YYYY-MM-DD)
    const trendDateKey = recordDate.toISOString().split('T')[0];

    // 1. Calculate Statistics (Today, Week, Month)
    if (recordDate >= todayStart) {
      totalToday += co2;
    }
    if (recordDate >= weekStart) {
      totalThisWeek += co2;
    }
    if (recordDate >= monthStart) {
      totalThisMonth += co2;
    }

    // 2. Aggregate by Category
    totalsByCategory.set(
      record.category, 
      (totalsByCategory.get(record.category) || 0) + co2
    );

    // 3. Aggregate for Weekly Trend
    totalsByDate.set(
      trendDateKey, 
      (totalsByDate.get(trendDateKey) || 0) + co2
    );
  }

  // --- Final Structure Assembly ---
  return {
    stats: {
      today: parseFloat(totalToday.toFixed(4)),
      week: parseFloat(totalThisWeek.toFixed(4)),
      month: parseFloat(totalThisMonth.toFixed(4)),
    },
    byCategory: Array.from(totalsByCategory, ([category, total]) => ({ 
        category, 
        total: parseFloat(total.toFixed(4)) 
    })).sort((a, b) => b.total - a.total), // Sort by total descending
    weeklyTrend: Array.from(totalsByDate, ([date, total]) => ({ 
        date, 
        total: parseFloat(total.toFixed(4)) 
    })).sort((a, b) => a.date.localeCompare(b.date)), // Sort by date ascending
  };
}