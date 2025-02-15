import { create } from 'zustand';

export const useScheduleChangeStore = create((set) => ({
    missedShifts: [
        { id: 1, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
        { id: 2, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
        { id: 3, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
        { id: 4, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
        { id: 5, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
        { id: 6, date: '2025-02-11', branch: '덕명점', time: { start: '10:00', end: '13:00' } },
    ],
    additionalShifts: [
        { id: 7, date: '2025-02-11', branch: '노은점', time: { start: '10:00', end: '13:00' } },
        { id: 8, date: '2025-02-11', branch: '노은점', time: { start: '10:00', end: '14:00' } },
        { id: 9, date: '2025-02-11', branch: '노은점', time: { start: '10:00', end: '14:00' } },
        { id: 10, date: '2025-02-11', branch: '노은점', time: { start: '10:00', end: '14:00' } },
        { id: 11, date: '2025-02-11', branch: '노은점', time: { start: '10:00', end: '14:00' } },
    ],
    isLoading: false,
    fetchShifts: async () => {
        set({ isLoading: true });
        try {
            // 백엔드 연동 전까지는 현재 상태 유지
            set(state => ({
                ...state,
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to fetch schedule changes:', error);
            set({ isLoading: false });
        }
    },
}));