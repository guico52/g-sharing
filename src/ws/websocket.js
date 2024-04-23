export class MyWebsocket {
    listeners;
    constructor(url, onOpenCallback, onMessageCallback, onErrorCallback, onCloseCallback) {
        this.socket = new WebSocket(url);
        this.listeners = []
        this.socket.onopen = () => {
            console.log('WebSocket Connected');
            onOpenCallback();
        };

        this.socket.onmessage = (event) => {
            this.listeners.forEach(listener => listener(event.data));
            onMessageCallback(event.data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            onErrorCallback(error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
            onCloseCallback();
        };
    }

    on(event, callback){
        this.socket.on(event, callback);
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
