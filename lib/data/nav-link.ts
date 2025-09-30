import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Trophy,
  Users,
  Settings,
  LifeBuoy,
} from "lucide-react";

export const mainSidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-activity', label: 'Log Activity', icon: PlusCircle },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/community', label: 'Community', icon: Users },
];

export const bottomSidebarLinks = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/support', label: 'Support', icon: LifeBuoy },
]