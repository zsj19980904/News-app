<template>
	<div>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="更新成功">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
				:immediate-check="false" offset=50>
				<ArticleItem
				 v-for="(item,index) in list" 
				 :key="item.art_id" :atrObj="item" 
				 @dislikeArticle="dislikeFn" 
				 @reportArticle="reportFn"
				 @click.native="clickLtemNewsFn(item.art_id)"
				 >
				</ArticleItem>
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { Toast,Notify } from 'vant';
	import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
	import ArticleItem from '../../../components/ArticleItem'
	export default {
		props: {
			channelsId: Number
		},
		data() {
			return {
				list: [],
				loading: false,
				finished: false,
				thenTime: (new Date()).getTime(), //获取当前系统的时间,请求需要(第一次请求的时候，获取)
				isLoading: false,
			}
		},
		created() {
			this.allArticleListAPI();
		},
		methods: {
			async allArticleListAPI() {
				let list = await getAllArticleListAPI({
					channel_id: this.channelsId,
					timestamp: this.thenTime
				})
				//通化ES6的扩展运算符合并数组
				this.list = [...this.list, ...list.data.data.results];
				//获取当前的时间戳
				this.thenTime = list.data.data.pre_timestamp
				this.loading = false;
				this.isLoading = false;
				//这里判断上一次的时间戳 如果没有就说明数据无了
				if (list.data.data.pre_timestamp == null) {
					this.finished = true
				}

			},
			async onLoad() {
				//这里主要是因为页面一进来就判断了页面高度，这个时候页面还没有被渲染上，因此会发送一次请求 所有会导致页面重复id的问题 这个时候
				//用if判断一下 list里面有无数据 如果有就发请求,没有就跳过
				if (this.list.length == 0) {
					this.loading = false;
					return
				}
				this.allArticleListAPI()
			},

			async onRefresh() {
				this.list = [];
				this.thenTime = (new Date()).getTime();
				this.allArticleListAPI()
				Toast('刷新成功');
			},
			//接收子传父的值
			async dislikeFn(id) {
				await dislikeArticleAPI({
					artId:id
				})
				Notify({
					type: 'success',
					message: '反馈成功'
				})
			},
			async reportFn(id,value){
				console.log(value)
				await reportArticleAPI({
					artId:id,
					type:value,
				})
				Notify({
					type: 'success',
					message: '举报成功'
				})
			},
			clickLtemNewsFn(id){
				this.$router.push({
					//获取跳转到那个id的文章列表
					path:`/detail?art_id=${id}`
				})
			}

		},
		components: {
			ArticleItem
		}
	}
</script>

<style>
</style>
