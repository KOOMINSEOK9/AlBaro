'use client';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
    }

    connect(onMessageReceived) {
        const socket = new SockJS('https://i12b105.p.ssafy.io:8080/wss');

        this.client = new Client({
            webSocketFactory: () => new WebSocket('wss://i12b105.p.ssafy.io:8080/wss'),
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
                console.log('Received message:', receivedMessage);
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
            const messageToSend = {
                ...message,
                timestamp: new Date().toISOString()
            };
            console.log('Sending message:', messageToSend);
            this.client.publish({
                destination: '/app/chat',
                body: JSON.stringify(messageToSend)
            });
        } else {
            console.log('WebSocket is not connected');
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