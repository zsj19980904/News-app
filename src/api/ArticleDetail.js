import request from '@/utils/request.js'

// 文章 - 获取详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章 - 点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
	//body请求体
  data: {
    target: artId
  }
})

// 文章 - 取消点赞  路由传参
export const unLikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 文章 - 获取 - 评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios只针对params参数, 如果发现键值对, 值为null, 会忽略此参数名和值不携带在url?后面
    type: 'a', // 什么时候需要外面传: 此值会变化
    source: id,
    offset,
    limit
  }
})

// 文章 - 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}

// 文章- 评论 - 取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}

// 文章- 评论 - 发布评论 data请求不会忽略空的值 因此需要让数据自己处理
export const commentSendAPI = ({ id, content, art_id = null }) => {
	//处理数据
  const obj = {
    target: id,
    content
  }
 //判断评论回复是否为空
	if (art_id !== null) { // 如果本次有第三个参数, 证明是对评论进行回复
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 用户 - 关注
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})

// 用户 - 取消关注
export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})
