'use client";'
import React, { useState } from "react";
const DashboardHeader = () => {
  return (
    <div>
      <header className="bg-white shadow-sm rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4"> 
          <button
            className="flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            <span>Export Data</span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default DashboardHeader;
