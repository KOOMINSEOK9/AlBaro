// src/store/shiftStore.js
import { create } from 'zustand';
// TODO: 백엔드 연결 시 추가
// import axios from 'axios';

export const useShiftStore = create((set) => ({
    // TODO: 백엔드 연결 시 초기값 빈 배열로 변경
    shifts: [
        // REMOVE: 더미데이터 제거
        { id: 1, type: 'vacancy', name: '박보영', date: '2025-02-11', time: { start: '10:00', end: '13:00' }, profileImage: '/boyoung.jpg' },
        { id: 2, type: 'vacancy', name: '김다미', date: '2025-02-11', time: { start: '10:00', end: '13:00' }, profileImage: '/dami.jpg' },
        { id: 3, type: 'vacancy', name: '한소희', date: '2025-02-11', time: { start: '10:00', end: '14:00' }, profileImage: '/sohee.jpg' },
        { id: 4, type: 'vacancy', name: '전여빈', date: '2025-02-11', time: { start: '10:00', end: '14:00' }, profileImage: '/yeobin.jpg' },
        { id: 5, type: 'vacancy', name: '김태리', date: '2025-02-11', time: { start: '10:00', end: '15:00' }, profileImage: '/taeri.jpg' },
        { id: 6, type: 'ourStore', name: '송중기', date: '2025-02-11', time: { start: '10:00', end: '15:00' }, profileImage: '/jungki.jpg' },
        { id: 7, type: 'ourStore', name: '정해인', date: '2025-02-11', time: { start: '10:00', end: '16:00' }, profileImage: '/haein.jpg' },
        { id: 8, type: 'ourStore', name: '박서준', date: '2025-02-11', time: { start: '10:00', end: '16:00' }, profileImage: '/seojun.jpg' },
        { id: 9, type: 'ourStore', name: '남주혁', date: '2025-02-11', time: { start: '10:00', end: '16:00' }, profileImage: '/joohyuk.jpg' },
        { id: 10, type: 'otherStore', name: '이도현', date: '2025-02-11', time: { start: '10:00', end: '13:00' }, profileImage: '/dohyun.jpg' },
        { id: 11, type: 'otherStore', name: '송강', date: '2025-02-11', time: { start: '10:00', end: '12:00' }, profileImage: '/kang.jpg' },
        { id: 12, type: 'otherStore', name: '위하준', date: '2025-02-11', time: { start: '10:00', end: '12:00' }, profileImage: '/hajun.jpg' },
        { id: 13, type: 'otherStore', name: '최우식', date: '2025-02-11', time: { start: '10:00', end: '15:00' }, profileImage: '/woosik.jpg' },
        { id: 14, type: 'otherStore', name: '박해수', date: '2025-02-11', time: { start: '10:00', end: '14:00' }, profileImage: '/haesu.jpg' },
    ],
    isLoading: false,
    error: null,

    fetchShifts: async () => {
        try {
            set({ isLoading: true });
            // TODO: 백엔드 연결 시 주석 해제
            // const response = await axios.get('/api/shifts');
            // set({ shifts: response.data, isLoading: false });

            // REMOVE: 더미데이터 로딩 로직 제거
            set({ isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    handleShiftAction: async (shiftId, action) => {
        try {
            // TODO: 백엔드 연결 시 주석 해제
            // await axios.post(`/api/shifts/${shiftId}/${action}`);

            set((state) => ({
                shifts: state.shifts.filter(shift => shift.id !== shiftId)
            }));
        } catch (error) {
            console.error('Failed to handle shift action:', error);
        }
    }
}));