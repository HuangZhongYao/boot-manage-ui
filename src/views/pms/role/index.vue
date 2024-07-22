<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/04/01 15:52:40
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" size="small"  @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增角色
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="角色名" :label-width="50">
        <n-input v-model:value="queryItems.name" type="text" placeholder="请输入角色名" clearable />
      </MeQueryItem>
      <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: '启用', value: true },
            { label: '停用', value: false },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="角色名"
          path="name"
          :rule="{
            required: true,
            message: '请输入角色名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="角色编码"
          path="code"
          :rule="{
            required: true,
            message: '请输入角色编码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item label="图标">
          <i class="i-fe:users text-28 text-gray-600 hover:bg-primary" />
          <n-input v-model:value="modalForm.icon" value="i-fe:users text-28 text-gray-600 hover:bg-primary" />
        </n-form-item>
        <n-form-item label="权限" path="permissionIds">
          <n-tree
            key-field="id"
            label-field="name"
            :selectable="false"
            :data="permissionTree"
            :checked-keys="modalForm.permissionIds"
            :on-update:checked-keys="(keys) => (modalForm.permissionIds = keys)"
            checkable
            check-on-click
            default-expand-all
            class="cus-scroll max-h-200 w-full"
          />
        </n-form-item>
        <n-form-item label="状态" path="enable">
          <NSwitch v-model:value="modalForm.enable" :default-value="true" :checked-value="true" :unchecked-value="false">
            <template #checked>
              启用
            </template>
            <template #unchecked>
              停用
            </template>
          </NSwitch>
        </n-form-item>
        <n-form-item label="状态" path="enable">
          <n-input v-model:value="modalForm.remark" type="textarea" maxlength="200" round clearable show-count />
        </n-form-item>
      </n-form>
    </MeModal>
    <n-modal
      ref="selectUserModal"
      v-model:show="selectUserFlag"
      style="width: 800px"
      title="分配用户"
      preset="dialog"
      :mask-closable="false"
      close-on-esc
      type="success"
      :loading="!selectUserFlag"
      positive-text="保存"
      negative-text="取消"
      @positive-click="saveSelectUser"
      @negative-click="cancelSelectUser"
      @on-after-leave="cancelSelectUser"
    >
      <n-transfer
        v-model:value="selectedUser"
        :options="selectUserOptions"
        source-filterable
        :render-target-label="renderLabel"
      />
    </n-modal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch } from 'naive-ui'
import { ref } from 'vue'
import api from './api'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'RoleMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
// 选择用户 用户选项数组
let selectUserOptions = []

// 页码挂载函数
onMounted(() => {
  $table.value?.handleSearch()
})

/**
 * 获取用户
 */
function getAllUsers() {
  // 获取用户,用于分配用户时
  api.getAllUsers().then(({ result = [] }) => {
    selectUserOptions = result.map(item => (
      {
        value: item.id,
        label: `${item.username} (${item.account})`,
        avatarUrl: item.avatarUrl,
      }
    ))
  })
}
// 分配用户模态框
const selectUserModal = ref(null)
// 控制分配用户模态框显示变量
const selectUserFlag = ref(false)
// 已选择用户数组
const selectedUser = ref([])
/**
 * 点击分配用户按钮触发方法
 * @param row
 */
function handelSelectUser(row) {
  // 获取用户
  getAllUsers()
  // 回显穿梭框
  api.queryRoleUser(row.id).then(({ result = [] }) => {
    // 清空
    selectedUser.value.length = 0
    selectedUser.value.push(...result.map(item => item.id))
  })
  // 给模态框传递一个自定数据
  selectUserModal.value.row = row
  // 显示模态框
  selectUserFlag.value = true
}

/**
 * 取消分配用户
 */
function cancelSelectUser() {
  // 清空已选择用户
  selectedUser.value.length = 0
  // 清空row
  selectUserModal.value.row = null
  // 关闭
  selectUserFlag.value = false
}

/**
 * 保存分配用户
 */
function saveSelectUser() {
  api.setRoleUser({ roleId: selectUserModal.value.row.id, userIds: selectedUser.value })
    .then((res) => {
      if (res.result) {
        $message.success('操作成功')
      }
      else {
        $message.warning(res.message)
      }
    })
}

// 选择用户穿梭框自定义标签
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
        h(NAvatar, {
          round: true,
          src: option.avatarUrl,
          size: 'small',
          fallbackSrc: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
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

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit }
  = useCrud({
    name: '角色',
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    initForm: { enable: true },
    refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
  })

const columns = [
  { title: '角色名', key: 'name' },
  { title: '角色编码', key: 'code' },
  { title: '创建时间', key: 'createdTime' },
  {
    title: '状态',
    key: 'enable',
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          disabled: row.code === 'SUPER_ADMIN',
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        },
      ),
  },
  { title: '备注', key: 'remark' },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'info',
            secondary: true,
            onClick: () => handelSelectUser(row),
          },
          {
            default: () => '分配用户',
            icon: () => h('i', { class: 'i-fe:user-plus text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'tiny',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
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

const permissionTree = ref([])
api.getAllPermissionTree().then(({ result = [] }) => (permissionTree.value = result))
</script>
