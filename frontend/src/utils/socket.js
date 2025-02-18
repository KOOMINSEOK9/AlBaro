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

  // SockJS 연결 설정 수정
  const socket = new SockJS('https://i12b105.p.ssafy.io/ws-stomp', null, {
    transports: ['websocket'],
    debug: true,
    onclose: (event) => {
      console.log('SockJS closed:', event);
    },
    onerror: (error) => {
      console.log('SockJS error:', error);
    }
  });

  // STOMP 클라이언트 생성
  stompClient = Stomp.over(function() { return socket; });
  
  // STOMP 설정
  stompClient.debug = function(str) {
    console.log(str);
  };

  // 연결 시도
  stompClient.connect(
    {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    frame => {
      console.log('Connected:', frame);
      subscription = stompClient.subscribe(
        `/sub/chat/store/${storeId}`,
        message => {
          try {
            const receivedMessage = JSON.parse(message.body);
            onMessageReceived(receivedMessage);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        },
        { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      );
    },
    error => {
      console.error('STOMP error:', error);
      // 5초 후 재연결 시도
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket(onMessageReceived, storeId);
      }, 5000);
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