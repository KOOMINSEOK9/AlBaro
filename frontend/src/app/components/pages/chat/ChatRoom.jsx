'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '@/utils/socket';
import useChatStore from '@/store/chatStore';
import { Users } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import ChatMessage from './ChatMessage';
import axios from 'axios';
import styles from '@/styles/scrollbar.module.css';

const ChatRoom = () => {
  const messagesEndRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const emojiPickerRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 토큰에서 정보 추출
  const [userInfo, setUserInfo] = useState(null);

  const {
    messages,
    addMessage,
    isConnected,
    setConnected,
    clearMessages,
    setMessages
  } = useChatStore();

  // 토큰에서 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      setUserInfo({
        userId: payload.userId,
        userName: payload.username,
        storeId: payload.storeId,
        role: payload.role
      });
    }
  }, []);

  // 채팅 히스토리 가져오기
  const fetchChatHistory = useCallback(async () => {
    if (!userInfo?.storeId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`/api/chat/store/${userInfo.storeId}`);
      const history = response.data;

      // 시간순으로 정렬 (오래된 메시지가 먼저 오도록)
      const sortedHistory = [...history].sort((a, b) => 
        new Date(a.sentTime) - new Date(b.sentTime)
      );

      const formattedMessages = sortedHistory.map(msg => ({
        id: msg.id.toString(),
        content: decodeURIComponent(msg.content),
        userId: msg.userId,
        userName: msg.userName,
        timestamp: new Date(msg.sentTime).toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }));

      setMessages(formattedMessages);
      setError(null);

      // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      setError('채팅 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.storeId]);

  // 컴포넌트 마운트 시 채팅 히스토리 로드
  useEffect(() => {
    if (userInfo?.storeId) {
      fetchChatHistory();
    }
  }, [userInfo, fetchChatHistory]);

  // WebSocket 연결
  useEffect(() => {
    if (userInfo?.storeId) {
      const handleMessage = (message) => {
        const formattedMessage = {
          id: Date.now().toString(),
          content: decodeURIComponent(message.content),
          userId: message.userId,
          userName: message.userName,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        };
        // 새 메시지는 항상 배열의 끝에 추가
        setMessages(prev => [...prev, formattedMessage]);
      };

      connectWebSocket(handleMessage, userInfo.storeId);
      setConnected(true);

      return () => {
        disconnectWebSocket();
        setConnected(false);
      };
    }
  }, [userInfo]);

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
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    };

    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !isConnected || !userInfo) {
      return;
    }

    const messageData = {
      content: encodeURIComponent(inputMessage.trim()),
      userId: parseInt(userInfo.userId),
      userName: userInfo.userName,
      storeId: userInfo.storeId,
      sentTime: new Date().toISOString()
    };

    try {
      const sent = await sendMessage(messageData);
      if (sent) {
        setInputMessage('');
        setError(null);
      } else {
        setError('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  const onEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // 메시지 렌더링 부분만 수정
  const processMessages = (messages) => {
    return messages.map((message, index) => {
      let showTimestamp = true;

      // 다음 메시지가 있는 경우
      if (index < messages.length - 1) {
        const nextMessage = messages[index + 1];
        // 같은 사용자의 연속된 메시지이고 시간이 같으면 타임스탬프 숨김
        if (message.userId === nextMessage.userId &&
          message.timestamp === nextMessage.timestamp) {
          showTimestamp = false;
        }
      }

      return (
        <ChatMessage
          key={message.id}
          message={message}
          isOwnMessage={message.userId === userInfo?.userId}
          showTimestamp={showTimestamp}
        />
      );
    });
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">로그인이 필요합니다.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">채팅방 로딩중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-8 py-4 border-b bg-white h-20">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">단체 채팅방</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? '접속 중' : '연결 끊김'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">채팅 내역을 불러오는 중...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
          <button
            onClick={fetchChatHistory}
            className="ml-2 text-red-700 hover:text-red-800 underline"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto px-6 py-4 bg-gray-50 ${styles.customScrollbar}`}
        >
          <div className="flex flex-col justify-end min-h-full">
            <div className="space-y-2">
              {processMessages(messages)}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      <div className="border-t bg-white px-6 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isConnected ? "메시지를 입력하세요..." : "연결 대기중..."}
              disabled={!isConnected}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!isConnected}
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
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;