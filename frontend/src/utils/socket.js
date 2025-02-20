import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (stompClient) {
    disconnectWebSocket();
  }

  const socket = new SockJS('https://i12b105.p.ssafy.io/ws');
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  });

  stompClient.onConnect = () => {
    console.log('Connected to WebSocket');
    stompClient.subscribe(`/sub/chat/room/${storeId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      onMessageReceived(receivedMessage);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame);
  };

  stompClient.activate();
};

export const sendMessage = async (messageData) => {
  if (!stompClient?.connected) {
    console.error('STOMP client is not connected');
    return false;
  }

  try {
    await stompClient.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(messageData)
    });
    return true;
  } catch (error) {
    console.error('Failed to send message:', error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    if (stompClient.connected) {
      stompClient.deactivate();
    }
    stompClient = null;
  }
};