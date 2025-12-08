"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlignHorizontalDistributeEndIcon,
  Contact,
  HomeIcon,
  LogOut,
  LucideFileChartColumnIncreasing,
  Menu,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";

export type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: LucideFileChartColumnIncreasing },
  { href: "/about", label: "About", icon: AlignHorizontalDistributeEndIcon },
  { href: "/contact", label: "Contact", icon: Contact },
];

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleMobile = () => setIsMobileOpen((prev) => !prev);
  const handleCloseMobile = () => setIsMobileOpen(false);

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href) && pathname !== "/";
  };

  const isAuthenticated = session.status === "authenticated";

  return (
    <header className="w-full   backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={handleCloseMobile}>
          <Image src="/logo.png" alt="Cft Logo" width={60} height={60} />
        </Link>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl ">
          {navLinks.map((link) => {
            if (link.href === "/dashboard" && !isAuthenticated) return null;

            const active = isLinkActive(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                title={link.label}
                className={`flex items-center gap-2 py-2  rounded-full transition-all duration-200 active:scale-95 ${
                  active ? "px-5" : "px-4"
                } ${
                  active
                    ? "text-sm  font-semibold text-white bg-emerald-600 shadow-sm hover:bg-emerald-700 hover:shadow-md"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                {active && <link.icon className="h-5 w-5" />}
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && session.data ? (
            <>
              
              <Button
                onClick={() => signOut()}
                className="rounded-xl"
                variant="danger"
                size="md"
                title="logout"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="md" className="rounded-xl">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Right: Mobile controls (auth + hamburger) */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
               
              <button
                onClick={() => signOut()}
                className="rounded-full border bg-white px-2 py-2 shadow-sm"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="rounded-full px-4">
                Login
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={handleToggleMobile}
            className="inline-flex items-center justify-center rounded-full border bg-white p-2 shadow-sm active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {isMobileOpen && (
        <div className="md:hidden   backdrop-blur-sm shadow-sm">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6 lg:px-8">
            {navLinks.map((link) => {
              if (link.href === "/dashboard" && !isAuthenticated) return null;

              const active = isLinkActive(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleCloseMobile}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <link.icon
                      className={`h-5 w-5 ${
                        active ? "text-emerald-600" : "text-gray-500"
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>
                  {active && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Active
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
