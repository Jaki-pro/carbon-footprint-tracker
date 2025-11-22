'use client'
import StatCard from '@/components/dashboard/StatCard';
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement, 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'; 
import { processActivityData } from '@/utils/processActivityData';
import { Loader} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUserStatus } from '@/context/UserStatusContext';

// --- Register ChartJS Components ---
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);
type DashboardData = {
    stats: {
        today: number;
        week: number;
        month: number;
    };
    byCategory: { category: string; total: number }[];
    weeklyTrend: { date: string; total: number }[];
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { size: 13 },
            bodyFont: { size: 14, weight: 'bold' as const },
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { display: true, color: '#f3f4f6', drawBorder: false },
            ticks: { font: { size: 11 }, color: '#9ca3af' },
            border: { display: false }
        },
        x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#9ca3af' }
        }
    },
};
const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: { usePointStyle: true, padding: 20, font: { size: 12 }, color: '#4b5563' }
        }
    }
};

const Page = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {isNewUser, setIsNewUser} = useUserStatus();
    useEffect(() => {
        setIsLoading(true);
        const fetchEmissionFactors = async () => {
            try {
                const response = await fetch('/api/activities');
                const data = await response.json();
                const dashboardData = processActivityData(data);
                setTimeout(() => {
                    setData(dashboardData);
                    setIsLoading(false);
                }, 800);
            if(data?.length) setIsNewUser(false);
            } catch (error) {
                console.error('Failed to fetch emission factors:', error);
            } finally{
                setIsLoading(false)
            }
        };
        fetchEmissionFactors();
    }, [isNewUser])
    if(isLoading) return <div className='flex h-screen items-center justify-center'><Loader/></div>
    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
            <div className="max-w-full mx-auto space-y-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Today's Emissions"
                        value={data?.stats.today || 0}
                        unit="kg CO₂"
                        colorClass="bg-blue-500"
                        trend="Low Impact"
                    />
                    <StatCard
                        title="This Week"
                        value={data?.stats.week || 0}
                        unit="kg CO₂"
                        colorClass="bg-emerald-500"
                        trend="-12% vs last week"
                    />
                    <StatCard
                        title="Monthly Total"
                        value={data?.stats.month || 0}
                        unit="kg CO₂"
                        colorClass="bg-violet-500"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Weekly Trend Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Emission Trends</h3>
                                <p className="text-sm text-gray-500">Daily carbon footprint over the last 7 days</p>
                            </div>
                            <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-emerald-500 focus:border-emerald-500">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-72 w-full">
                            <Bar
                                data={{
                                    labels: data?.weeklyTrend.map(d => d.date),
                                    datasets: [{
                                        label: 'CO₂ (kg)',
                                        data: data?.weeklyTrend.map(d => d.total),
                                        backgroundColor: '#10b981',
                                        borderRadius: 6,
                                        hoverBackgroundColor: '#059669',
                                        barThickness: 24,
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>

                    {/* Category Breakdown Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Impact by Source</h3>
                        <p className="text-sm text-gray-500 mb-6">Distribution of your carbon footprint</p>

                        <div className="relative flex-1 min-h-[250px]">
                            <Doughnut
                                data={{
                                    labels: data?.byCategory.map(c => c.category) || [],
                                    datasets: [{
                                        data: data?.byCategory.map(c => c.total) || [],
                                        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
                                        borderWidth: 0,
                                    }]
                                }}
                                options={doughnutOptions}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-800">{data?.stats.month.toFixed(0)}</span>
                                <span className="text-xs text-gray-400 uppercase font-semibold">Total kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner/Callout */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-8 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">🌱 Keep up the great work!</h3>
                            <p className="text-emerald-100 max-w-xl">
                                You've maintained a low carbon footprint for 3 days in a row. Check out our new recommendations to reduce your energy consumption even further.
                            </p>
                        </div>
                        <Button variant={`ping`} className='flex justify-center items-center'><span>View Insights</span></Button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400 opacity-10 rounded-full blur-2xl"></div>
                </div>

            </div>
        </div>
    );
}

export default Page;
