const path = require('path')

const readFile = require('../utils/utils__fileData')

module.exports = async (ctx, next) => {
  let url = ctx.path
  url = url.replace('/api/', '')
  let filePath = __dirname + '\\data' + '\\' + url + '.json'
  filePath = filePath.replace('\\middleware', '')
  try {
    let data = await readFile(filePath)
    ctx.body = data
  } catch (error) {
    ctx.body = '文件不存在'
  }
  await next()
}