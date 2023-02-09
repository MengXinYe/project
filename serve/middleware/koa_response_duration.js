// 总耗时中间件
const duration = async function(ctx, next) {
  const start = Date.now()
  await next()
  const durationTime = Date.now() - start
  ctx.set('X-Response-Time', durationTime + 'ms')
}

module.exports = duration