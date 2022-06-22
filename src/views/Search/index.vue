<template>
	<div>
		<!-- 搜索页面头部 -->
		<div class="search-header">
			<!-- 后退按钮 -->
			<van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
			<!-- 搜索组件 -->
			<van-search placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input='inputFn' v-model.trim='kw'
				@search='searchFn' v-fofo />
		</div>
		<!-- 搜索建议列表 -->
		<div class="sugg-list" v-if="kw.length!==0">
			<div class="sugg-item" v-for="(item,index) in suggestList" :key="index" v-html="linghFn(item,kw)"
				@click="suggestClick(item)">
			</div>
		</div>
		<!-- 历史记录 -->
		<div class="search-history" v-else>
			<!-- 标题 -->
			<van-cell title="搜索历史">
				<!-- 使用 right-icon 插槽来自定义右侧图标 -->
				<template #right-icon>
					<van-icon name="delete" class="search-icon" @click="clear" />
				</template>
			</van-cell>
			<!-- 历史列表 -->

			<div class="history-list">
				<span class="history-item" v-for="item,index in history" :key="index"
					@click="historyClick(item)">{{item}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import directive from '@/utils/directive'
	import { suggestListAPI } from '@/api'
	export default {
		name:'Search',
		data() {
			return {
				kw: '', // 搜索关键字
				timer: null, //定时器
				suggestList: [], //存放搜索列表
				history: JSON.parse(localStorage.getItem('his')) || [], // 搜索历史
			}
		},
		methods: {
			//防抖操作
			async inputFn() {
				clearTimeout(this.timer)
				if (this.kw.length == 0) {
					this.suggestList = [];
					return
				} else {
					this.timer = setTimeout(async () => {
						let suggesS = await suggestListAPI({
							keywords: this.kw
						})
						this.suggestList = suggesS.data.data.options
					}, 300)
				}
			},
			//处理文字高亮问题
			linghFn(item, target) {
				const reg = new RegExp(target, 'ig') //i是忽略大小写 g是全局匹配
				//item原来的字符串
				//target 关键字
				return item.replace(reg, (match) => {
					return `<span style="color:red;">${match}</span>`
				})
			},
			
			//封装一个跳转方法
			moveFn(theKw) {
				setTimeout(() => {
					this.$router.push({
						path: `/search_result/${theKw}`
					})
				}, 0)
			},
			//输入框搜索事件
			searchFn() {
				if (this.kw.length > 0) {
					this.history.push(this.kw)
					this.moveFn(this.kw)
				}
			},
			//联想词的点击事件
			suggestClick(item) {
				this.history.push(item)
				this.moveFn(item)
			},
			//历史记录的点击事件
			historyClick(item) {
				this.moveFn(item)
			},
			//清空历史记录
			clear() {
				this.history = [];
			},
		},
		//监听器的使用 深度监听历史事件
		watch: {
			history: {
				deep: true,
				handler() {
					//数组去重
					const theSet = new Set(this.history)
					//为伪数组变成数组
					let arr = Array.from(theSet)
					localStorage.setItem('his', JSON.stringify(arr))
				}
			}
		}
	}
</script>










































<style scoped lang="less">
	.search-header {
		height: 46px;
		display: flex;
		align-items: center;
		background-color: #007bff;
		overflow: hidden;

		/*后退按钮*/
		.goback {
			padding-left: 14px;
		}

		/*搜索组件*/
		.van-search {
			flex: 1;
		}
	}

	.sugg-list {
		.sugg-item {
			padding: 0 15px;
			border-bottom: 1px solid #f8f8f8;
			font-size: 14px;
			line-height: 50px;
			// 实现省略号的三行代码
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	-icon {
		font-size: 16px;
		line-height: inherit;
	}

	.history-list {
		padding: 0 10px;

		.history-item {
			display: inline-block;
			font-size: 12px;
			padding: 8px 14px;
			background-color: #efefef;
			margin: 10px 8px 0px 8px;
			border-radius: 10px;
		}
	}
</style>
