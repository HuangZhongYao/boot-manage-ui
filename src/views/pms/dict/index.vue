<!--------------------------------
 - Author    ZhongYao.Huang (https://github.com/HuangZhongYao)
 - Time      2024-08-17 22:48
 - Copyright © 2024 ZuuuuYao By Github
 --------------------------------->
<template>
  <CommonPage>
    <n-flex justify="space-between">
      <n-flex vertical >
        <h3>字典类型</h3>
        <div class="flex">
          <n-input v-model:value="treeOption.pattern" placeholder="搜索" clearable />
          <NButton class="ml-12" type="primary" ghost quaternary @click="initData">
            <i class="i-fe:rotate-ccw mr-4 text-14" />
          </NButton>
          <NButton class="ml-12" type="primary" @click="handleAdd()">
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
      <n-flex vertical class="flex-1" style="flex-grow: 2">
        <h3 class="mb-12">
          {{ currentNode?.name }}
        </h3>
        <NDataTable
          :remote="true"
          :columns="tableOption.columns"
          :loading="tableOption.loading"
          :data="tableData"
          :pagination="false"
          :max-height="900"
        />
      </n-flex>
    </n-flex>
  </CommonPage>
</template>

<script setup>
import {NButton, NDataTable, NIcon, NSwitch} from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import { withModifiers } from 'vue'
import api from './api.js'
import isPermission from '@/utils/permissionsTool.js'

// 定义组件名称。设置keepAlive需将组件的name设置成当前菜单的code。一定要这样写才可以切换页面时保存当前标签页的状态。
defineOptions({ name: 'DictMgt' })

// 树结构数据
const treeData = ref([])
// 树设置项
const treeOption = ref({
  pattern: '',
  treeLoading: true,
})
// 树当前选中节点
const currentNode = ref(null)

// 表格设置项
const tableOption = ref({
  columns:
    [
      { title: '名称', key: 'name', width: 100, ellipsis: { tooltip: true } },
      { title: '编码', key: 'code', width: 100, ellipsis: { tooltip: true } },
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
              disabled: false,
              loading: !!row.enableLoading,
              onUpdateValue: () => handleEnable(row),
            },
            {
              checked: () => '启用',
              unchecked: () => '停用',
            },
          ),
      },
      { title: '备注', key: 'remark', width: 100, ellipsis: { tooltip: true } },
    ],
  loading: false,
})
// 表格数据
const tableData = ref([])

/**
 * 加载字典数据
 */
async function loadDictData() {
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
        disabled: !isPermission('AddResources'),
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
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
        disabled: !isPermission('AddResources'),
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
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
        disabled: !isPermission('DelResources'),
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => '删除' },
    ),
  ]
}
</script>

<style scoped>

</style>
