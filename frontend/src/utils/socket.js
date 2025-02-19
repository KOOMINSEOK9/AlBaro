import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (onMessageReceived, storeId) => {
  if (stompClient) {
    disconnectWebSocket();
  }

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
    },
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
        id: `sub-${storeId}`,
        ack: 'client'
      });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  try {
    stompClient.activate();
  } catch (error) {
    console.error('Connection activation error:', error);
  }
};