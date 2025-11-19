"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, LogOut, Settings, Ticket } from "lucide-react";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";
type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/device-registry', label: 'Registered Devices', icon: Ticket },
  { href: '/settings', label: 'Settings', icon: Settings },
];
export default function Navbar() {
  const pathname = usePathname(); 
  const session = useSession();
  console.log('session', session);
  return (
    <>
      <header className=" rounded-lg p-4 ">
        <div className="flex justify-between items-center gap-8 mx-4">
          <Image
            src="/logo.png"
            alt="Cft Logo"
            width={75}
            height={75} 
          />
          <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isLabel = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className={`flex items-center gap-2 py-2 rounded-lg transition-all duration-300 ${!isLabel ? "px-3" : "px-4"
                    } ${isActive
                      ? "bg-[#046307] text-white shadow"
                      : "text-gray-500 hover:bg-gray-200"
                    } active:scale-95`}
                >
                  <link.icon className="h-5 w-5" />
                  {isLabel && (
                    <span className="font-medium p-1 text-sm">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
          {
            session.data?
            <div className="flex items-center gap-4">
            <div className="flex bg-white px-6 py-1 rounded-[100px] items-center gap-3 shadow">
              <div className="">
                <p className="font-medium text-gray-800">{session.data?.user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{session.data?.user?.email}</p>
              </div>
            </div>

            <Button onClick={()=>signOut()} variant="danger" size="md">
              <span className="flex gap-2"><LogOut/>
              Logout</span>
              
            </Button>
          </div>:
          <div>
            <Link href="/login" className="text-white bg-[#046307] px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all">
              Login
            </Link>
          </div>
          }
          
        </div>
      </header>
    </>
  );
}
