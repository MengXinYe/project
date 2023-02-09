module.exports = async (ctx, next) => {
  ctx.set('Content-Type', 'application/json; chart=utf-8')
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'OPTION, GET, PUT, POST, DELETE')
  await next()
}