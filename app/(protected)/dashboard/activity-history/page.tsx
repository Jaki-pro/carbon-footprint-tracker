'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// --- Register ChartJS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Types ---
type ActivityLog = {
  id: string;
  activity_date: string;
  value: number;
  co2_emitted: number; // Raw string/number from DB
  notes: string;
  activity_name: string;
  category: 'Transport' | 'Food' | 'Energy' | 'Waste';
  unit: string;
};

// --- Icons ---
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

export default function ActivityHistoryPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ActivityLog; direction: 'asc' | 'desc' }>({ key: 'activity_date', direction: 'desc' });

  useEffect(() => {
    fetchActivities();
  }, [dateFrom, dateTo]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo) params.append('to', dateTo);
      const res = await fetch(`/api/activities?${params.toString()}`);
      const data = await res.json();
      
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSort = (key: keyof ActivityLog) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedActivities = useMemo(() => {
    let sortableItems = [...activities];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [activities, sortConfig]);

  // Chart Data Preparation
  const chartData = {
    labels: sortedActivities.slice().reverse().map(a => new Date(a.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: sortedActivities.slice().reverse().map(a => Number(a.co2_emitted)),
        borderColor: '#10b981', // Emerald 500
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 14, weight: 'bold' as const },
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} kg CO₂`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  // Helper to render category badges
  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      Transport: 'bg-emerald-100 text-emerald-700',
      Food: 'bg-orange-100 text-orange-700',
      Energy: 'bg-blue-100 text-blue-700',
      Waste: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen  p-6 lg:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity History</h1>
            <p className="text-slate-500 mt-1">View and analyze your past carbon emissions.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <DownloadIcon /> Export Data
          </button>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Emission Trends</h3>
            <div className="flex gap-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Total Logs: {activities.length}
                </span>
            </div>
          </div>
          <div className="h-72 w-full">
            {isLoading ? (
               <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">Loading chart...</div>
            ) : activities.length > 0 ? (
               <Line data={chartData} options={chartOptions} />
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400">No data available for this period.</div>
            )}
          </div>
        </div>

        {/* Filters & Table Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <FilterIcon />
                <span>Filter By Date:</span>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input 
                  type="date" 
                  className="w-full md:w-40 pl-3 pr-2 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-600"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <span className="text-slate-400 text-sm">to</span>
              <div className="relative flex-1 md:flex-none">
                <input 
                  type="date" 
                  className="w-full md:w-40 pl-3 pr-2 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-600"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-700 group" onClick={() => handleSort('activity_date')}>
                    <div className="flex items-center gap-1">Date <ChevronDown /></div>
                  </th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-700 group" onClick={() => handleSort('value')}>
                    <div className="flex items-center justify-end gap-1">Amount <ChevronDown /></div>
                  </th>
                  <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-700 group" onClick={() => handleSort('co2_emitted')}>
                    <div className="flex items-center justify-end gap-1">CO₂ (kg) <ChevronDown /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : sortedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No activities found for this period.
                    </td>
                  </tr>
                ) : (
                  sortedActivities.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                        {new Date(log.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <div className="font-semibold">{log.activity_name}</div>
                        {log.notes && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{log.notes}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(log.category)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-right font-mono">
                        {Number(log.value).toLocaleString()} <span className="text-xs text-slate-400">{log.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {Number(log.co2_emitted).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer (Visual Only for now) */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
             <p className="text-xs text-slate-500">Showing <span className="font-bold text-slate-700">{sortedActivities.length}</span> results</p>
             <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}