import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (!storeId) {
    throw new Error('Store ID is required for WebSocket connection');
  }

  if (stompClient) {
    disconnectWebSocket();
  }

  // SockJS를 사용하여 연결
  const socket = new SockJS('https://i12b105.p.ssafy.io/ws-stomp');
  stompClient = Stomp.over(socket);

  // STOMP 클라이언트 설정
  stompClient.reconnect_delay = 5000;
  
  // 연결 시도
  stompClient.connect(
    {
      // 필요한 경우 인증 헤더 추가
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    () => {
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
        }
      );
    },
    (error) => {
      console.error('STOMP error:', error);
    }
  );
};

export const sendMessage = async (messageData) => {
  if (!stompClient?.connected) {
    throw new Error('WebSocket is not connected');
  }

  try {
    stompClient.send(
      "/pub/chat/message",
      {
        'content-type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      JSON.stringify(messageData)
    );
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

export const disconnectWebSocket = () => {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }

  if (stompClient?.connected) {
    stompClient.disconnect();
  }
  stompClient = null;
};

export const getConnectionStatus = () => ({
  isConnected: stompClient?.connected ?? false,
  isConnecting: stompClient && !stompClient.connected
});