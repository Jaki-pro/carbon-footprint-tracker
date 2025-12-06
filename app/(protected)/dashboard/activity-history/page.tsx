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
import { downloadCSV } from '@/utils/downloadCSV';

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
  co2_emitted: number;
  notes: string;
  activity_name: string;
  category: 'Transport' | 'Food' | 'Energy' | 'Waste';
  unit: string;
  factor: number; 
};

// --- Icons ---
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

export default function ActivityHistoryPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]); // Table data
  const [chartActivities, setChartActivities] = useState<ActivityLog[]>([]); // Chart data (All)
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ActivityLog; direction: 'asc' | 'desc' }>({ key: 'activity_date', direction: 'desc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Data ---
  // 1. Fetch Chart Data (All items in range)
  useEffect(() => {
    const fetchChartData = async () => {
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('from', dateFrom);
            if (dateTo) params.append('to', dateTo);
            if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
            
            // No limit for chart
            const res = await fetch(`/api/activities?${params.toString()}`);
            if (res.ok) {
                const response = await res.json();
                setChartActivities(response.data);
            }
        } catch (e) { console.error(e); }
    };
    fetchChartData();
  }, [dateFrom, dateTo, categoryFilter]);
  console.log("chart activit", chartActivities);
  // 2. Fetch Table Data (Paginated)
  useEffect(() => {
    const fetchTableData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('from', dateFrom);
            if (dateTo) params.append('to', dateTo);
            if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
            
            params.append('page', currentPage.toString());
            params.append('limit', itemsPerPage.toString());

            const res = await fetch(`/api/activities?${params.toString()}`);
            if (res.ok) {
                const response = await res.json();
                setActivities(response.data);
                setTotalItems(response.pagination.total);
            } else {
                // Mock Fallback for Preview
                if (process.env.NODE_ENV !== 'production') {
                    await new Promise(r => setTimeout(r, 500));
                    const mock: ActivityLog[] = Array.from({ length: itemsPerPage }).map((_, i) => ({
                        id: `id-${i}-${currentPage}`,
                        activity_date: new Date().toISOString(),
                        value: 10 + i,
                        co2_emitted: 5 + i,
                        notes: 'Mock Data',
                        activity_name: 'Mock Activity',
                        category: 'Transport',
                        unit: 'km',
                        factor: 0.5
                    }));
                    setActivities(mock);
                    setTotalItems(35); // Mock total
                }
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchTableData();
  }, [currentPage, dateFrom, dateTo, categoryFilter]);


  // --- Sorting (Client side for current page) ---
  const handleSort = (key: keyof ActivityLog) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedActivities = useMemo(() => {
    const sortableItems = [...activities]; 
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [activities, sortConfig]);

  // --- Pagination Handlers ---
  const paginate = (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
      }
  };

  // --- Editing Logic ---
  const startEditing = (log: ActivityLog) => {
    setEditingId(log.id);
    setEditValue(log.value.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = async (log: ActivityLog) => {
    setIsSaving(true);
    try {
        const newValue = parseFloat(editValue);
        if (isNaN(newValue) || newValue <= 0) {
            alert("Please enter a valid number");
            setIsSaving(false);
            return;
        }

        const res = await fetch('/api/activities', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: log.id, value: newValue })
        });

        if (res.ok) {
            const updatedData = await res.json();
            // Update both table and chart data to reflect change immediately
            const updateList = (list: ActivityLog[]) => list.map(a => 
                a.id === log.id ? { ...a, value: newValue, co2_emitted: updatedData.activity.co2_emitted } : a
            );
            setActivities(prev => updateList(prev));
            setChartActivities(prev => updateList(prev));
            setEditingId(null);
        } 
    } catch (error) {
        console.error("Update failed", error);
    } finally {
        setIsSaving(false);
    }
  };

  // --- Chart Configuration ---
  const chartData = {
    // Use chartActivities (All data) for the chart, not just current page
    labels: sortedActivities?.slice().reverse().map(a => new Date(a.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: sortedActivities?.slice().reverse().map(a => Number(a.co2_emitted)),
        borderColor: '#10b981',
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
        pointRadius: 3,
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

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      Transport: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Food: 'bg-orange-100 text-orange-700 border-orange-200',
      Energy: 'bg-blue-100 text-blue-700 border-blue-200',
      Waste: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[category] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
          <button onClick={()=>downloadCSV("carbon-footprint.csv", activities)} className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <DownloadIcon /> Export Data
          </button>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Emission Trends</h3>
            <div className="flex gap-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Displaying: {chartActivities.length} Records
                </span>
            </div>
          </div>
          <div className="h-72 w-full">
            {sortedActivities.length > 0 ? (
               <Line data={chartData} options={chartOptions} />
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400">
                   {isLoading ? 'Loading...' : 'No data available for trend analysis.'}
               </div>
            )}
          </div>
        </div>

        {/* Filters & Table Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <FilterIcon />
                <span>Filter:</span>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
              
              {/* Category Filter */}
              <div className="relative">
                 <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none bg-white text-slate-600 cursor-pointer"
                 >
                    <option value="All">All Categories</option>
                    <option value="Transport">Transport</option>
                    <option value="Food">Food</option>
                    <option value="Energy">Energy</option>
                    <option value="Waste">Waste</option>
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown />
                 </div>
              </div>

              {/* Date Pickers */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1">
                    <input 
                    type="date" 
                    className="w-full pl-3 pr-2 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-600"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    />
                </div>
                <span className="text-slate-400 text-sm">to</span>
                <div className="relative flex-1">
                    <input 
                    type="date" 
                    className="w-full pl-3 pr-2 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-600"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-700 group w-32" onClick={() => handleSort('activity_date')}>
                    <div className="flex items-center gap-1">Date <ChevronDown /></div>
                  </th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4 w-32">Category</th>
                  <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-700 group w-40" onClick={() => handleSort('value')}>
                    <div className="flex items-center justify-end gap-1">Amount <ChevronDown /></div>
                  </th>
                  <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-700 group w-32" onClick={() => handleSort('co2_emitted')}>
                    <div className="flex items-center justify-end gap-1">CO₂ (kg) <ChevronDown /></div>
                  </th>
                  <th className="px-6 py-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : sortedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No activities found for this period.
                    </td>
                  </tr>
                ) : (
                  sortedActivities.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
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
                      
                      {/* Editable Amount Cell */}
                      <td className="px-6 py-4 text-right font-mono text-sm">
                        {editingId === log.id ? (
                            <div className="flex items-center justify-end gap-1">
                                <input 
                                    type="number" 
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-24 text-right border border-emerald-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    autoFocus
                                />
                                <span className="text-xs text-slate-400 ml-1">{log.unit}</span>
                            </div>
                        ) : (
                            <span className="text-slate-600">
                                {Number(log.value).toLocaleString()} <span className="text-xs text-slate-400">{log.unit}</span>
                            </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {Number(log.co2_emitted).toFixed(2)}
                        </span>
                      </td>

                      {/* Actions Cell */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {editingId === log.id ? (
                            <div className="flex items-center justify-end gap-1">
                                <button onClick={() => saveEditing(log)} disabled={isSaving} className="p-1.5 text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors shadow-sm" title="Save">
                                    <CheckIcon />
                                </button>
                                <button onClick={cancelEditing} disabled={isSaving} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors" title="Cancel">
                                    <XIcon />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => startEditing(log)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Edit Amount"
                            >
                                <PencilIcon />
                            </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
             <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-700">{activities.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold text-slate-700">{totalItems}</span> results
             </p>
             <div className="flex gap-1 items-center">
                <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm mr-2"
                >
                    Previous
                </button>
                
                {/* Page Numbers */}
                <div className="hidden sm:flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let p = i + 1; 
                        // Simple sliding window logic
                        if (totalPages > 5) {
                            if (currentPage > 3) {
                                p = currentPage - 2 + i;
                            }
                            // Keep within bounds
                            if (p > totalPages) p = totalPages - (4 - i); 
                        }
                        
                        if (p <= 0) return null; 

                        return (
                            <button
                                key={p}
                                onClick={() => paginate(p)}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-colors ${currentPage === p ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-white'}`}
                            >
                                {p}
                            </button>
                        )
                    })}
                </div>

                <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm ml-2"
                >
                    Next
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}