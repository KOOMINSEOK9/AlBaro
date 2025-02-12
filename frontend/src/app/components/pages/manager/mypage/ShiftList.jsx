'use client';
import React, { useEffect, useState } from 'react';
import { ClipboardX, ClipboardCheck, ClipboardList, CalendarRange } from 'lucide-react';
import { useShiftStore } from '@/store/shiftStore';
import Image from 'next/image';

export default function ShiftList() {
    const { shifts, isLoading, fetchShifts } = useShiftStore();
    const [activeTab, setActiveTab] = useState('vacancy');

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);

    const tabs = [
        { id: 'vacancy', label: '우리 지점 공석', icon: ClipboardX, color: 'red' },
        { id: 'ourStore', label: '우리 지점 대타', icon: ClipboardCheck, color: 'blue' },
        { id: 'otherStore', label: '타지점 대타', icon: ClipboardList, color: 'green' }
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const ShiftCard = ({ shift }) => (
        <div className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-lg 
           transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full relative overflow-hidden shrink-0
                   ${shift.type === 'vacancy' ? 'ring-2 ring-red-100' :
                        shift.type === 'ourStore' ? 'ring-2 ring-blue-100' :
                            'ring-2 ring-green-100'}`}>
                    <Image
                        src={shift.profileImage}
                        alt={shift.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{shift.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
                        <CalendarRange className="w-3.5 h-3.5 shrink-0" />
                        <span>{shift.date}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop Layout */}
            <div className="h-full hidden lg:grid grid-cols-3 gap-6 p-6">
                {tabs.map(tab => (
                    <div key={tab.id} className="overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <tab.icon className={`w-5 h-5 text-${tab.color}-500 shrink-0`} />
                                <h3 className="text-[15px] font-medium text-gray-800">{tab.label}</h3>
                            </div>
                            <span className="text-sm text-gray-500 shrink-0">
                                {shifts.filter(s => s.type === tab.id).length}명
                            </span>
                        </div>
                        <div className="h-[calc(100%-2rem)] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {shifts
                                .filter(s => s.type === tab.id)
                                .map(shift => (
                                    <ShiftCard key={shift.id} shift={shift} />
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-full">
                {/* Tab Menu */}
                <div className="relative flex px-2 py-3 gap-2 border-b border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-full text-sm font-medium
                                transition-all duration-300 ease-out active:scale-95
                                ${activeTab === tab.id
                                    ? `bg-${tab.color}-50 text-${tab.color}-600 ring-1 ring-${tab.color}-200 shadow-sm`
                                    : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <tab.icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                            <span className="truncate">{tab.label.replace('우리 지점 ', '')}</span>
                            <span className={`text-xs ${activeTab === tab.id ? `text-${tab.color}-500` : 'text-gray-400'}`}>
                                {shifts.filter(s => s.type === tab.id).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 h-[calc(100%-56px)] overflow-y-auto p-3">
                    <div className="space-y-2">
                        {shifts
                            .filter(s => s.type === activeTab)
                            .map(shift => (
                                <div key={shift.id} className="transition-all duration-300">
                                    <ShiftCard shift={shift} />
                                </div>
                            ))}
                        {shifts.filter(s => s.type === activeTab).length === 0 && (
                            <div className="flex items-center justify-center h-32 text-gray-500">
                                목록이 없습니다
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}