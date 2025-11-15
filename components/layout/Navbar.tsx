"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, Settings, Ticket } from "lucide-react";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";
type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: HomeIcon },
  { href: '/device-registry', label: 'Registered Devices', icon: Ticket },
  { href: '/settings', label: 'Settings', icon: Settings },
];
export default function Navbar() {
  const pathname = usePathname(); 
  const session = useSession();
  console.log('session', session);
  return (
    <>
      <header className=" shadow-sm rounded-lg p-4 ">
        <div className="flex justify-between items-center gap-8 mx-4">
          <Image
            src="/logo.png"
            alt="Cft Logo"
            width={75}
            height={75}
            priority
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
                    <span className="font-medium text-sm">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
          {
            session.data?
            <div className="flex items-center gap-4">
            <div className=" bg-white p-2 rounded-lg  gap-2 mr-2">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {session.data?.user?.name}
              </span> 
            </div>
            <Button onClick={()=>signOut()} variant="secondary" size="md">
              Logout
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
