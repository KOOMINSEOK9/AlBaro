import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const clearReconnectTimeout = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
};

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (!storeId) {
    throw new Error('Store ID is required for WebSocket connection');
  }

  // 기존 연결 정리
  disconnectWebSocket();
  clearReconnectTimeout();

  try {
    // SockJS 연결 설정
    const socket = new SockJS('https://i12b105.p.ssafy.io/ws-stomp', null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      debug: true,
      timeout: 10000
    });

    // STOMP 클라이언트 생성
    stompClient = Stomp.over(socket);
    
    // STOMP 디버그 설정
    stompClient.debug = process.env.NODE_ENV === 'development' 
      ? (str) => console.log('STOMP Debug:', str)
      : () => {};

    // 연결 시도
    stompClient.connect(
      {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'heart-beat': '10000,10000'
      },
      frame => {
        console.log('WebSocket Connected:', frame);
        reconnectAttempts = 0; // 연결 성공시 재시도 카운트 리셋

        // 구독 설정
        try {
          subscription = stompClient.subscribe(
            `/sub/chat/store/${storeId}`,
            message => {
              try {
                const receivedMessage = JSON.parse(message.body);
                onMessageReceived(receivedMessage);
              } catch (error) {
                console.error('Message parsing failed:', error);
              }
            },
            {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          );
        } catch (error) {
          console.error('Subscription failed:', error);
          handleReconnect(onMessageReceived, storeId);
        }
      },
      error => {
        console.error('STOMP connection error:', error);
        handleReconnect(onMessageReceived, storeId);
      }
    );

    // SockJS 이벤트 리스너
    socket.onclose = (event) => {
      console.log('SockJS connection closed:', event);
      if (event.code !== 1000) {
        handleReconnect(onMessageReceived, storeId);
      }
    };

    socket.onerror = (error) => {
      console.error('SockJS error:', error);
      handleReconnect(onMessageReceived, storeId);
    };

  } catch (error) {
    console.error('WebSocket setup failed:', error);
    handleReconnect(onMessageReceived, storeId);
  }
};

const handleReconnect = (onMessageReceived, storeId) => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Max reconnection attempts reached');
    return;
  }

  clearReconnectTimeout();
  reconnectTimeout = setTimeout(() => {
    console.log(`Reconnect attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}`);
    reconnectAttempts++;
    connectWebSocket(onMessageReceived, storeId);
  }, 5000 * (reconnectAttempts + 1)); // 지수 백오프
};

export const sendMessage = async (messageData) => {
  if (!stompClient?.connected) {
    throw new Error('WebSocket is not connected');
  }

  try {
    await new Promise((resolve, reject) => {
      stompClient.send(
        "/pub/chat/message",
        {
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        JSON.stringify(messageData),
        resolve,
        reject
      );
    });
    return true;
  } catch (error) {
    console.error("Message sending failed:", error);
    throw error;
  }
};

export const disconnectWebSocket = () => {
  clearReconnectTimeout();
  
  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (error) {
      console.error('Unsubscribe failed:', error);
    }
    subscription = null;
  }

  if (stompClient?.connected) {
    try {
      stompClient.disconnect(() => {
        console.log('STOMP disconnected');
      });
    } catch (error) {
      console.error('STOMP disconnect failed:', error);
    }
  }
  stompClient = null;
  reconnectAttempts = 0;
};

export const getConnectionStatus = () => ({
  isConnected: stompClient?.connected ?? false,
  isConnecting: stompClient && !stompClient.connected,
  reconnectAttempts
});