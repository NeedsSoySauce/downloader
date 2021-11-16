class DownloadService {
    constructor(url) {
        this._connectedListeners = []
        this._disconnectedListeners = []
        this._state = null
        this._url = url
        this._socket = new WebSocket(url)
        this._connect()
    }

    _connect() {
        this._socket.addEventListener('open', this._handleSocketOpen.bind(this));
        this._socket.addEventListener('message', this._handleSocketMessage.bind(this));
        this._socket.addEventListener('close', this._handleSocketClose.bind(this))
        this._socket.addEventListener('error', this._handleSocketError.bind(this))
    }

    _handleSocketOpen(event) {
        console.log(`WebSocket opened with ${this._url}`)
        this._socket.send("Hi!")
    }

    _handleSocketMessage(event) {
        console.log(`WebSocket message from ${this._url}: ${event.data}`)
    }

    _handleSocketClose(event) {
        console.log(`WebSocket closed with ${this._url}`)
    }

    _handleSocketError(event) {
        console.log(`WebSocket error with ${this._url}`, event)
    }

    _notifyConnectedListeners() {
        if (this._state !== 'connected') return
        this._connectedListeners.forEach(listener => listener())
    }

    _notifyDisconnectedListeners() {
        if (this._state !== 'disconnected') return
        this._disconnectedListeners.forEach(listener => listener())
    }

    /**
     * @param {'connected' | 'disconnected'} type
     * @param {() => void} listener
     */
    addEventListener(type, listener) {
        switch (type) {
            case "connected":
                this._connectedListeners.push(listener)
                this._notifyConnectedListeners()
                break;
            case "disconnected":
                this._disconnectedListeners.push(listener)
                this._notifyDisconnectedListeners()
                break
        }
    }
}

export { DownloadService }