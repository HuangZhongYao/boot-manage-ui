<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:36
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div
      class="m-auto max-w-700 min-w-345 f-c-c rounded-8 bg-opacity-20 bg-cover p-12 card-shadow auto-bg"
    >
      <div class="hidden w-380 px-20 py-35 md:block">
        <img src="@/assets/images/login_3.svg" class="w-full" alt="login_banner">
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img src="/public/favicon.png" class="mr-12 h-50">
          {{ title }}
        </h2>
        <n-input
          v-model:value="loginInfo.account"
          autofocus
          class="mt-32 h-40 items-center"
          placeholder="请输入账号"
          :maxlength="50"
          @keydown.enter="onShow()"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password"
          class="mt-20 h-40 items-center"
          type="password"
          show-password-on="mousedown"
          placeholder="请输入密码"
          :maxlength="50"
          @keydown.enter="onShow()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </n-input>

        <n-checkbox
          class="mt-20"
          :checked="isRemember"
          label="记住我"
          :on-update:checked="(val) => (isRemember = val)"
        />

        <div class="mt-20 flex items-center">
          <n-button
            class="ml-32 h-40 flex-1 rounded-5 text-16"
            type="primary"
            :loading="loading"
            @click="onShow()"
          >
            登录
          </n-button>
        </div>
        <Vcode :show="isShow" range="8" @success="onSuccess" @close="onClose" />
      </div>
    </div>
    <TheFooter class="py-12" />
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import Vcode from 'vue3-puzzle-vcode'
import { useRoute, useRouter } from 'vue-router'
import api from './api'
import { lStorage } from '@/utils'
import { useAuthStore } from '@/store'
import { TheFooter } from '@/components/index.js'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_TITLE

const loginInfo = ref({
  account: '',
  password: '',
})

// 定义一个变量控制验证组件显示
const isShow = ref(false)

// 关闭验证组件方法
function onShow() {
  isShow.value = true
}

// 关闭验证组件方法
function onClose() {
  isShow.value = false
}

// 验证组件验证通过回调
function onSuccess() {
  isShow.value = false
  handleLogin()
}

// 记住我自动回填
const localLoginInfo = lStorage.get('loginInfo')
if (localLoginInfo) {
  loginInfo.value.account = localLoginInfo.account || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

// 记住账号密码
const isRemember = useStorage('isRemember', true)
const loading = ref(false)

/**
 * 登录方法
 * @returns {Promise<*>}
 */
async function handleLogin() {
  const { account, password, captcha } = loginInfo.value
  if (!account || !password)
    return $message.warning('请输入用户名和密码')

  try {
    loading.value = true
    $message.loading('正在验证，请稍后...', { key: 'login' })
    const { result } = await api.login({ account, password: password.toString(), captcha })
    if (isRemember.value) {
      lStorage.set('loginInfo', { account, password })
    }
    else {
      lStorage.remove('loginInfo')
    }
    // 登录回调
    onLoginSuccess(result)
  }
  catch (error) {
    $message.destroy('login')
    console.error(error)
  }
  loading.value = false
}

/**
 * 登录成功
 * @param data
 * @returns {Promise<void>}
 */
async function onLoginSuccess(data = {}) {
  authStore.setToken(data)
  $message.loading('登录中...', { key: 'login' })
  try {
    $message.success('登录成功', { key: 'login' })
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      router.push({ path, query: route.query })
    }
    else {
      router.push('/')
    }
  }
  catch (error) {
    console.error(error)
    $message.destroy('login')
  }
}
</script>
