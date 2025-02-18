"use client";

import React from "react";
import Profile from "@/app/components/pages/part-timer/Profile";
import PartTimeWork from "@/app/components/pages/part-timer/PartTimeWork";
import Notifications from "@/app/components/pages/part-timer/Notifications";
import WorkManagement from "@/app/components/pages/part-timer/WorkManagement";
import { Menu } from "lucide-react";
import Header from "@/app/components/common/header";

export default function EmployeePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Mobile Header - Only visible on mobile */}
      <header className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">Employee Dashboard</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="/boyoung.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="lg:h-[calc(100vh-6rem)] pt-16 lg:pt-8 pb-16">
        <div className="mx-auto px-4 lg:px-24">
          {/* Top Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-24 lg:gap-5">
              {/* Profile - Full width on mobile */}
              <div className="lg:col-span-5">
                <div className="lg:h-[230px]">
                  <Profile />
                </div>
              </div>

              {/* PartTimeWork - Full width on mobile */}
              <div className="lg:col-span-10">
                <div className="lg:h-[230px]">
                  <PartTimeWork />
                </div>
              </div>

              {/* Notifications - Full width on mobile */}
              <div className="lg:col-span-9">
                <div className="lg:h-[230px]">
                  <Notifications />
                </div>
              </div>
            </div>
          </div>

          {/* Work Management - Full width on mobile */}
          <div className="lg:h-[370px]">
            <WorkManagement />
          </div>
        </div>


      </main>
    </div>
  );
}
