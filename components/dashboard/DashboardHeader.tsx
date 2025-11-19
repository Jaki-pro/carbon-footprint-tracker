'use client";'
import React, { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import ActivityModal from "../ui/ActivityModal";
import { Plus } from "lucide-react";
const userDevices = [
  { deviceId: "Device001", deviceName: "Living Room Sensor" },
  { deviceId: "Device002", deviceName: "Kitchen Sensor" },
  { deviceId: "Device003", deviceName: "Bedroom Sensor" },
];
const DashboardHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm rounded-lg p-4 ">
      <div className="flex justify-between  items-center gap-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary">

          <span className="flex"><Plus/>Add new Activity</span>
        </Button>
        <Button
          variant="secondary">
          <span>Export Activities</span>
        </Button>


      </div>
      <ActivityModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </header>
  );
};

export default DashboardHeader;
