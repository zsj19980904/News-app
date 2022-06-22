<template>
	<div class="user-edit-container">
		<!-- Header 区域 -->
		<van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />
		<!-- 用户资料 -->
		<van-cell-group class="action-card">
			<van-cell title="头像" is-link center>
				<template #default>
					<van-image round class="avatar" :src="profile.photo" @click="imageClickFn" />
					<input ref="iptFile" type="file" v-show="false" accept="image/*" @change="onFileChange">
				</template>
			</van-cell>
			<van-cell title="名称" is-link :value="profile.name" @click="nameFn" />
			<van-cell title="生日" is-link :value="profile.birthday" @click="birthdayClickFn" />
		</van-cell-group>
		<!-- 弹出框的标签 -->
		<van-dialog v-model="show" title="修改姓名" show-cancel-button :beforeClose="beforeCloseFn">
			<input type="text" v-fofo v-model="inputUserName">
		</van-dialog>
		<!-- 时间选择器 -->
		<van-popup v-model="dataTimeShow" round position="bottom" :style="{ height: '50%' }">
		<van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
		 @cancel="cancelClickFn"
		 @confirm="confirmClickFn"
		 />
		</van-popup>
	</div>
</template>

<script>
	import {userProfileAPI,updateUserPhotoAPI,updateUserProfileAPI} from '@/api'
	import { formDate }from '@/utils/date.js'
	import { Notify } from 'vant';
	import { mapMutations } from 'vuex'
	export default {
		name: 'UserEdit',
		data() {
			return {
				profile: {}, // 用户基本资料
				show: false,
				inputUserName: '', //用户文字回显
				minDate: new Date(1920, 0, 1), //开始时间
				maxDate: new Date(), //结束时间(默认为当前日期)
				currentDate: new Date(), //当前时间
				dataTimeShow:false,//生日弹框显示隐藏
			}
		},
		mounted() {
			this.userProfile()
		},
		methods: {
			//获取vuex的值
			...mapMutations(["SET_USERPHOTO"]),
			//获取列表信息
			async userProfile() {
				let res = await userProfileAPI();
				this.profile = res.data.data
			},
			//上传图片事件 改变时触发
			async onFileChange(e) {
				if (e.target.files.length === 0) return
				let inpFis = new FormData()
				inpFis.append('photo', e.target.files[0])
				let res = await updateUserPhotoAPI(inpFis)
				this.profile.photo = res.data.data.photo
				this.SET_USERPHOTO(res.data.data.photo)
			},
			//模拟文件域点击事件
			imageClickFn() {
				this.$refs.iptFile.click()
			},
			nameFn() {
				this.show = true
				this.inputUserName = this.profile.name
			},
			//点击修改文字信息
			async beforeCloseFn(action, done) {
				if (action == "confirm") {
					//正则表达式
					let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
					if (reg.test(this.inputUserName) === true) {
						await updateUserProfileAPI({
							name: this.inputUserName
						})
						this.profile.name = this.inputUserName //文字回显
						done();
					} else {
						Notify({
							type: 'warning',
							message: '文字输入有误,只能是1-7位的字符、字母和汉字'
						});
						done(false)
					}
				} else {
					//关闭弹框
					done()
				}
			},
		 //点击显示弹出生日
		 birthdayClickFn(){
			 this.dataTimeShow=true;
			 this.currentDate=new Date(this.profile.birthday)
		 },
		 //关闭生日选择
		 cancelClickFn(){
			 this.dataTimeShow=false;
		 },
		 //选择日期
		async confirmClickFn(){
			 await updateUserProfileAPI({
				birthday:formDate(this.currentDate)
			 })
			 this.profile.birthday=formDate(this.currentDate)
			 this.dataTimeShow=false;
		 }
	  }
	}
</script>

<style lang="less" scoped>
	.user-edit-container {
		padding-top: 46px;

		.avatar {
			width: 50px;
			height: 50px;
		}
	}

	::v-deep .van-dialog__content {
		display: flex;

		input {
			padding-top: 5px;
			margin: 0 auto;
			border: none;
			text-align: center;
		}
	}
</style>
