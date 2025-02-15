'use client';
import React from 'react';
import { Clock, DollarSign, CalendarDays } from 'lucide-react';

export default function PartTimeWork() {
    return (
        <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md">
            <div className="h-full p-5">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-gray-500" />
                    <h3 className="text-[15px] font-medium text-gray-700">
                        이번 달 근무 현황
                    </h3>
                </div>

                <div className="flex flex-col gap-2">
                    {/* 추가 근무 시간 */}
                    <div className="h-[60px] flex items-center justify-between p-4 bg-gray-50 
                                  rounded-lg hover:bg-gray-100 transition-colors mt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-500">추가 근무</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-lg font-semibold text-gray-800">30</span>
                            <span className="text-sm text-gray-500 ml-1">시간</span>
                        </div>
                    </div>

                    {/* 추가 수당 */}
                    <div className="h-[60px] flex items-center justify-between p-4 bg-gray-50 
                                  rounded-lg hover:bg-gray-100 transition-colors mt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-500">추가 수당</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-lg font-semibold text-gray-800">312,158</span>
                            <span className="text-sm text-gray-500 ml-1">원</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
