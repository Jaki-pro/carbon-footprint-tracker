import { TrendingUpIcon } from "lucide-react";

const StatCard = ({ title, value, unit, colorClass, trend }: { title: string, value: number, unit: string, colorClass: string, trend?: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {value.toLocaleString()} 
          <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
         <div className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
         </div>
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
        <TrendingUpIcon />
        <span className="ml-1">{trend}</span>
      </div>
    )}
  </div>
);

export default StatCard;