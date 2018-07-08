import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入element-ui
import ElementUI from 'element-ui'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)
// 为axios挂载token请求头，使用request请求拦截器
axios.interceptors.request.use(function (config) {
  // 手动为 axios 的请求，追加 Authorization 请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

