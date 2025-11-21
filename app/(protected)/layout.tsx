'use client'
import Header from '@/components/protected/Header';
import Sidebar from '@/components/protected/Sidebar';
import React, { useState } from 'react';

const Layout = ({children}:{children:React.ReactNode}) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    return (
        <div className='flex min-h-screen  font-sans text-gray-900'>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            <Sidebar sidebarOpen={sidebarOpen}/>

            <main className='flex-1 flex flex-col min-w-0 overflow-hidden'>

                <Header setSidebarOpen={setSidebarOpen} />
                {children}
            </main>
        </div>
    );
}

export default Layout;
