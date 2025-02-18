// 변경 후
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'https://i12b105.p.ssafy.io/ws-stomp';
  
export const connectWebSocket = (onMessageReceived, storeId) => {
  if (!storeId) {
    console.error('Store ID is required');
    return;
  }

  // 새로운 방식으로 Stomp 클라이언트 생성
  const client = new StompJs.Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // 연결 성공시 콜백
  client.onConnect = function () {
    console.log('Connected to WebSocket');
    client.subscribe(`/sub/chat/store/${storeId}`, function (message) {
      try {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });
  };

  // 에러 처리
  client.onStompError = function (frame) {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  // 연결 시도
  client.activate();

  return client; // 클라이언트 반환 (나중에 연결 해제를 위해)
};

// 메시지 전송 함수
export const sendMessage = (client, messageData) => {
  if (!client || !client.connected) {
    console.error('WebSocket is not connected');
    return false;
  }

  try {
    client.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(messageData)
    });
    return true;
  } catch (error) {
    console.error('Failed to send message:', error);
    return false;
  }
};

// 연결 해제 함수
export const disconnectWebSocket = (client) => {
  if (client) {
    try {
      client.deactivate();
      console.log('WebSocket disconnected');
    } catch (error) {
      console.error('Failed to disconnect WebSocket:', error);
    }
  }
};