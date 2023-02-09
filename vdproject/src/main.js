import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from '@/api'
import '@/assets/css/global.less'
import '@/assets/font/iconfont.css'
import SocketService from './utils/socket_service'
import store from '@/store'

SocketService.Instance.connect()

Vue.config.productionTip = false

Vue.prototype.$echarts = window.echarts
Vue.prototype.$api = api
Vue.prototype.$socket = SocketService.Instance

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
