<template>
	<div>
		<van-cell>
			<template #title>
				<!-- <template #title> 等于   <template v-slot:title> -->
				<div class="title-title">
					<span>{{atrObj.title}}</span>
					<!-- 单图 -->
					<img v-if="atrObj.cover.type === 1" class="thumb"  v-lazy="atrObj.cover.images[0]" alt="">
					<!-- <van-image :src="atrObj.cover.images[0]" v-if="atrObj.cover.type ===1 " class="thumb">
					  <template v-slot:error>图片加载失败</template>
					</van-image> -->
				</div>
				<!-- 多图 -->
				<div class="thumb-box" v-if="atrObj.cover.type >1 ">
				<!-- <van-image v-for="(item,index) in atrObj.cover.images" :key="index" class="thumb" :src="item">
				  <template v-slot:error>图片加载失败</template>
				</van-image> -->
					<img v-for="(item,index) in atrObj.cover.images" :key="index" class="thumb" :src="item" v-lazy="item">
				</div>
			</template>
			<template #label>
				<div class="label-box">
					<div>
						<span>{{atrObj.aut_name}}</span>
						<span>{{atrObj.comm_count}}</span>
						<span>{{timeAgo(atrObj.pubdate)}}</span>
					</div>
					<!-- 反馈按钮 -->
					<van-icon name="cross" @click.stop="show=true" v-if="isshow" />
				</div>
			</template>
		</van-cell>
		<!-- 反馈组件 -->
		<van-action-sheet v-model="show" :actions="actions" @select="onSelect" get-container="body"
			:cancel-text="bottomText" @cancel="cancelFn" @close="closeFn" 
			/>
	</div>
</template>
<script>
	//引入封装好的dayjs的方法 直接调用
	import { timeAgo } from '@/utils/date'
	//投诉列表
	import {firstActions,secondActions} from '@/api/report'
	export default {
		props:{
			atrObj:Object,
			isshow:{
				type:Boolean,//必须是这个属性
				default:true //默认值
			}
		}, //文章列表
		data() {
			return {
				show: false,
				actions: firstActions,
				bottomText: '取消'
			}
		},
		methods: {
			timeAgo, //因为vue没办法直接调用传递过来的方法 因此需要在vue内部写好这个参数后,让用户传值调用
		 onSelect(item, index) {
				//  默认情况下点击选项时不会自动收起 可以通过 close-on-click-action 属性开启自动收起
				switch(item.name){
					case '反馈垃圾内容':
					this.actions = secondActions
					this.bottomText = "返回"
					break;
					case '不感兴趣':
					this.$emit('dislikeArticle',this.atrObj.art_id)
					this.show=false;
					break;
					default:
					this.$emit('reportArticle',this.atrObj.art_id,item.value)
					this.show=false;
				}
			},
			cancelFn(){
				if(this.bottomText === "返回"){
					this.actions=firstActions
					this.bottomText="取消"
					this.show=true
				}
				
			},
			closeFn(){
				this.actions=firstActions;
				this.bottomText="取消"
			},
		},

	}
</script>

<style>
	.title-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label-box span {
		margin: 0 3px;

		/* &值是代表上一级选择器 */
		&:first-child {
			margin-left: 0;
		}
	}

	/* 图片样式 */
	.thumb {
		width: 113px;
		height: 70px;
		background-color: #f8f8f8;
		/* 对图片进行剪切，保留原始比例： */
		object-fit: cover;
	}

	.thumb-box {
		display: flex;
		justify-content: space-between;
	}
</style>
