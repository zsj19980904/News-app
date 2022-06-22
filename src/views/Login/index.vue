<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[{ required: true, message: '请填写正确手机号', pattern: /^1[3-9]\d{9}$/ }]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="code"
          label="密码"
          placeholder="请输入6位密码"
          :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
          :disabled="isLoading"
          :loading="isLoading"
          loading-text="正在登录ing..."
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

import { loginAPI } from '@/api'
import { setToken } from '@/utils/token.js'
import Notify from '@/ui/Notify'
import { setStorage } from '@/utils/storage.js'
export default {
  data () {
    return {
      user: {
        mobile: '13888888888', // 手机号
        code: '246810' // 验证码(密码-必须是246810后台规定s的, 无论手机号是什么)
      },
      isLoading: false // 登录按钮-加载状态
    }
  },
  methods: {
    // 提交方法(form整体通过验证才会触发)
    async onSubmit (values) {
      // 可以直接用values(收集参数名和值)
      console.log('submit', values)
      console.log(this.user)
      this.isLoading = true
      try {
        const res = await loginAPI(this.user)
		setToken(res.data.data.token)
		// 这里是定义自己封装的一个弹框
        Notify({ type: 'success', message: '登录成功啦!!!' })
		// 封装一个录入本地存储的函数refresh_token 新的token
        setStorage('refresh_token', res.data.data.refresh_token)
        this.$router.replace({
          path: this.$route.query.path || '/layout/home' 
        })
      } catch (err) {
        // Promise内ajax抛出错误, 直接进入这里
        Notify({ type: 'danger', message: '账号或密码错误' })
      }

      this.isLoading = false // 网络请求完成无论成功/报错, 把状态关掉
    }
  }
}
</script>

<style scoped lang="less">
</style>
