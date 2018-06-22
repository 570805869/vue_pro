import Vue from 'vue'
import Router from 'vue-router'
// 导入登陆组件
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]}
  ]
})
//  路由导航守卫
router.beforeEach((to, from, next) => {
  // if (to.path === '/login') return next()
  // const tokenStr = sessionStorage.getItem('token')
  // // console.log(tokenStr)
  // if (tokenStr) return next()
  next('/login')
})

export default router
