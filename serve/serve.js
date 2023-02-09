const Koa = require('koa')
const wsServe = require('./ws_serve/webSocket')
wsServe.linsten()
const app = new Koa()

//引入中间件
const duration = require('./middleware/koa_response_duration')
const header = require('./middleware/koa_response_header')
const data = require('./middleware/koa_response_data')

app.use(duration)
app.use(header)
app.use(data)

app.listen(3000, e => {
  if (e) console.log(e)
  else console.log('http://localhost:3000')
})

