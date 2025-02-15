// src/store/partTimerNotificationStore.js
import { create } from 'zustand';

const usePartTimerNotificationStore = create((set, get) => ({
    notifications: [
        {
            id: 1,
            type: 'request',
            title: '대타 요청',
            content: '김싸피님이 2월 20일 오후 3시 근무 대타를 요청했습니다.',
            createdAt: '2025-02-14T12:00:00Z',
        },
        {
            id: 2,
            type: 'request',
            title: '대타 요청',
            content: '김싸피님이 2월 25일 오후 6시 근무 대타를 요청했습니다.',
            createdAt: '2025-02-17T14:30:00Z',
        },
        {
            id: 3,
            type: 'response',
            title: '대타 요청 거절됨',
            content: '2월 17일 오후 3시 근무 대타 요청이 거절되었습니다.',
            createdAt: '2025-02-13T11:15:00Z',
        },
        {
            id: 4,
            type: 'shift',
            title: '대타 근무 확정',
            content: '2월 15일 MegaSSAFY 봉명점점에서의 대타 근무가 확정되었습니다.',
            createdAt: '2025-02-10T09:00:00Z',
        },
    ],
    fetchNotifications: async () => {
        try {
            // 서버에서 알림 데이터 가져오기
            // const res = await axios.get('/api/part-timer/notifications');
            // set({ notifications: res.data });
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((noti) => noti.id !== id),
        }));
    },
}));

export default usePartTimerNotificationStore;