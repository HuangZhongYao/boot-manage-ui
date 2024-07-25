<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:30:11
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <n-avatar round :size="100" :src="userStore.avatar" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>用户名:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <n-button v-permission="'ChangePwd'" class="ml-32" type="primary" text @click="pwdModalRef.open()">
              <i class="i-fe:edit mr-4" />
              修改密码
            </n-button>
          </div>
          <div class="mt-16 flex items-center">
            <n-button v-permission="'ChangeAvatar'" type="primary" ghost @click="avatarModalRef.open()">
              更改头像
            </n-button>
            <span class="ml-12 opacity-60">
              修改头像只支持在线链接，不提供上传图片功能，如有需要可自行对接！
            </span>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" title="个人资料信息">
      <template #header-extra>
        <n-button v-permission="'EditProfile'" type="primary" text @click="editProfileFlag = true">
          <i class="i-fe:edit mr-4" />
          修改资料
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item label="登录账号">
          {{ userStore.account }}
        </n-descriptions-item>
        <n-descriptions-item label="昵称">
          {{ userStore.username }}
        </n-descriptions-item>
        <n-descriptions-item label="性别">
          {{ genders.find((item) => item.value === userStore.userInfo?.gender)?.label ?? '未知' }}
        </n-descriptions-item>
        <n-descriptions-item label="电话">
          {{ userStore.userInfo?.phone }}
        </n-descriptions-item>
        <n-descriptions-item label="最后登录时间">
          {{ userStore.userInfo?.lastLoginTime ? formatDateTime(userStore.userInfo.lastLoginTime) : '' }}
        </n-descriptions-item>
        <n-descriptions-item label="备注">
          {{ userStore.userInfo?.remark }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <MeModal ref="avatarModalRef" width="420px" title="更改头像" @ok="handleAvatarSave()">
      <n-input v-model:value="newAvatar" />
    </MeModal>

    <MeModal ref="pwdModalRef" title="修改密码" width="420px" @ok="handlePwdSave()">
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="原密码" path="oldPassword" :rule="required">
          <n-input v-model:value="pwdForm.oldPassword" type="password" placeholder="请输入原密码" />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword" :rule="required">
          <n-input v-model:value="pwdForm.newPassword" type="password" placeholder="请输入新密码" />
        </n-form-item>
      </n-form>
    </MeModal>

    <n-drawer v-model:show="editProfileFlag" :width="502">
      <n-drawer-content title="修改信息">
        <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
          <n-form-item label="账号">
            <QuestionLabel label="" content="登录用户名不可更改" />
            <n-input :value="profileForm.account" disabled />
          </n-form-item>
          <n-form-item label="昵称" path="username">
            <QuestionLabel label="" content="用户名也是昵称" />
            <n-input v-model:value="profileForm.username" placeholder="请输入用户名" />
          </n-form-item>
          <n-form-item label="性别" path="gender">
            <QuestionLabel label="" content="请选择性别" />
            <n-select
              v-model:value="profileForm.gender"
              :options="genders"
              placeholder="请选择性别"
            />
          </n-form-item>
          <n-form-item label="电话" path="phone">
            <QuestionLabel label="" content="请输入电话" />
            <n-input v-model:value="profileForm.phone" placeholder="请输入电话" />
          </n-form-item>
          <n-form-item label="备注" path="remark">
            <QuestionLabel label="" content="备注信息" />
            <n-input v-model:value="profileForm.remark" type="textarea" maxlength="230" placeholder="备注" show-count />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button @click="editProfileFlag = false">
            取消
          </n-button>
          <n-button type="primary" class="ml-20" @click="handleProfileSave">
            保存
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </AppPage>
</template>

<script setup>
import api from './api'
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'
import { formatDateTime } from '@/utils/common.js'
import QuestionLabel from '@/views/pms/resource/components/QuestionLabel.vue'

const userStore = useUserStore()
const required = {
  required: true,
  message: '此为必填项',
  trigger: ['blur', 'change'],
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  pwdForm.value.id = userStore.userId
  await api.changePassword(pwdForm.value)
  $message.success('密码修改成功')
  await refreshUserInfo()
}

const newAvatar = ref(userStore.avatar)
const [avatarModalRef] = useModal()
async function handleAvatarSave() {
  if (!newAvatar.value) {
    $message.error('请输入头像地址')
    return false
  }
  await api.updateProfile({ id: userStore.userId, avatarUrl: newAvatar.value })
  $message.success('头像修改成功')
  refreshUserInfo()
}

const genders = [
  { label: '保密', value: 'UNKNOWN' },
  { label: '男', value: 'MALE' },
  { label: '女', value: 'FEMALE' },
]

const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nickName: userStore.nickName,
  account: userStore.account,
  username: userStore.username,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email,
  phone: userStore.userInfo?.phone,
  remark: userStore.userInfo?.remark,
})

const editProfileFlag = ref(false)

async function handleProfileSave() {
  await profileValidation()
  await api.updateProfile(profileForm.value)
  $message.success('资料修改成功')
  await refreshUserInfo()
  editProfileFlag.value = false
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
