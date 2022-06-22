<template>
	<div>
		<!-- 评论列表 -->
		<div class="cmt-list" :class="{'art-cmt-container-1':isShowCmtInput,'art-cmt-container-2':!isShowCmtInput}">
			<!-- 评论的 Item 项 -->
			<van-list v-model="loading" :finished="finished" finished-text="没有更多评论了" @load="onLoad"
				:immediate-check="false">
				<div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
					<!-- 头部区域 -->
					<div class="cmt-header">
						<!-- 头部左侧 -->
						<div class="cmt-header-left">
							<img :src="obj.aut_photo" alt="" class="avatar">
							<span class="uname">{{obj.aut_name}}</span>
						</div>
						<!-- 头部右侧 -->
						<div class="cmt-header-right">
							<van-icon name="like" size="16" color="red" v-if="obj.is_liking == true"
								@click="linkFn(true,obj)" />
							<van-icon name="like-o" size="16" color="gray" v-else @click="linkFn(false,obj)" />
						</div>
					</div>
					<!-- 主体区域 -->
					<div class="cmt-body">
						{{obj.content}}
					</div>
					<!-- 尾部区域 -->
					<div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
				</div>
			</van-list>
		</div>
		<!-- 发送评论 -->
		<div>
			<div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput==false">
				<van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
				<div class="ipt-cmt-div" @click="isShowCmtInput=true">发表评论</div>
				<div class="icon-box" @click="changeClick">
					<van-badge :content="totalCount==0?'':totalCount" max="99">
						<van-icon name="comment-o" size="0.53333334rem" />
					</van-badge>
					<van-icon name="star-o" size="0.53333334rem" />
					<van-icon name="share-o" size="0.53333334rem" />
				</div>
			</div>

			<!-- 底部添加评论区域 - 2 -->
			<div class="cmt-box van-hairline--top" v-else>
				<textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="changeBlur" v-model="comText"></textarea>
				<van-button type="default" :disabled="comText.length===0" @click="sendFn">发布</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	//获取文章列表 喜欢评论 不喜欢评论
	import {
		commentsListAPI,
		commentLikingAPI,
		commentDisLikingAPI,
		commentSendAPI
	} from '@/api'
	//处理时间函数
	import {
		timeAgo
	} from '@/utils/date'
	export default {
		data() {
			return {
				offset: null, //偏移量评论ID
				commentArr: [], //评论数据
				totalCount: '', //评论总数量(后台给我的)
				isShowCmtInput: false, //显示评论列表的高(true)/低(fleas)
				comText: '', //文本框
				loading: false,
				finished: false,
				lastId: null, //分页
			}
		},
		mounted() {
			this.commentsList()
		},
		methods: {
			timeAgo,
			//发送数据
			async commentsList() {
				let res = await commentsListAPI({
					id: this.$route.query.art_id
				})
				console.log(res)
				this.commentArr = res.data.data.results //获取评论列表
				this.totalCount = res.data.data.total_count //获取评论数量
				this.lastId = res.data.data.last_id //分页
				if(res.data.data.results.length===0){
					this.finished=true;
				}
			},
			//判断喜欢文章和v不喜欢文章
			async linkFn(bool, commentObj) {
				if (bool === true) {
					console.log(commentObj)
					commentObj.is_liking = false;
					await commentDisLikingAPI({
						comId: commentObj.com_id
					})
				} else {
					commentObj.is_liking = true;
					await commentLikingAPI({
						comId: commentObj.com_id
					})
				}
			},
			//发布评论
			async sendFn() {
				let res = await commentSendAPI({
					id: this.$route.query.art_id,
					content: this.comText
				})
				this.commentArr.unshift(res.data.data.new_obj)
				this.$emit('commentClick') //定义自定义事件，把点击事件发出去
				this.comText=''
				this.totalCount++
			},

			//延迟失去焦点事件(宏任务/微任务)
			changeBlur() {
				setTimeout(() => {
					//这里异步变成false，因为如果不设置setTimeout点击发布的瞬间都会失去焦点后变成小的了
					this.isShowCmtInput = false
				}, 0)
			},
			//定义自定义事件(子传父)
			changeClick() {
				//传点击事件过去
				this.$emit('changeClick')
			},
			//底部评论列表
			async onLoad() {
				if (this.commentArr.length > 0) {
					let res = await commentsListAPI({
						id: this.$route.query.art_id,
						offset: this.lastId
					})
					//判断last.id应该在之前 因为 如果只有一条数据的话 也会合并 就会造成重复一条数据的情况
					if (res.data.data.last_id == null) {
						this.finished = true
					}
					this.commentArr = [...this.commentArr, ...res.data.data.results] //获取评论列表
					this.totalCount = res.data.data.total_count //获取评论数量
					this.lastId = res.data.data.last_id //分页
					this.loading = false;
				} else {
					this.loading = false
				}
			}

		}
	}
</script>

<style scoped lang="less">
	.cmt-list {
		padding: 10px;

		.cmt-item {
			padding: 15px 0;

			+.cmt-item {
				border-top: 1px solid #f8f8f8;
			}

			.cmt-header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.cmt-header-left {
					display: flex;
					align-items: center;

					.avatar {
						width: 40px;
						height: 40px;
						background-color: #f8f8f8;
						border-radius: 50%;
						margin-right: 15px;
					}

					.uname {
						font-size: 12px;
					}
				}
			}

			.cmt-body {
				font-size: 14px;
				line-height: 28px;
				text-indent: 2em;
				margin-top: 6px;
				word-break: break-all;
			}

			.cmt-footer {
				font-size: 12px;
				color: gray;
				margin-top: 10px;
			}
		}
	}

	.art-cmt-container-1 {
		padding-bottom: 46px;
	}

	.art-cmt-container-2 {
		padding-bottom: 80px;
	}

	// 发布评论的盒子 - 1
	.add-cmt-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 46px;
		line-height: 46px;
		padding-left: 10px;

		.ipt-cmt-div {
			flex: 1;
			border: 1px solid #efefef;
			border-radius: 15px;
			height: 30px;
			font-size: 12px;
			line-height: 30px;
			padding-left: 15px;
			margin-left: 10px;
			background-color: #f8f8f8;
		}

		.icon-box {
			width: 40%;
			display: flex;
			justify-content: space-evenly;
			line-height: 0;
		}
	}

	.child {
		width: 20px;
		height: 20px;
		background: #f2f3f5;
	}

	// 发布评论的盒子 - 2
	.cmt-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		padding-left: 10px;
		box-sizing: border-box;
		background-color: white;

		textarea {
			flex: 1;
			height: 66%;
			border: 1px solid #efefef;
			background-color: #f8f8f8;
			resize: none;
			border-radius: 6px;
			padding: 5px;
		}

		.van-button {
			height: 100%;
			border: none;
		}
	}
</style>
