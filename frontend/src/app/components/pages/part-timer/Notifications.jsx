'use client';
import React from 'react';
import { Bell, UserCheck, Clock, AlertCircle, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import usePartTimerNotificationStore from '@/store/partTimerNotificationStore';
import styles from '@/styles/scrollbar.module.css';

export default function Notifications() {
    const { notifications, removeNotification } = usePartTimerNotificationStore();
    const [removingId, setRemovingId] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    // 1분마다 시간 업데이트
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (date) => {
        const timeAgo = formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: ko
        });

        // 24시간이 지났다면 날짜로 표시
        const hoursDiff = Math.abs(new Date() - new Date(date)) / 36e5;
        if (hoursDiff >= 24) {
            return new Date(date).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        }

        return timeAgo;
    };

    const handleNotificationAction = async (id) => {
        setRemovingId(id);
        setTimeout(() => {
            removeNotification(id);
        }, 300);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'request':
                return <AlertCircle className="text-blue-500" size={18} />;
            case 'schedule':
                return <Clock className="text-green-500" size={18} />;
            case 'response':
                return <UserCheck className="text-purple-500" size={18} />;
            default:
                return <Bell className="text-gray-500" size={18} />;
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
                        key={noti.id}
                        className={`bg-gray-50 rounded-lg p-3 relative group snap-start
                            transition-all duration-300 ease-in-out hover:shadow-sm
                            ${removingId === noti.id ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(noti.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium mb-1">{noti.title}</p>
                                <p className="text-xs text-gray-500 break-words">
                                    {noti.content}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {formatRelativeTime(noti.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {noti.type === 'request' ? (
                                    <>
                                        <button
                                            onClick={() => handleNotificationAction(noti.id)}
                                            className="h-9 w-9 bg-blue-500 text-white rounded-full
                                                hover:bg-blue-600 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                                            aria-label="수락"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleNotificationAction(noti.id)}
                                            className="h-9 w-9 border border-gray-300 rounded-full
                                                hover:bg-gray-100 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                                            aria-label="거절"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleNotificationAction(noti.id)}
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