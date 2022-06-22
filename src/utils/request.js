// 基于axios封装网络请求
// 每个程序员的想法都不一样, 封装的地方和名字都不一样, 但是思想相同
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken, removeToken,setToken } from '@/utils/token.js' // , 
import { getNewTokenAPI } from '@/api'

const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 20秒超时时间(请求20秒无响应直接判定超时)
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	//?.为可选链操作符，如果前面对象没有length，则整个表达式原地返回undefined
	// 如果getToken()在原地有token字符串 才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  console.dir(error)
  if (error.response.status === 401) {
	      removeToken()
	// 方法1：前强制跳转到登录页 用户有感知
    // router.replace(`/login?path=${router.currentRoute.fullPath}`)
	
	//方法2:用JS方法让token续签,用户无感知
	//先使用refresh_token换回新的token再继续使用，对已经的token，保留一点时间
	let res =await getNewTokenAPI();
	//1.更新新的token到本地
	setToken(res.data.data.token);
	//2.把新请求的token放在请求头里面
	error.config.headers.Authorization =`Bearer ${res.data.data.token}`
	// 2.未完成的请求，再发一次 就是401这个 error.config就是上一次请求的配置对象
	return  axios(error.config)
  }else if(error.response.status===500 && error.config.url==='/v1_0/authorizations' && error.config.method==='put'){
	  localStorage.clear();
	  Notify({type:'warning',message:'身份过期了，请重新登录'})
	  router.replace('/login')
  }

//错误请求
  return Promise.reject(error)
})

//这个是封装的一个请求函数 一个url请求体 parasm用于get请求参数 data为post请求  headers 响应头信息
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}