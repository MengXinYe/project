const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000'
      }
    },
    open: true,
    host: '127.0.0.1',
    port: 8000
  }
})
