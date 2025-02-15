'use client';
import React from 'react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Profile() {
    return (
        <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md">
            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col items-center justify-center h-full p-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative border border-gray-100 shadow-sm">
                    <Image
                        src="/boyoung.jpg"
                        alt="프로필 이미지"
                        fill
                        sizes="(max-width: 96px) 100vw"
                        className="object-cover"
                        priority
                    />
                </div>
                <h2 className="text-xl font-bold text-center">박보영</h2>
                <div className="flex items-center justify-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>덕명점</span>
                </div>
            </div>

            {/* Mobile Layout - 2024 Trend */}
            <div className="lg:hidden h-full flex items-center p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-100 overflow-hidden relative">
                        <Image
                            src="/boyoung.jpg"
                            alt="프로필 이미지"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">박보영</h2>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>덕명점</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}