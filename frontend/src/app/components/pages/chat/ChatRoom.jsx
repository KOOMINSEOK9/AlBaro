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
    const { messages, addMessage, isConnected, setConnected, currentRoom } = useChatStore();

    useEffect(() => {
        connectWebSocket((message) => {
            console.log('Message received in ChatRoom:', message);
            addMessage({
                id: Date.now().toString(),
                content: message.content,
                senderId: message.senderId,
                senderName: message.senderName || `User ${message.senderId}`,
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
            });
        });
        setConnected(true);

        return () => {
            disconnectWebSocket();
            setConnected(false);
        };
    }, []);

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
            const newMessage = {
                id: Date.now().toString(),
                content: inputMessage,
                senderId: 1,
                senderName: '현재 사용자',
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
            };

            // 먼저 화면에 메시지 추가
            addMessage(newMessage);

            // 서버로 전송할 메시지 데이터
            const messageData = {
                content: inputMessage,
                senderId: 1,
                senderName: '현재 사용자',
                roomId: currentRoom?.id || 1,
                timestamp: new Date().toISOString()
            };

            // 서버로 전송
            sendMessage(messageData);
            setInputMessage('');
        }
    };

    const onEmojiClick = (emojiData) => {
        setInputMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between px-8 py-4 border-b bg-white h-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                        <Users size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">MEGASSAFY 덕명점</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-sm text-gray-500">접속 중</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#F8FAFC] w-full">
                <div className="flex flex-col justify-end min-h-full w-full">
                    <div className="space-y-4 w-full">
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === 1}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

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