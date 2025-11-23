"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignHorizontalDistributeEndIcon, Contact, HomeIcon, LogOut, LucideFileChartColumnIncreasing, Settings, Ticket } from "lucide-react";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";
export type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/dashboard', label: 'Dashoard', icon: LucideFileChartColumnIncreasing },
  { href: '/about', label: 'About', icon: AlignHorizontalDistributeEndIcon }, 
  { href: '/contact', label: 'Contact', icon: Contact }, 
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
          <div className="flex items-center space-x-1   p-1 rounded-xl">
            {navLinks.map((link) => {
              const isActive = link.href === '/'
  ? pathname === '/'
  : pathname.startsWith(link.href);
              const isLabel = pathname.startsWith(link.href);
              if(link.href=='/dashboard' && session?.status!='authenticated') return null;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className={`flex mx-2 items-center  gap-2 py-4 rounded-full transition-all duration-300 ${!isLabel ? "px-4" : "px-5"
                    } ${isActive
                      ? "inline-flex items-center justify-center gap-2 px-5  text-sm font-semibold text-white bg-emerald-600 shadow-sm hover:bg-emerald-700 hover:shadow-md  "
                      : "text-gray-500 hover:bg-gray-100 bg-white"
                    } active:scale-95`}
                >
                  {isLabel && (
                    <link.icon className="h-6 w-6" />
                  )}
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              );
            })}
          </div>
          {
            session.data ?
              <div className="flex items-center gap-4">
                <div className="flex bg-white px-6 py-1 rounded-xl items-center gap-3 shadow">
                  <div className="">
                    <p className="font-medium text-gray-800">{session.data?.user?.name?.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">{session.data?.user?.email}</p>
                  </div>
                </div>

                <Button onClick={() => signOut()} className="rounded-xl" variant="danger" size="md">
                  <span className="flex gap-2"><LogOut />
                    Logout
                  </span>

                </Button>
              </div> :
              <div>
                <Link href="/login" className="">
                  <Button variant='primary'>Login</Button>
                  
                </Link>
              </div>
          }

        </div>
      </header>
    </>
  );
}
