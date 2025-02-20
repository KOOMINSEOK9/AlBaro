import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://i12b105.p.ssafy.io/ws-stomp'
  : 'http://localhost:8080/ws-stomp';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (!storeId) {
    console.error('Store ID is required for WebSocket connection');
    return;
  }

  if (stompClient) {
    disconnectWebSocket();
  }

  const socket = new SockJS(SOCKET_URL, null, {
    transports: ['websocket'],
    timeout: 30000,
    headers: {
      'X-Forwarded-Proto': 'https'
    }
  });

  stompClient = Stomp.over(socket);
  stompClient.heartbeat.outgoing = 20000;
  stompClient.heartbeat.incoming = 20000;
  //stompClient.debug = null;

  const connectCallback = () => {
    console.log('WebSocket Connected');
    subscription = stompClient.subscribe(
      `/sub/chat/store/${storeId}`,
      (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      },
      {
        // STOMP 구독 옵션 추가
        'heart-beat': '10000,10000',
        'accept-version': '1.1,1.2'
      }
    );
  };

  const errorCallback = (error) => {
    console.error('WebSocket connection error:', error);
    setTimeout(() => {
      if (!stompClient?.connected) {
        console.log('Attempting to reconnect...');
        connectWebSocket(onMessageReceived, storeId);
      }
    }, 5000);
  };

  try {
    stompClient.connect(
      {
        // STOMP 연결 헤더 추가
        'heart-beat': '10000,10000',
        'accept-version': '1.1,1.2'
      },
      connectCallback,
      errorCallback
    );
  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
    errorCallback(error);
  }
};

export const sendMessage = (messageData) => {
  if (!stompClient?.connected) {
    console.error('WebSocket is not connected');
    return false;
  }

  try {
    stompClient.send(
      "/pub/chat/message",
      {
        'content-type': 'application/json;charset=UTF-8'
      },
      JSON.stringify(messageData)
    );
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
    subscription = null;
  }

  if (stompClient?.connected) {
    try {
      stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    } catch (error) {
      console.error("Failed to disconnect WebSocket:", error);
    }
  }

  stompClient = null;
};

// 연결 상태 확인 함수 추가
export const isConnected = () => {
  return stompClient?.connected || false;
};