import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式
import './assets/css/global.css'
// 导入element-ui
import ElementUI from 'element-ui'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
