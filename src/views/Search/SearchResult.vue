<template>
	<div>
		<!-- 搜索结果页-头部导航 -->
		<div class="search-result-container">
			<!-- 点击实现后退效果 -->
			<van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
		</div>
		<div>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
				:immediate-check="false">
				<!-- 列表详情 -->
				<ArticleItem 
				v-for="obj in searchResultListitem" 
				:key="obj.art_id" :atrObj="obj" 
				:isshow="false"
				@click.native="clickLtemNewsFn(obj.art_id)"
				></ArticleItem>
			</van-list>
		</div>
	</div>
</template>

<script>
	import {searchResultAPI} from '@/api'
	import ArticleItem from '@/components/ArticleItem.vue'
	export default {
		name: 'SearchResult',
		data() {
			return {
				page: 1, //默认为1
				searchResultListitem: [], //获取列表数据 
				loading: false, //加载状态
				finished: false, //是否全部加载完成
			}
		},
		mounted() {
			this.getsearchResult();
		},
		methods: {
			//请求输入框的数据
			async getsearchResult() {
				let searchResult = await searchResultAPI({
					page: this.page,
					q: this.$route.params.kw
				})
				if (searchResult.data.data.results.length === 0) {
					return this.finished = true;
				}
				this.searchResultListitem = [...this.searchResultListitem, ...searchResult.data.data.results]
				this.loading = false
			},
			async onLoad() {
				if (this.searchResultListitem.length > 0) {
					this.page++
					this.getsearchResult()
				}
			},
			//跳转文章的详情页
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

<style lang="less" scoped>
	.search-result-container {
		padding-top: 46px;
	}
</style>
