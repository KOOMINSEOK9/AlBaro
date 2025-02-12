import { create } from 'zustand';

export const useManagerStore = create((set, get) => ({
    // 점장 정보
    managerInfo: {
        name: '나점장',
        store: '덕명점',
        profileImage: null
    },
    albaList: [],
    notifications: [],
    shifts: [],

    // 알림 관련 액션 추가
    updateShiftStatus: async (notificationId, status) => {
        try {
            const shifts = get().shifts;
            const updatedShifts = shifts.map(shift =>
                shift.notificationId === notificationId ? { ...shift, status } : shift
            );
            set({ shifts: updatedShifts });
        } catch (error) {
            console.error('Failed to update shift status:', error);
            throw error;
        }
    },

    removeNotification: async (notificationId) => {
        try {
            const notifications = get().notifications;
            const updatedNotifications = notifications.filter(noti => noti.id !== notificationId);
            set({ notifications: updatedNotifications });
        } catch (error) {
            console.error('Failed to remove notification:', error);
            throw error;
        }
    },

    sendRejectionNotification: async (requesterId) => {
        try {
            // 거절 알림 전송 로직
            console.log('Rejection notification sent to:', requesterId);
        } catch (error) {
            console.error('Failed to send rejection notification:', error);
            throw error;
        }
    }
}));