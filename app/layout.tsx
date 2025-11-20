'use client'; 
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";  
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //sconst session = await getServerSession(authOptions); 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-red-500 `}>
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