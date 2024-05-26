import {message} from "../api/api.js";

export class GroupChatWebSocket{
    constructor(groupId, onMessageCallback) {
        this.groupId = groupId;
        this.ws = null;
        this.onMessageCallback = onMessageCallback;
        this.connect();
    }

    connect() {
        // 使用 WebSocket 协议和服务器端点建立连接
        document.cookie = 'token='+localStorage.getItem('token');
        console.log(document.cookie)
        this.ws = new WebSocket(`ws://localhost:8221/groupChat/${this.groupId}/${localStorage.getItem('token')}`);

        // 监听连接打开事件
        this.ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        // 监听消息事件
        this.ws.onmessage = (event) => {
            this.onMessageCallback(JSON.parse(event.data));
        };

        // 监听连接关闭事件
        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // 监听错误事件
        this.ws.onerror = (error) => {
            message.error('WebSocket error:', error);
        };
    }

    sendMessage(message) {
        // 发送消息到服务器
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            console.log('Message sent:', message)
        } else {
            console.error('WebSocket is not open. Ready state:', this.ws.readyState);
        }
    }

    handleChatMessage(message) {
        // 处理接收到的聊天消息
        console.log('Chat message:', message);
        // 这里可以更新 UI 或进行其他处理
    }

    close() {
        // 关闭 WebSocket 连接
        if (this.ws) {
            this.ws.close();
        }
    }
}

