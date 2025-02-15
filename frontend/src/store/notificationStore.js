// src/store/notificationStore.js
import { create } from 'zustand';
// import axios from 'axios';

const useNotificationStore = create((set, get) => ({
    notifications: [
        {
            id: 1,
            type: 'request',
            title: '대타 요청',
            content: '이싸피님이 2025년 2월 16일 오후 3시 근무 대타를 요청했습니다.',
            createdAt: '2025-02-15T01:30:00Z',
        },
        {
            id: 2,
            type: 'schedule',
            title: '스케줄 변경',
            content: '김싸피님의 6월 20일 근무가 변경되었습니다.',
            createdAt: '2025-02-09T10:00:00Z',
        },
        // ... 더미 데이터 추가
    ],
    page: 1,
    limit: 10,
    fetchNotifications: async () => {
        try {
            // const res = await axios.get(`/api/notifications?page=${get().page}&limit=${get().limit}`);
            // set((state) => ({ notifications: [...state.notifications, ...res.data] }));
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((noti) => noti.id !== id),
        }));
    },
    nextPage: () => set((state) => ({ page: state.page + 1 })),
}));

export default useNotificationStore;