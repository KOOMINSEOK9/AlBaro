import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  const socket = new SockJS('https://i12b105.p.ssafy.io/ws-stomp');
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},  // 헤더 없이 시도
    frame => {
      console.log('Connected:', frame);
      
      subscription = stompClient.subscribe(
        `/sub/chat/store/${storeId}`,
        message => {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        }
      );
    },
    error => {
      console.error('STOMP error:', error);
    }
  );
};

export const sendMessage = (messageData) => {
  if (!stompClient?.connected) {
    throw new Error('WebSocket is not connected');
  }

  stompClient.send(
    "/pub/chat/message",
    {},
    JSON.stringify(messageData)
  );
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