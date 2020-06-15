import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.withCredentials = true // 設定axios 預設會傳認證資訊

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
