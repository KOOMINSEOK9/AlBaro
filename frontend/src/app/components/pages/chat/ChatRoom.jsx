'use client';

import React, { useEffect, useRef, useState } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '@/utils/socket';
import useChatStore from '@/store/chatStore';
import { Users } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import ChatMessage from './ChatMessage';

const ChatRoom = () => {
    const messagesEndRef = useRef(null);
    const [inputMessage, setInputMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const { messages, addMessage, isConnected, setConnected } = useChatStore();

    const dummyMessages = [
        {
            id: 'dummy-1',
            content: "안녕하세요! 오늘도 좋은 하루 보내세요.",
            senderId: "user1",
            senderName: "김싸피",
            timestamp: "오후 03:29",
        },
        {
            id: 'dummy-2',
            content: "네, 감사합니다. 좋은 하루 되세요!",
            senderId: "currentUserId",
            senderName: "이싸피",
            timestamp: "오후 03:29",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            addMessage({
                id: Date.now().toString(),
                content: inputMessage,
                senderId: 'currentUserId',
                senderName: '현재 사용자',
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
            });
            setInputMessage('');
        }
    };

    const onEmojiClick = (emojiData) => {
        setInputMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-8 py-4 border-b bg-white">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                        <Users size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">MEGASSAFY 덕명점</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-sm text-gray-500">7명 접속 중</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#F8FAFC] w-full">
                <div className="flex flex-col justify-end min-h-full w-full">
                    <div className="space-y-4 w-full">
                        {(messages.length > 0 ? messages : dummyMessages).map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === 'currentUserId'}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* 입력 영역 */}
            <div className="flex-shrink-0 border-t bg-white px-6 py-3 w-full sticky bottom-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
                    <div className="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200 w-full">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm w-full"
                        />
                        <div className="relative flex-shrink-0" ref={emojiPickerRef}>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <span className="text-xl">😊</span>
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-12 right-0 z-10 shadow-lg">
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        width={280}
                                        height={350}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex-shrink-0 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        전송
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;