'use client';
import React from 'react';
import { Bell, UserCheck, Clock, AlertCircle, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from '@/styles/scrollbar.module.css';

export default function Notifications() {
    const [notifications, setNotifications] = React.useState([]);
    const [removingId, setRemovingId] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [error, setError] = React.useState(null);

    // 알림 조회
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const decoded = jwtDecode(token);
            const userId = decoded.userId;

            const response = await axios.get(
                // `http://localhost:8080/api/substitute/alarms/${userId}`,
                `https://i12b105.p.ssafy.io/api/substitute/alarms/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Received notifications:', response.data);
            setNotifications(response.data);
        } catch (err) {
            console.error('알림 조회 실패:', err);
        }
    };

    // 초기 알림 조회 및 주기적 업데이트
    React.useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications();
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (date) => {
        if (!date) return '';

        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.log('Invalid date:', date);
                return '';
            }

            const timeAgo = formatDistanceToNow(dateObj, {
                addSuffix: true,
                locale: ko
            });

            const hoursDiff = Math.abs(new Date() - dateObj) / 36e5;
            if (hoursDiff >= 24) {
                return dateObj.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });
            }

            return timeAgo;
        } catch (err) {
            console.error('Date formatting error:', err);
            return '';
        }
    };

    const handleNotificationAction = async (noti, isApproved) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            setRemovingId(noti.alarmId);



            if (noti.alarmType === 'SUBSTITUTION_REQUEST') {

                // 알림 내용에서 날짜와 시간 추출
                const contentMatch = noti.alarmContent.match(/(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})~(\d{2}:\d{2})/);
                if (!contentMatch) {
                    console.error('날짜와 시간 정보를 찾을 수 없습니다.');
                    return;
                }

                const [, workDate, startTime, endTime] = contentMatch;

                const endpoint = isApproved ? 'approve-subRequest' : 'reject-subRequest';

                console.log('요청 데이터:', {
                    alarmId: noti.alarmId,
                    workDate,
                    startTime,
                    endTime
                });

                await axios.post(
                    // `http://localhost:8080/api/substitute/${endpoint}/${noti.alarmId}`,
                    `https://i12b105.p.ssafy.io/api/substitute/${endpoint}/${noti.alarmId}`,
                    null,
                    {
                        params: {
                            workDate,
                            startTime,
                            endTime
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            await fetchNotifications();
        } catch (err) {
            console.error('요청 처리 실패:', err);
            console.error('에러 세부 정보:', err.response?.data);
        } finally {
            setTimeout(() => {
                setRemovingId(null);
            }, 300);
        }
    };

    return (
        <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <h3 className="text-[15px] font-medium text-gray-700">
                        알림
                        {notifications.length > 0 && (
                            <span className="ml-2 text-sm text-gray-400 font-normal">
                                {notifications.length}개
                            </span>
                        )}
                    </h3>
                </div>
            </div>

            <div className={`h-[calc(100%-3.5rem)] overflow-y-auto space-y-2 pr-2 snap-y snap-mandatory ${styles.customScrollbar}`}>
                {notifications.map((noti) => (
                    <div
                        key={noti.alarmId}
                        className={`bg-gray-50 rounded-lg p-3 relative group snap-start
                            transition-all duration-300 ease-in-out hover:shadow-sm
                            ${removingId === noti.alarmId ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <AlertCircle className="text-blue-500" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium mb-1">
                                    {noti.alarmContent}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {formatRelativeTime(noti.sentTime)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {noti.alarmType === 'SUBSTITUTION_REQUEST' && (
                                    <>
                                        <button
                                            onClick={() => handleNotificationAction(noti, true)}
                                            className="h-9 w-9 bg-blue-500 text-white rounded-full
                                                hover:bg-blue-600 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                                            aria-label="수락"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleNotificationAction(noti, false)}
                                            className="h-9 w-9 border border-gray-300 rounded-full
                                                hover:bg-gray-100 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                                            aria-label="거절"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                )}
                                {noti.alarmType !== 'SUBSTITUTION_REQUEST' && (
                                    <button
                                        onClick={() => handleNotificationAction(noti, null)}
                                        className="px-4 py-2 text-xs text-white bg-gray-500 hover:bg-gray-600
                                            transition-transform hover:scale-105 active:scale-95 rounded-full shadow-md"
                                    >
                                        확인
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        새로운 알림이 없습니다
                    </div>
                )}
            </div>
        </div>
    );
}