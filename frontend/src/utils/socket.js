import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (stompClient) {
    disconnectWebSocket();
  }

  // STOMP Client 생성
  stompClient = new Client({
    webSocketFactory: () => new SockJS('https://i12b105.p.ssafy.io/ws-stomp'),
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    // 추가된 설정
    connectHeaders: {
      'Content-Type': 'application/json'
    }
  });

  // 연결 성공시 콜백
  stompClient.onConnect = function(frame) {
    console.log('Connected:', frame);
    
    try {
      subscription = stompClient.subscribe(`/sub/chat/store/${storeId}`, message => {
        try {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }, {
        // 구독 헤더 추가
        'Content-Type': 'application/json'
      });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  // 에러 발생시 콜백
  stompClient.onStompError = function (frame) {
    console.error('STOMP error:', frame);
  };

  // WebSocket 에러 핸들링 추가
  stompClient.onWebSocketError = function (event) {
    console.error('WebSocket error:', event);
  };

  // WebSocket 종료 핸들링 추가
  stompClient.onWebSocketClose = function (event) {
    console.log('WebSocket closed:', event);
  };

  // 연결
  try {
    stompClient.activate();
  } catch (error) {
    console.error('Connection activation error:', error);
    throw error;
  }
};

export const sendMessage = (messageData) => {
  if (!stompClient?.connected) {
    throw new Error('WebSocket is not connected');
  }

  try {
    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(messageData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (error) {
    console.error('Send message error:', error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
      stompClient.deactivate();
      stompClient = null;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }
};

export const getConnectionStatus = () => ({
  isConnected: stompClient?.connected ?? false,
  isConnecting: stompClient?.active && !stompClient?.connected
});