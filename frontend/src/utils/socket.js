import { Client } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (!storeId) {
    throw new Error('Store ID is required for WebSocket connection');
  }

  if (stompClient) {
    disconnectWebSocket();
  }

  stompClient = new Client({
    brokerURL: 'wss://i12b105.p.ssafy.io/ws-stomp',
    connectHeaders: {
      'X-Forwarded-Proto': 'https'
    },
    debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    
    onConnect: () => {
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

    onDisconnect: () => {
      console.log('WebSocket Disconnected');
    },

    onStompError: (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
    },

    onWebSocketError: (event) => {
      console.error('WebSocket error:', event);
    }
  });

  stompClient.activate();
};

export const sendMessage = async (messageData) => {
  if (!stompClient?.active) {
    throw new Error('WebSocket is not connected');
  }

  try {
    await stompClient.publish({
      destination: "/pub/chat/message",
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify(messageData)
    });
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

  if (stompClient?.active) {
    stompClient.deactivate();
  }
  stompClient = null;
};

export const getConnectionStatus = () => ({
  isConnected: stompClient?.active ?? false,
  isConnecting: stompClient?.connected === false && stompClient?.active === true
});