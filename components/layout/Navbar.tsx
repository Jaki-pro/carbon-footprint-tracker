"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignHorizontalDistributeEndIcon, Contact, HomeIcon, LogOut, LucideFileChartColumnIncreasing, Settings, Ticket } from "lucide-react";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";
type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/features', label: 'Features', icon: LucideFileChartColumnIncreasing },
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
          <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-[100px]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isLabel = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className={`flex mx-2 items-center gap-2 py-2 rounded-[100px] transition-all duration-300 ${!isLabel ? "px-3" : "px-4"
                    } ${isActive
                      ? "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-[100px] shadow-sm hover:bg-emerald-700 hover:shadow-md  "
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
