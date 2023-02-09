// 读取文件
const fs = require('fs')

module.exports = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(new Error(err))
      else resolve(data.toString())
    })
  })
}
