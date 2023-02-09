const ws = require('ws')
const path = require('path')
const fileUtils = require('../utils/utils__fileData')
const wss = new ws.Server({ port: 3366 });

module.exports.linsten = () => {
  wss.on('connection', function connection(client) {
    client.on('error', function err(e) {
      console.log(e)
    })
  
    client.on('message', async function message(data) {
      let payload = JSON.parse(data)
      const action = payload.action
      if (action === 'getData') {
        let pathFile = '../data/' + payload.chartName + '.json'
        pathFile = path.join(__dirname, pathFile)
        console.log(pathFile)
        let data = await fileUtils(pathFile)
        payload.data = JSON.parse(data)
        payload = JSON.stringify(payload)
        client.send(payload)
      }else {
        wss.clients.forEach(client => {
          client.send(JSON.stringify(payload))
        })
      }
    })
    console.log('have a client connection')
    
  });
}