import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';  // Stomp 대신 Client 임포트

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
    heartbeatOutgoing: 4000
  });

  // 연결 성공시 콜백
  stompClient.onConnect = function(frame) {
    console.log('Connected:', frame);
    
    subscription = stompClient.subscribe(`/sub/chat/store/${storeId}`, message => {
      try {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });
  };

  // 에러 발생시 콜백
  stompClient.onStompError = function (frame) {
    console.error('STOMP error:', frame);
  };

  // 연결
  stompClient.activate();
};

export const sendMessage = (messageData) => {
  if (!stompClient?.connected) {
    throw new Error('WebSocket is not connected');
  }

  stompClient.publish({
    destination: "/pub/chat/message",
    body: JSON.stringify(messageData)
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    stompClient.deactivate();
    stompClient = null;
  }
};

export const getConnectionStatus = () => ({
  isConnected: stompClient?.connected ?? false,
  isConnecting: stompClient?.active && !stompClient?.connected
});