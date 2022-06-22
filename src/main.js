import '@/utils/console.js' // 去掉打印语句
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'highlight.js/styles/default.css' // 代码高亮的样式(文章的)
import 'amfe-flexible' // 引入flexible.js -> 设置根标签字体大小(移动端适配)
import directiveObj from './utils/directive'
import './VueComponent.js' // vant组件注册, 单独的分离成一个js文件, 让main.js更清晰
import axios from 'axios'

Vue.use(directiveObj) // 执行目标对象里install方法并传入Vue类 创建全局插件
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
