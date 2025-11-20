'use client'
import { MenuIcon, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import ActivityModal from '../ui/ActivityModal';
import Button from '../ui/Button';
type HeaderProps = {
  setSidebarOpen: (val: boolean) => void;
};
const Header = ({ setSidebarOpen }: HeaderProps) => {
 
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    return (
        <div>
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <MenuIcon />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
                        <p className="text-xs text-gray-500 hidden sm:block">Welcome back, heres your daily footprint.</p>
                    </div>
                </div>
                <Button variant="primary" onClick={()=>setIsModalOpen(true)}><div className="flex items-center gap-2"><PlusIcon /> <span>Add new activity</span></div></Button>

            </header>
            <ActivityModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
        </div>
    );
}

export default Header;
