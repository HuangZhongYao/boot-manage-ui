<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddUser'" size="small" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建用户
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="用户名" :label-width="50">
        <n-input
          v-model:value="queryItems.username"
          type="text"
          placeholder="请输入用户名"
          clearable
          style="min-width: 70%"
          autosize
        />
      </MeQueryItem>

      <MeQueryItem label="账号" :label-width="50">
        <n-input
          v-model:value="queryItems.account"
          type="text"
          placeholder="请输入账号"
          clearable
          style="min-width: 70%"
          autosize
        />
      </MeQueryItem>

      <MeQueryItem label="性别" :label-width="40">
        <n-select v-model:value="queryItems.gender" clearable :options="genders" />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="用户名"
          path="username"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.username" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          label="登录账号"
          path="account"
          :rule="{
            required: true,
            message: '请输入登录账号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.account" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? '重置密码' : '初始密码'"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="角色" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="状态" path="enable">
          <NSwitch v-model:value="modalForm.enable">
            <template #checked>
              启用
            </template>
            <template #unchecked>
              停用
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>
    </MeModal>

    <n-modal
      ref="selectRoleModal"
      v-model:show="selectRoleFlag"
      style="width: 800px"
      :title="selectRoleModalTitle"
      preset="dialog"
      :mask-closable="false"
      close-on-esc
      type="success"
      :loading="!selectRoleFlag"
      :positive-text="selectRoleLoadingFlag ? '' : '保存'"
      :negative-text="selectRoleLoadingFlag ? '' : '取消'"
      @positive-click="saveSelectRole"
      @negative-click="cancelSelectRole"
      @on-after-leave="cancelSelectRole"
    >
      <n-space v-show="selectRoleLoadingFlag" :size="[50, 5]" justify="center">
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
        <n-skeleton height="35px" width="310px" />
      </n-space>
      <n-transfer
        v-show="!selectRoleLoadingFlag"
        v-model:value="selectedRole"
        :options="selectRoleOptions"
        :render-source-label="renderLabel"
        :render-target-label="renderLabel"
        source-filterable
      />
    </n-modal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import api from './api'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

// 分配角色模态框
const selectRoleModal = ref(null)
// 分配角色模态框标题
let selectRoleModalTitle
// 控制分配角色模态框显示变量
const selectRoleFlag = ref(false)
// 分配角色加载层
const selectRoleLoadingFlag = ref(false)
// 已选择角色数组
const selectedRole = ref([])
// 选择角色 角色选项数组
let selectRoleOptions = []

/**
 * 点击分配用户按钮触发方法
 * @param row
 */
async function handelSelectRole(row) {
  // 显示模态框
  selectRoleFlag.value = true
  // 显示骨架屏加载层
  selectRoleLoadingFlag.value = true
  // 获取用户
  await getAllRoles()
  // 回显穿梭框
  await api.getUserRole(row.id).then(({ result = [] }) => {
    // 清空
    selectedRole.value.length = 0
    selectedRole.value.push(...result.map(item => item.id))
  })
  // 关闭骨架屏加载层
  selectRoleLoadingFlag.value = false
  // 设置模态框标题
  selectRoleModalTitle = `${row.username}分配角色`
  // 给模态框传递一个自定数据
  selectRoleModal.value.row = row
}

/**
 * 获取用户
 */
function getAllRoles() {
  // 获取用户,用于分配用户时
  api.getAllRoles().then(({ result = [] }) => {
    selectRoleOptions = result.map(item => (
      {
        value: item.id,
        label: item.name,
        icon: item.icon,
        code: item.code,
        disabled: !item.enable,
      }
    ))
  })
}

/**
 * 保存分配角色
 */
function saveSelectRole() {
  api.setRole({ userId: selectRoleModal.value.row.id, roleIds: selectedRole.value })
    .then((res) => {
      if (res.result) {
        $message.success('操作成功')
      }
      else {
        $message.warning(res.message)
      }
    })
}

/**
 * 取消分配角色
 */
function cancelSelectRole() {
  // 清空已选择用户
  selectedRole.value.length = 0
  // 清空row
  selectRoleModal.value.row = null
  // 关闭
  selectRoleFlag.value = false
}

// 选择角色穿梭框自定义标签
const renderLabel = function ({ option }) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        margin: '6px 0',
      },
    },
    {
      default: () => [
        h('i', {
          class: `${option.icon} text-18 mr-8`,
        }),
        h(
          'div',
          {
            style: {
              display: 'flex',
              marginLeft: '6px',
              alignSelf: 'center',
            },
          },
          { default: () => option.label },
        ),
      ],
    },
  )
}

const genders = [
  { label: '男', value: 'MALE' },
  { label: '女', value: 'FEMALE' },
  { label: '保密', value: 'UNKNOWN' },
]
const roles = ref([])
api.getAllRoles().then(({ result = [] }) => (roles.value = result))

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: '用户',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  {
    title: '头像',
    key: 'avatarUrl',
    width: 80,
    render: ({ avatarUrl }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatarUrl,
      }),
  },
  { title: '用户名', key: 'username', width: 130, ellipsis: { tooltip: true } },
  { title: '账号', key: 'account', width: 130, ellipsis: { tooltip: true } },
  {
    title: '角色',
    key: 'roles',
    width: 100,
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: 'success', round: true, size: 'small', bordered: false, style: index > 0 ? 'margin-left: 8px;' : '' },
            { default: () => item.name },
          ),
        )
      }
      return '暂无角色'
    },
  },
  {
    title: '性别',
    key: 'gender',
    width: 80,
    render: ({ gender }) => genders.find(item => gender === item.value)?.label ?? '',
  },
  { title: '手机号', key: 'phone', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createdTime',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row.createTime))
    },
  },
  { title: '描述', key: 'remark', width: 150, ellipsis: { tooltip: true } },
  {
    title: '最后登录时间',
    key: 'lastLoginTime',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row.createTime))
    },
  },
  {
    title: '状态',
    key: 'enable',
    width: 120,
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        },
      ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 260,
    align: 'left',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'info',
            secondary: true,
            vIf: false,
            onClick: () => handelSelectRole(row),
          },
          {
            default: () => '分配角色',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: 'margin-left: 8px;',
            onClick: () => handleOpen({ action: 'reset', title: '重置密码', row, onOk: onSave }),
          },
          {
            default: () => '重置密码',
            icon: () => h('i', { class: 'i-me:resetpwd' }),
          },
        ),

        h(
          NButton,
          {
            size: 'tiny',
            type: 'error',
            style: 'margin-left: 8px;',
            onClick: () => handleDelete({ ids: [row.id] }),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  }
  catch (error) {
    row.enableLoading = false
  }
}

function handleOpenRolesSet(row) {
  const roleIds = row.roles?.map(item => item.id)
  handleOpen({
    action: 'setRole',
    title: '分配角色',
    row: { id: row.id, userId: row.id, username: row.username, account: row.account, roleIds },
    onOk: onSave,
  })
}

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.setRole(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  }
  else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}
</script>
