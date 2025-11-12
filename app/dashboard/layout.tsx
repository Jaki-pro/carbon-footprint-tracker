'use client';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const sessin = useSession();
    console.log(sessin, '---------->>>>>>>');
    return (
        <div>
            {children}
        </div>
    );
}
 
