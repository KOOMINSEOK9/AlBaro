import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (stompClient) {
    disconnectWebSocket();
  }

  const socket = new SockJS('https://i12b105.p.ssafy.io/ws', null, {
    transports: ['websocket'],
    timeout: 10000, // 10초
  });
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    connectionTimeout: 10000,
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
    onWebSocketError: (event) => {
      console.error('WebSocket error:', event);
    },
    onWebSocketClose: (event) => {
      console.log('WebSocket closed:', event);
    }
  });

  stompClient.onConnect = (frame) => {
    console.log('Connected to WebSocket', frame);
    try {
      stompClient.subscribe(`/sub/chat/room/${storeId}`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  };

  try {
    stompClient.activate();
  } catch (error) {
    console.error('Error activating STOMP client:', error);
  }
};

export const sendMessage = async (messageData) => {
  if (!stompClient?.connected) {
    console.error('STOMP client is not connected');
    return false;
  }

  try {
    await stompClient.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(messageData),
      headers: { 'content-type': 'application/json' }
    });
    return true;
  } catch (error) {
    console.error('Failed to send message:', error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      stompClient = null;
    }
  }
};