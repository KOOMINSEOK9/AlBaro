import React from 'react';
import Profile from '@/app/components/pages/manager/mypage/Profile';
import AlbaList from '@/app/components/pages/manager/mypage/AlbaList';
import Notifications from '@/app/components/pages/manager/mypage/Notifications';
import ShiftList from '@/app/components/pages/manager/mypage/ShiftList';
import { Menu } from 'lucide-react';

export default function ManagerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header - Only visible on mobile */}
            <header className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold">Manager Dashboard</h1>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src="/dongseok.jpg" alt="Profile" className="w-full h-full object-cover" />
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

                            {/* Alba List - Full width on mobile */}
                            <div className="lg:col-span-10">
                                <div className="lg:h-[230px]">
                                    <AlbaList />
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

                    {/* Shift List - Full width on mobile */}
                    <div className="lg:h-[370px]">
                        <ShiftList />
                    </div>
                </div>

                {/* Mobile Navigation - Fixed bottom nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
                    <div className="flex justify-around items-center h-16">
                        <button className="flex flex-col items-center justify-center w-full py-2 text-blue-500">
                            <span className="block h-6 w-6 mb-1">🏠</span>
                            <span className="text-xs">Home</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-full py-2">
                            <span className="block h-6 w-6 mb-1">👥</span>
                            <span className="text-xs">Staff</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-full py-2">
                            <span className="block h-6 w-6 mb-1">📅</span>
                            <span className="text-xs">Schedule</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-full py-2">
                            <span className="block h-6 w-6 mb-1">⚙️</span>
                            <span className="text-xs">Settings</span>
                        </button>
                    </div>
                </nav>
            </main>
        </div>
    );
}