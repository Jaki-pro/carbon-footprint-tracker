'use client";'
import React, { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
const userDevices = [
  { deviceId: "Device001", deviceName: "Living Room Sensor" },
  { deviceId: "Device002", deviceName: "Kitchen Sensor" },
  { deviceId: "Device003", deviceName: "Bedroom Sensor" },
];
const DashboardHeader = () => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDevicesLoading, setIsDevicesLoading] = useState(false); // Simulated loading state 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const onClose = () => {
    setIsOptionsOpen(false);
    setSelectedDevice(null);
    setIsModalOpen(false);
  }
  return (
    <header className="bg-white shadow-sm rounded-lg p-4 ">
      <div className="flex justify-between  items-center gap-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary">

          <span>Add new Activity</span>
        </Button>
        <Button
          variant="primary">
          <span>Export Activities</span>
        </Button>


      </div>
      <Modal

        isOpen={isModalOpen}
        onClose={onClose}
        modalName="Add Activity"
      >
        <div className="relative min-w-[280px]">
          <button
            type="button"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="w-full min-w-[280px] px-4 h-[60px] rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#00A4E6]/70 focus:border-[#00A4E6] transition-all cursor-pointer appearance-none relative text-left flex items-center"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2362778F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "18px",
              paddingRight: "3rem",
            }}
          >
            <span className="truncate text-center">
              {selectedDevice
                ? `${selectedDevice} - ${userDevices.find(d => d.deviceId === selectedDevice)?.deviceName || ''}`
                : (isDevicesLoading ? "Loading devices..." : "Activity Type")
              }
            </span>
          </button>

          {isOptionsOpen && (
            <ul className="absolute z-50 w-full min-w-[280px] mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-auto">
              {userDevices.map((device) => (
                <li
                  key={device.deviceId}
                  onClick={() => {
                    setSelectedDevice(device.deviceId);
                    setIsOptionsOpen(false);
                  }}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 truncate"
                >
                  {device.deviceId} - {device.deviceName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
      <label
        htmlFor="quantity-input"
        className="text-base font-semibold text-stone-800 mb-2 block"
      >
        Amount
      </label>

      <div className="relative">
        <input
          type="number"
          id="quantity-input"
          name="quantity"
          placeholder="e.g., 15"
          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-base rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-3 pr-20"
          required 
        />

        <span
          className="absolute right-0 top-0 h-full flex items-center px-4 m-px bg-stone-200 text-stone-700 font-medium rounded-r-lg text-base"
        >
          {'kg CO₂'}
        </span>
      </div>
    </div>

      </Modal>
    </header>
  );
};

export default DashboardHeader;
