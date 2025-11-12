'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; 
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions); 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider >
          <Navbar />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}