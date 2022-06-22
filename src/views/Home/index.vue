<template>
	<div>
		<div>
			<van-nav-bar fixed>
				<!-- vant 插槽的第一种写法 -->
				<template v-slot:left>
					<!-- <img class="logo" src="@/assets/logo.png" alt=""> -->
				</template>
				<!-- vant 插槽的第二种写法 -->
				<template #right>
					<!-- 这里要写rem的原因是 size是像素没办法自适应 -->
					<van-icon name="search" size="0.48rem" @click="moveSearchPageFn" />
				</template>
			</van-nav-bar>
		</div>
		<!-- tab切换 -->
		<div>
			<!-- 细节 
			vant-tabs循环了很多标签，与之一 一对应的内容列表不是上来的创建
			而且通过点击创建当前激活导航对应列表组件 第一次点击时才会创建 <ArticleList>
			第二次切换就是显示/隐藏切换
			 -->
			<van-tabs v-model="channelsId" @change="changeChangeFn" class="main" animated sticky swipeable
				offset-top="1.2266rem">
				<van-tab v-for="(item,index) in channels" :key="item.id" :title="item.name">
					<ArticleList :channelsId="channelsId"></ArticleList>
				</van-tab>
			</van-tabs>
			<van-icon name="plus" size="0.4rem" class="moreChannels" @click="showPopup" />
			<van-popup v-model="show" get-container="body" class="channel-popup">
				<ChannelEdit :userList='channels' :unUserList="unCheckChannelList" @addChanneEV="addChanneFn"
					@removeChannelEV='removeChannelFn' @closeEV="closeFn" v-model="channelsId">
				</ChannelEdit>
			</van-popup>
		</div>

	</div>
</template>

<script>
	import ArticleList from './components/ArticleList.vue'
	import ChannelEdit from './ChannelEdit.vue'
	import {
		getUserChannelsAPI,
		getAllChannelsAPI,
		updateChannelsAPI,
		removeTheChannelAPI
	} from '@/api'
	export default {
		components: {
			ArticleList,
			ChannelEdit
		},
		data() {
			return {
				channelsId: 0, //这个绑定成id
				channels: [], //存放默认的列表频道
				channelsAll: [], //存放所有的列表频道的数据
				show: false,
				channelScrillTObj: {} //保存每一个频道的滚动位置 用{频道id：滚动距离 html频道id：自己滚动的距离}
			};
		},
		mounted() {
			this.userChannelsAPI();
			this.AllChannelsAPI();
		},
		methods: {
			//获取默认的列表频道
			async userChannelsAPI() {
				let userChannels = await getUserChannelsAPI();
				this.channels = userChannels.data.data.channels
			},
			//tabs切换事件
			changeChangeFn() {
				//要等页面更新高度为0加载完后，在赋值，异步(组件的css问题)
				this.$nextTick(()=>{
					//把id里面存的值赋值过去
				 document.documentElement.scrollTop=this.channelScrillTObj[this.channelsId] 
				})
				
			},
			//点击出弹框
			showPopup() {
				this.show = true;
			},
			//发送全部的请求
			async AllChannelsAPI() {
				let allChanne = await getAllChannelsAPI()
				this.channelsAll = allChanne.data.data.channels
			},
			//添加属性
			async addChanneFn(channelObj) {
				this.channels.push(channelObj); //添加进数组，页面添加
				//筛选出不是推荐频道剩下的频道，要求推荐频道的id页不能传
				let newArr = this.channels.filter(item => item.id !== 0)
				//赛选出已经选中的标题
				let thenArr = newArr.map((item, index) => {
					const newObj = {
						...item
					} //浅拷贝一个对象
					delete newObj.name //删除一个对象
					newObj.seq = index //把index下标缓存seq数据
					return newObj //让map方法把新的对象收集起来形成一个新的数组
				})
				let updateChannels = await updateChannelsAPI({
					channels: thenArr //这里相当于浅拷贝一个数据
				})
			},
			//删除属性
			async removeChannelFn(obj) {
				//把删除的id传递过去 页面和接口都要删除
				const index = this.channels.findIndex((item) => { //判断该元素的数组中的位置
					return item.id === obj.id
				})

				this.channels.splice(index, 1) //删除数组
				let removeTheChannel = await removeTheChannelAPI({
					channelId: obj.id //并把id发过去
				})
			},
			//关闭频道管理
			closeFn() {
				this.show = false;
			},
			//跳转到搜索页
			moveSearchPageFn() {
				this.$router.push("/search")
			},
			//监听网页的规定事件
			scrollFn() {
				//滚动页面的高度
				this.$route.meta.scrollT = document.documentElement.scrollTop
				//向频道保存当前滚动的距离
				this.channelScrillTObj[this.channelsId] = document.documentElement.scrollTop
			}
		},
		//筛选出未选择的频道
		computed: {
			unCheckChannelList() {
				//先过滤所有对象里面的东西
				let newArr = this.channelsAll.filter(bigObj => {
					//再过滤出已选对象的
					let index = this.channels.findIndex(smallObj => {
						//返回为真或假
						return bigObj.id === smallObj.id
					})
					//找到下标后就返回为假
					if (index > -1) {
						return false
					} else {
						return true
					}
				})
				//最后再大返回
				return newArr;
			}
		},
		//切进来触发的事件
		activated() {
			window.addEventListener('scroll', this.scrollFn); //获取当前页面的高度
			document.documentElement.scrollTop = this.$route.meta.scrollT
		},
		//切出去触发的事件
		deactivated() {
			window.removeEventListener('scroll', this.scrollFn)
		}
	}
</script>

<style scoped lang="less">
	.logo {
		width: 100px;
		height: 30px;
	}

	.main {
		padding-top: 46px;
	}

	/deep/ .van-tabs__wrap {
		padding-right: 30px;
		background-color: #fff;
	}

	.moreChannels {
		position: fixed;
		top: 60px;
		right: 6px;
		z-index: 999;
	}

	.channel-popup {
		width: 100vw;
		height: 100vh;
	}
</style>
