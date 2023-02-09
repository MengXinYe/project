export default class SocketService {
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null
  connected = false
  connectCount = 0
  tryConnectCount = 0
  connect() {
    if (!window.WebSocket) {
      return console.log('no agree websocket')
    }
    this.ws = new WebSocket('ws://localhost:3366')
    this.ws.onopen = () => {
      this.connected = true
    }
    this.ws.onclose = () => {
      this.connected = false
      try {
        this.tryConnectCount++
        setTimeout(this.connect, 500 * this.tryConnectCount)
      } catch (e) {
      }
    }
    this.ws.addEventListener('message', msg => {
      const data = JSON.parse(msg.data)
      const { socketType } = data
      if (this.callBackMapping[socketType]) {
        const { action } = data
        if (action === 'getData') {
          const realData = data.data
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, data)
        }
      }
    })
  }

  callBackMapping = {}

  registerCallBack(socketType, callback) {
    this.callBackMapping[socketType] = callback
  }

  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

  send(data) {
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
      this.connectCount = 0
    } else {
      setTimeout(() => {
        this.send(data)
      }, (this.connectCount + 1) * 500)
      this.connectCount++
    }
  }
}
