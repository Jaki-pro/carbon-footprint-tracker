import { HistoryIcon, LayoutDashboardIcon, LucideBadgeRussianRuble, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { NavLink } from '../layout/Navbar';
import { usePathname } from 'next/navigation';

const siderbarLinks: NavLink[] = [
    { href: '/dashboard', label: 'Dashoard', icon: LayoutDashboardIcon },
    { href: '/dashboard/activity-history', label: 'Activity History', icon: HistoryIcon },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: LucideBadgeRussianRuble },
];
const SidebarItem = ({ icon, href = "/dashboard", label, active = false }: { icon: React.ReactNode, href?: string, label: string, active?: boolean }) => {
    const path = usePathname();
    active = href===path;
    return <Link href={href || "#"} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
        <div className={`${active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            {icon}
        </div>
        <span>{label}</span>
    </Link>
};

const LeafOutline = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;


const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
    return (
        <aside className={`rounded-tr-lg fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 flex items-center gap-3 border-b border-gray-100 h-20">
                <div className="bg-emerald-600 p-2 rounded-lg text-white">
                    <LeafOutline />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">EcoTracker</span>
            </div>

            <nav className="p-4 space-y-2 mt-4">
                {
                    siderbarLinks.map((link) => <SidebarItem key={link.href} href={link.href} label={link.label} icon={<link.icon />} />)
                }
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
