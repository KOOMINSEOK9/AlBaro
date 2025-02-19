'use client';
import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function PartTimeWork() {
    const [workTime, setWorkTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2024년 최저시급
    const MINIMUM_WAGE = 9860;

    useEffect(() => {
        const fetchWorkTimeChange = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setError('로그인이 필요합니다.');
                    return;
                }

                // JWT 토큰 디코딩하여 userId 추출
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                // const response = await axios.get(`http://localhost:8080/api/user-work/total-change-time/${userId}`, {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-work/total-change-time/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setWorkTime(response.data);
                setError(null);
            } catch (err) {
                setError('근무 정보를 불러오는데 실패했습니다.');
                console.error('Error fetching work time:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkTimeChange();
    }, []);

    // 추가 수당 계산 (음수일 경우 0원, 양수일 경우 근무시간 * 최저시급)
    const calculateExtraPay = () => {
        return workTime > 0 ? workTime * MINIMUM_WAGE : 0;
    };

    if (loading) {
        return <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md flex items-center justify-center">
            <p>로딩 중...</p>
        </div>;
    }

    if (error) {
        return <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>;
    }

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
                            <span className="text-lg font-semibold text-gray-800">{workTime}</span>
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
                            <span className="text-lg font-semibold text-gray-800">
                                {calculateExtraPay().toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">원</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}