// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面, 导入这个接口方法, 就能发请求咯
// 好处: 请求url路径, 可以在这里统一管理
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'
// 既引入也同时向外按需导出, 所有引入过来的方法 (中转)
// * 代表所有
export * from './ArticleDetail.js'
// 登录 - 登录接口
// axios内部, 会把参数对象转成json字符串格式发后台
// axios内部, 会自动携带请求参数(headers)里Content-Type: 'application/json' 帮你添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 用户 - 刷新token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
		//请求拦截器统一携带的是token，而这次请求需要带的是refresh_token
		//所以再axios请求拦截器里判断，是为了这种情况准备的
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})

// 用户 - 获取个人资料(编辑页面使用)
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile'
})





// 用户 - 更新头像
export const updateUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd ,// fd外面一会儿传进来的new FormData() 表单对象
  // 这里不能加对象的原因是 传递过来的是一个表单对象,如果加了对象 axios会自动解析成json对象 
})






// 用户 - 更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for(let prop in obj){ //遍历obj这个对象
	  if(dataObj[prop]==undefined){ //判断这个值是否是和obj里面的值匹配
		  delete obj[prop] //如果不匹配就删除 
	  }else{
		  obj[prop]=dataObj[prop] //匹配就拿到这个值
	  }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH', // 局部更新->PUT(全都更新)
    data: obj
  })
}

// 用户 - 获取基本信息(我的页面显示数据)
export const getUserInfoAPI = () => request({
  url: '/v1_0/user'
})








// 频道 - 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 频道 - 获取用户选择的频道
// 注意: 用户没有登录, 默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels'
})

// 频道 - 更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选整个频道数组
  }
})

// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 文章 - 获取列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params: { // 这里的参数, axios会帮你拼接在URL?后面 (查询字符串)
    channel_id:channel_id,
    timestamp:timestamp
  }
})

// 文章 - 反馈 - 不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章 - 反馈 - 反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '如果你想写, 你可以逻辑页面判断下, 如果点击类型是0, 再给一个弹出框输入框输入其他问题, 传参到这里'
  }
})

// 搜索 - 联想菜单列表
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q:keywords
  }
})

// 搜索 - 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})
