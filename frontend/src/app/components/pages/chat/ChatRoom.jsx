// ChatRoom.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '@/utils/socket';
import useChatStore from '@/store/chatStore';
import { Users } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

// ChatMessage 컴포넌트
const ChatMessage = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                            {message.senderName?.[0]}
                        </span>
                    </div>
                </div>
            )}

            <div className={`flex flex-col max-w-[65%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && (
                    <span className="text-sm text-gray-700 mb-1 ml-1">
                        {message.senderName}
                    </span>
                )}

                <div className="flex items-end gap-1">
                    {isOwnMessage && (
                        <span className="text-xs text-gray-400 self-end">
                            {message.timestamp}
                        </span>
                    )}

                    <div
                        className={`px-4 py-2 rounded-2xl break-words ${isOwnMessage
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>

                    {!isOwnMessage && (
                        <span className="text-xs text-gray-400 self-end">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatRoom = () => {
    const messagesEndRef = useRef(null);
    const [inputMessage, setInputMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const { messages, addMessage, isConnected, setConnected } = useChatStore();

    const dummyMessages = [
        {
            id: 'dummy-1',
            content: "네, 확인해봤는데 조금 부족할 것 같아요. 지금 추가 주문 넣을까요?",
            senderId: "currentUserId",
            senderName: "김싸피",
            timestamp: "오후 03:30",
        },
        {
            id: 'dummy-2',
            content: "오늘 아이스컵 재고 체크했나요? 부족하면 미리 주문 넣어야 해요.",
            senderId: "user1",
            senderName: "이싸피 (점장)",
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
        <div className="flex flex-col h-full w-full bg-white">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">MEGASSAFY 덕명점</h2>
                        <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-sm text-gray-500">연결됨</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    <span>7명</span>
                </div>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                <div className="flex flex-col-reverse min-h-full">
                    <div className="space-y-4">
                        <div ref={messagesEndRef} />
                        {(messages.length > 0 ? messages : dummyMessages).reverse().map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === 'currentUserId'}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 입력 영역 */}
            <div className="border-t px-6 py-3 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="flex-1 flex items-center bg-gray-50 rounded-full border">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm"
                        />
                        <div className="relative pr-2" ref={emojiPickerRef}>
                            <button
                                type="button"
                                className="p-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <span className="text-xl">😊</span>
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-12 right-0 z-10">
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                        전송
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;