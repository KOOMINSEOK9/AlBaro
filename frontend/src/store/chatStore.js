"use client";

import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [],
  isConnected: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  setConnected: (status) => set({ isConnected: status }),

  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;
