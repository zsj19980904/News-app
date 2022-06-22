<template>
	<div>
		<!-- Header 区域 -->
		<van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />




		<van-loading  vertical color="#0094ff" type="spinner" size="0.7rem" v-if="Object.keys(objAtr).length===0">加载中...</van-loading>
		<div v-else>
			<!-- 文章信息区域 -->
			<div class="article-container" >
				<!-- 文章标题 -->
				<h1 class="art-title">{{objAtr.title}}</h1>
				<!-- 用户信息 -->
				<van-cell center :title="(objAtr.aut_name)" :label="FormData(objAtr.pubdate)">
					<template #icon>
						<img :src="objAtr.aut_photo" alt="" class="avatar">
					</template>
					<template #default>
						<div>
							<van-button type="info" size="mini" v-if="objAtr.is_followed" @click="followedFn(true)">已关注
							</van-button>
							<van-button icon="plus" type="info" size="mini" plain v-else @click="followedFn(false)">关注
							</van-button>
						</div>
					</template>
				</van-cell>

				<!-- 分割线 -->
				<van-divider></van-divider>

				<!-- 文章内容 -->
				<div class="art-content" v-html="objAtr.content" ></div>

				<!-- 分割线 -->
				<van-divider>End</van-divider>
				<!-- 点赞 -->
				<div class="like-box" ref="up">
					<van-button icon="good-job" type="danger" size="small" v-if="objAtr.attitude==1"
						@click="loveFn(true)">已点赞</van-button>
					<van-button icon="good-job-o" type="danger" plain size="small" v-else @click="loveFn(false)">点赞
					</van-button>
				</div>
			</div>
			<!-- 评论列表 -->
			<CommentList @changeClick="indexClick" @commentClick="release"></CommentList>
		</div>


	</div>
</template>

<script>
	import {
		detailAPI,
		userFollowedAPI,
		userUnFollowedAPI,
		likeArticleAPI,
		unLikeArticleAPI
	} from '@/api'
	import {
		timeAgo
	} from '@/utils/date'
	import CommentList from './CommentList'
	export default {
		name: 'Detail',
		components: {
			CommentList
		},
		data() {
			return {
				objAtr: {}, //文章列表
			}
		},
		mounted() {
			this.detailList()
		},
		methods: {
			//获取新闻的详情页
			async detailList() {
				let detailListItem = await detailAPI({
					artId: this.$route.query.art_id
				})
				this.objAtr = detailListItem.data.data
			},
			//获取时间处理函数
			FormData: timeAgo,
			//点击取消/关注
			async followedFn(bool) {
				//用户已关注->取消
				if (bool == true) {
					this.objAtr.is_followed = false;
					let userUnFollowedFalse = await userUnFollowedAPI({
						userId: this.objAtr.aut_id
					})
				} else {
					//用户未关注->关注
					this.objAtr.is_followed = true;
					let userFollowedTrue = await userFollowedAPI({
						userId: this.objAtr.aut_id
					})
				}
			},
			//点赞
			async loveFn(bool) {
				if (bool == true) {
					//用户已点赞->取消
					this.objAtr.attitude = 0
					let unLikeArticle = await unLikeArticleAPI({
						artId: this.objAtr.art_id
					})
				} else {
					this.objAtr.attitude = 1
					let likeArticle = await likeArticleAPI({
						artId: this.objAtr.art_id
					})
				}
			},
			//通过自定义事件,点击子组件后滚动父组件的位置
			indexClick() {
				this.$refs.up.scrollIntoView({ //让原生的标签滚动到屏幕的最上面
					behavior: 'smooth' //有动画效果
				})
			},
			release() {
				this.$refs.up.scrollIntoView({ //让原生的标签滚动到屏幕的最上面
					behavior: 'smooth' //有动画效果
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.article-container {
		padding: 10px;
		margin-top: 46px;
	}

	.art-title {
		font-size: 16px;
		font-weight: bold;
		margin: 10px 0;
	}

	.art-content {
		font-size: 12px;
		line-height: 24px;
		width: 100%;
		overflow-x: scroll;
		word-break: break-all;

		/deep/ img {
			width: 100%;
		}

		/deep/ pre {
			white-space: pre-wrap;
			word-wrap: break-word;
		}
	}

	.van-cell {
		padding: 5px 0;

		&::after {
			display: none;
		}
	}

	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: #f8f8f8;
		margin-right: 5px;
		border: none;
	}

	.like-box {
		display: flex;
		justify-content: center;
	}

	.van-loading {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		position: absolute;
	}
</style>
