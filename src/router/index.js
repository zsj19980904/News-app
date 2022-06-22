import Vue from 'vue'
import VueRouter from 'vue-router'

import { getToken } from '@/utils/token.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示layout和layout下首页
  },
  {
    path: '/login',
    component: () => import( '@/views/Login'),
    // 路由独享守卫
    beforeEnter (to, from, next) {
      if (getToken()?.length > 0) {
        next('/') //再用户输入login的时候 强制跳转到首页
        // 2. 移动端App也没有地址栏, 不必特别纠结返回按钮
      } else {
        next() // 其他情况通通放行
      }
    }
  },
  {
    path: '/layout',
    component: () => import( '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import( '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时, 滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  { // 搜索结果页 :kw动态路由传参
    path: '/search_result/:kw',
    component: () => import('@/views/Search/SearchResult')
  },
  { // 文章详情页
    path: '/detail',
    component: () => import( '@/views/ArticleDetail')
  },
  { // 用户编辑页面
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  {
    // 聊天页面
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

export default router
