<!--------------------------------
 - Author    ZhongYao.Huang (https://github.com/HuangZhongYao)
 - Time      2024-08-17 22:48
 - Copyright © 2024 ZuuuuYao By Github
 --------------------------------->
<template>
  <CommonPage>
    <n-flex justify="space-between">
      <n-flex vertical :size="[46, 10]">
        <h3>字典类型</h3>
        <div class="flex">
          <n-input v-model:value="treeOption.pattern" placeholder="搜索" clearable />
          <NButton class="ml-12" type="primary" ghost quaternary @click="initData">
            <i class="i-fe:rotate-ccw mr-4 text-14" />
          </NButton>
          <NButton v-permission="'AddDict'" class="ml-12" type="primary" @click="handleAddDictType">
            <i class="i-material-symbols:add mr-4 text-14" />
            新增
          </NButton>
        </div>
        <n-spin size="small" :show="treeOption.treeLoading">
          <n-tree
            :show-irrelevant-nodes="false"
            :pattern="treeOption.pattern"
            :data="treeData"
            :selected-keys="[currentNode?.id]"
            :render-switcher-icon="renderSwitcherIcon"
            :render-prefix="renderPrefix"
            :render-suffix="renderSuffix"
            :on-update:selected-keys="onSelect"
            key-field="id"
            label-field="name"
            default-expand-all
            block-line
          />
        </n-spin>
      </n-flex>
      <n-flex vertical class="ml-20 flex-1" style="flex-grow: 2">
        <n-flex inline justify="space-between">
          <h3>{{ currentNode?.name }}</h3>
          <NButton v-permission="'AddDict'" :style="currentNode ? '' : 'visibility: hidden'" class="" type="primary" @click="handleAddDictData()">
            <i class="i-material-symbols:add mr-4 text-14" />
            新增
          </NButton>
        </n-flex>
        <NDataTable
          :remote="true"
          :columns="tableOption.columns"
          :loading="tableOption.loading"
          :data="tableData"
          :pagination="false"
          :max-height="600"
          virtual-scroll
        />
      </n-flex>
      <n-modal
        v-model:show="treeOption.showModal"
        class="custom-card"
        preset="card"
        :title="treeOption.modalTitle"
        size="small"
        close-on-esc
        :mask-closable="false"
        :style="treeOption.bodyStyle"
        :bordered="false"
        hoverable
      >
        <n-descriptions label-placement="top" bordered :column="1">
          <n-descriptions-item label="所属上级" :span="2">
            <n-tree-select
              :options="treeData"
              :default-value="treeOption.modalForm.parentId"
              @update:value="treeSelectChange"
            />
          </n-descriptions-item>

          <n-descriptions-item label="类型名称">
            <n-input v-model:value="treeOption.modalForm.name" type="text" />
          </n-descriptions-item>

          <n-descriptions-item label="排序">
            <n-input
              v-model:value="treeOption.modalForm.sort"
              type="text"
              :allow-input="onlyAllowNumber"
              placeholder="值越小越靠前"
            />
          </n-descriptions-item>

          <n-descriptions-item label="备注">
            <n-input
              v-model:value="treeOption.modalForm.remark"
              type="textarea"
              maxlength="240"
              clearable
              show-count
            />
          </n-descriptions-item>

          <n-descriptions-item label="状态">
            <NSwitch
              v-model:value="treeOption.modalForm.enable"
              size="large"
            >
              <template #checked>
                启用
              </template>
              <template #unchecked>
                禁用
              </template>
            </NSwitch>
          </n-descriptions-item>
        </n-descriptions>

        <template #action>
          <n-flex justify="end">
            <NButton @click.prevent="treeOption.showModal = false">
              取消
            </NButton>
            <NButton type="primary" @click.prevent="saveDictType">
              保存
            </NButton>
          </n-flex>
        </template>
      </n-modal>

      <n-modal
        v-model:show="tableOption.showModal"
        class="custom-card"
        preset="card"
        :title="tableOption.modalTitle"
        size="small"
        close-on-esc
        :mask-closable="false"
        :style="tableOption.bodyStyle"
        :bordered="false"
      >
        <template #action>
          action
        </template>
      </n-modal>
    </n-flex>
  </CommonPage>
</template>

<script setup>
import { NButton, NDataTable, NIcon, NSwitch } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import { withModifiers } from 'vue'
import api from './api.js'
import { onlyAllowNumber } from '@/utils/common.js'
import isPermission from '@/utils/permissionsTool.js'

// 定义组件名称。设置keepAlive需将组件的name设置成当前菜单的code。一定要这样写才可以切换页面时保存当前标签页的状态。
defineOptions({ name: 'DictMgt' })

// 树结构数据
const treeData = ref([])
// 树设置项
const treeOption = ref({
  pattern: '',
  treeLoading: true,
  showModal: false,
  modalTitle: '',
  modalAction: '',
  modalForm: {
    parentId: 1,
    sort: 0,
    enable: true,
  },
  bodyStyle: {
    width: '600px',
  },
})
// 树当前选中节点
const currentNode = ref(null)

// 表格设置项
const tableOption = ref({
  columns:
    [
      { title: '创建时间', key: 'createdTime', width: 120, ellipsis: { tooltip: true } },
      { title: '编码', key: 'code', width: 100, ellipsis: { tooltip: true } },
      { title: '名称', key: 'name', width: 100, ellipsis: { tooltip: true } },
      { title: '排序值', key: 'sort', width: 100, ellipsis: { tooltip: true } },
      {
        title: '启用状态',
        key: 'enable',
        width: 100,
        ellipsis: { tooltip: true },
        render: row =>
          h(
            NSwitch,
            {
              size: 'small',
              rubberBand: false,
              value: row.enable,
              disabled: !isPermission('EditDict'),
              loading: !!row.enableLoading,
              onUpdateValue: () => handleDictDataEnable(row),
            },
            {
              checked: () => '启用',
              unchecked: () => '停用',
            },
          ),
      },
      { title: '备注', key: 'remark', width: 100, ellipsis: { tooltip: true } },
      {
        title: '操作',
        key: 'actions',
        align: 'right',
        fixed: 'right',
        width: 200,
        render(row) {
          return [
            h(
              NButton,
              {
                text: true,
                type: 'primary',
                title: '编辑字典类型',
                size: 'tiny',
                style: 'margin-left: 12px;',
                disabled: !isPermission('EditDict'),
                onClick: withModifiers(() => handleDictDataEdit(row), ['stop']),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                text: true,
                type: 'error',
                size: 'tiny',
                style: 'margin-left: 12px;',
                disabled: !isPermission('DelDict'),
                onClick: withModifiers(() => handleDictDataDelete(row), ['stop']),
              },
              { default: () => '删除' },
            ),
          ]
        },
      },
    ],
  loading: false,
  showModal: false,
  modalTitle: '',
  modalAction: '',
  modalForm: {

  },
  bodyStyle: {
    width: '600px',
  },
})
// 表格数据
const tableData = ref([])

/**
 * 点击添加字典数据按钮触发方法
 * @param row
 */
function handleAddDictData(row) {
  tableOption.value.showModal = true
  tableOption.value.modalForm = row
  tableOption.value.modalAction = 'add'
  tableOption.value.modalTitle = `新增字典数据`
}

/**
 * 点击编辑字典数据按钮触发方法
 * @param row
 */
function handleDictDataEdit(row) {
  tableOption.value.showModal = true
  tableOption.value.modalForm = row
  tableOption.value.modalAction = 'edit'
  tableOption.value.modalTitle = `编辑${row.name}`
}

/**
 * 设置字典数据启用状态方法
 * @param row
 */
async function handleDictDataEnable(row) {
  const res = await api.setStateDictData({ id: row.id, state: !row.enable })
  $message.success(res.message)
  await loadDictData()
}

/**
 * 删除字典数据方法
 * @param row
 */
function handleDictDataDelete(row) {
  const d = $dialog.warning({
    content: '确定删除？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        d.loading = true
        const result = await api.delDictData({ ids: [row.id] })
        if (result.success) {
          $message.success('删除成功')
          await loadDictData()
        }
        else {
          $message.error(result.msg)
        }
        d.loading = false
      }
      catch (error) {
        d.loading = false
        $message.error(error)
      }
    },
  })
}

/**
 * 加载字典数据
 */
async function loadDictData() {
  // 未选中节点不查询
  if (!currentNode.value) {
    return
  }
  // 显示加载层
  tableOption.value.loading = true
  // 请求字典数据
  const res = await api.getDictDataQueryList({ dictTypeId: currentNode?.value?.id || '' })
  // 设置字典数据
  tableData.value = res.result
  // 关闭加载层
  tableOption.value.loading = false
}

// 挂载函数
onMounted(() => {
  initData()
})

/**
 * 获取树数据
 * @returns {Promise<void>}
 */
async function initData() {
  // 显示树加载层
  treeOption.value.treeLoading = true
  // 请求树结构数据
  const res = await api.getDictTypeTree()
  // 转换
  treeData.value = res?.result?.map(item => ({
    ...item,
    key: item.id,
    label: item.name,
    disabled: !item.enable,
    children: item.children,
  })) || []
  // 关闭树加载层
  treeOption.value.treeLoading = false
  // 加载字典数据
  await loadDictData()
}

function treeSelectChange(value, option) {
  treeOption.value.modalForm.parentId = value
}

/**
 * 字典类型添加或编辑保存方法
 */
async function saveDictType() {
  // 关闭模态框
  treeOption.value.showModal = false
  // 刷新数据
  await initData()
}

/**
 * 点击添加字典类型按钮触发方法
 * @param row
 */
function handleAddDictType(row) {
  treeOption.value.showModal = true
  treeOption.value.modalForm = {}
  treeOption.value.modalAction = 'add'
  if (row.name) {
    // 新增下级
    treeOption.value.modalForm.parentId = row.id
    treeOption.value.modalTitle = `${row.name || ''} 新增下级字典类型`
  }
  else {
    treeOption.value.modalTitle = '新增字典类型'
  }
}

/**
 * 点击编辑字典类型按钮触发方法
 * @param row
 */
function handleEditDictType(row) {
  treeOption.value.showModal = true
  treeOption.value.modalForm = row
  treeOption.value.modalAction = 'edit'
  treeOption.value.modalTitle = `编辑${row.name}`
}

/**
 * 设置字典类型启用状态方法
 * @param row
 */
async function handleDictTypeEnable(row) {
  const res = await api.setStateDictType({ id: row.id, state: !row.enable })
  $message.success(res.message)
  await initData()
}

/**
 * 删除字典类型
 * @param row
 */
function handleDictTypeDelete(row) {
  const d = $dialog.warning({
    content: '确定删除？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        d.loading = true
        const result = await api.delDictType({ ids: [row.id] })
        if (result.success) {
          $message.success('删除成功')
          initData()
        }
        else {
          $message.error(result.msg)
        }
        d.loading = false
      }
      catch (error) {
        d.loading = false
        $message.error(error)
      }
    },
  })
}

/**
 * 选中树节点
 * @param keys
 * @param option
 * @param action
 * @param node
 */
function onSelect(keys, option, { action, node }) {
  currentNode.value = node
  // 加载数据
  loadDictData()
}

/**
 * 开关图标
 * @returns {VNode}
 */
function renderSwitcherIcon(treeOption) {
  if (treeOption.option.children && treeOption.option.children.length > 0) {
    return h(NIcon, null, { default: () => h(ChevronForward) })
  }
  else {
    // 不存在下级不展示开关图标
    return h(NIcon, null, { default: () => h() })
  }
}

function renderPrefix({ option }) {
  return h('i', { class: `${option.icon}?mask text-16` })
}

/**
 * 树节点后缀
 * @param option
 * @returns {VNode<RendererNode, RendererElement, {[p: string]: any}>[]}
 */
function renderSuffix({ option }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: '新增下级字典类型',
        size: 'tiny',
        disabled: !isPermission('AddDict'),
        onClick: withModifiers(() => handleAddDictType(option), ['stop']),
      },
      { default: () => '新增' },
    ),
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: '编辑字典类型',
        size: 'tiny',
        style: 'margin-left: 12px;',
        disabled: !isPermission('EditDict'),
        onClick: withModifiers(() => handleEditDictType(option), ['stop']),
      },
      { default: () => '编辑' },
    ),
    h(
      NButton,
      {
        text: true,
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 12px;',
        disabled: !isPermission('DelDict'),
        onClick: withModifiers(() => handleDictTypeDelete(option), ['stop']),
      },
      { default: () => '删除' },
    ),
  ]
}
</script>

<style scoped>

</style>
