import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      needLogin: false
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      needLogin: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => { // 進入每個分頁前檢查登入狀態
  /*
    to 即將訪問的頁面
    from 來源頁面
    next 採取的導向動作
  */
  if (to.meta.needLogin && store.state.user.length === 0) { // 若要去的地方需要登入，但vuex 沒有使用者資料時
    alert('please login') // 跳出訊息
    next('/') // 導向首頁
  } else {
    next() // 正常導向
  }
})

export default router
