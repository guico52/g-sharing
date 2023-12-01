export class MyWebsocket {
    constructor(url, listeners = []) {
        this.socket = new WebSocket(url);
        this.listeners = []
        this.socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
            listeners.forEach(listener => listener(event.data));
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
        };
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket is not connected.');
        }
    }

    closeWebSocketConnection() {
        if (this.socket) {
            this.socket.close();
        }
    }

    addMessageListener(listener) {
        this.listeners.push(listener);
    }

    removeMessageListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

}
