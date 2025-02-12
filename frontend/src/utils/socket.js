'use client';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
    }

    connect(onMessageReceived) {
        const socket = new SockJS('http://localhost:8080/ws');

        this.client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('Connected to WebSocket');

            this.client.subscribe('/topic/store/chat', (message) => {
                const receivedMessage = JSON.parse(message.body);
                onMessageReceived(receivedMessage);
            });
        };

        this.client.onStompError = (frame) => {
            console.error('WebSocket Error:', frame);
        };

        this.client.activate();
    }

    sendMessage(message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: '/app/chat',
                body: JSON.stringify(message)
            });
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

const webSocketService = new WebSocketService();

export const connectWebSocket = (onMessageReceived) => webSocketService.connect(onMessageReceived);
export const sendMessage = (message) => webSocketService.sendMessage(message);
export const disconnectWebSocket = () => webSocketService.disconnect();