<!--------------------------------
-  车辆表管理
 - Desc   Created by Velocity Generate.
 - Time   2024-07-31 20:23:37
 - Author zuuuYao (https://github.com/HuangZhongYao)
 - Copyright © 2024 ZuuuuYao By Github
 --------------------------------->
<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddBusTruck'" size="small" type="primary" @click="handelAdd">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建车辆
      </NButton>
    </template>
    <AppCard bordered bg="#fafafc dark:black" class="mb-30 min-h-60 rounded-4">
      <form class="flex justify-between p-16" @submit.prevent="handleSearch()">
        <n-scrollbar x-scrollable>
          <n-space :wrap="isExpanded" :size="[32, 16]" class="p-10">
            <slot />
            <MeQueryItem label="关键词" :label-width="50">
              <n-input
                v-model:value="queryItems.keywords"
                type="text"
                placeholder="请输入关键词查询"
                clearable
                style="min-width: 70%"
                autosize
              />
            </MeQueryItem>
          </n-space>
        </n-scrollbar>

        <div class="flex-shrink-0 p-10">
          <NButton ghost type="primary" @click="handleReset">
            <i class="i-fe:rotate-ccw mr-4" />
            重置
          </NButton>
          <NButton attr-type="submit" class="ml-20" type="primary">
            <i class="i-fe:search mr-4" />
            搜索
          </NButton>

          <NButton v-if="!isExpanded" type="primary" text @click="toggleExpand">
            <i class="i-fe:chevrons-down ml-4" />
            展开
          </NButton>
          <NButton v-else text type="primary" @click="toggleExpand">
            <i class="i-fe:chevrons-up ml-4" />
            收起
          </NButton>
        </div>
      </form>
    </AppCard>

    <!-- 想让操作栏固定 添加 :scroll-x="1700"  -->
    <NDataTable
      ref="table"
      :remote="true"
      :loading="loading"
      :max-height="600"
      :scroll-x="1700"
      :pagination="pagination"
      :columns="columns"
      :data="tableData"
    />

    <n-drawer v-model:show="drawerShowFlag" resizable :on-after-leave="drawerLeave" width="30%">
      <n-drawer-content :title="getDrawerTitle" closable>
        <n-form
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          size="medium"
          label-placement="left"
        >
          <n-form-item label="品牌" path="brand">
            <n-input v-model:value="formValue.brand" placeholder="请输入品牌" />
          </n-form-item>

          <n-form-item label="发动机编号" path="engineNo">
            <n-input v-model:value="formValue.engineNo" placeholder="请输入发动机编号" />
          </n-form-item>

          <n-form-item label="文档编号" path="fileNo">
            <n-input v-model:value="formValue.fileNo" placeholder="请输入文档编号" />
          </n-form-item>

          <n-form-item label="发证机关" path="issuers">
            <n-input v-model:value="formValue.issuers" placeholder="请输入发证机关" />
          </n-form-item>

          <n-form-item label="型号" path="model">
            <n-input v-model:value="formValue.model" placeholder="请输入型号" />
          </n-form-item>

          <n-form-item label="车辆所有人" path="owner">
            <n-input v-model:value="formValue.owner" placeholder="请输入车辆所有人" />
          </n-form-item>

          <n-form-item label="车牌号" path="plateNo">
            <n-input v-model:value="formValue.plateNo" placeholder="请输入车牌号" />
          </n-form-item>

          <n-form-item label="总质量kg" path="quality">
            <n-input v-model:value="formValue.quality" placeholder="请输入总质量kg" />
          </n-form-item>

          <n-form-item label="注册日期" path="regDate">
            <n-input v-model:value="formValue.regDate" placeholder="请输入注册日期" />
          </n-form-item>

          <n-form-item label="使用性质" path="useCharacter">
            <n-input v-model:value="formValue.useCharacter" placeholder="请输入使用性质" />
          </n-form-item>

          <n-form-item label="车型" path="vehicleType">
            <n-input v-model:value="formValue.vehicleType" placeholder="请输入车型" />
          </n-form-item>

          <n-form-item label="VIN车辆识别代码" path="vin">
            <n-input v-model:value="formValue.vin" placeholder="请输入VIN车辆识别代码" />
          </n-form-item>

        </n-form>
        <template #footer>
          <NButton @click="drawerShowFlag = false">
            取消
          </NButton>
          <NButton type="primary" class="ml-20" @click="handelOnSave">
            保存
          </NButton>
        </template>
      </n-drawer-content>
    </n-drawer>
  </CommonPage>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { NButton, NDataTable } from 'naive-ui'
import api from './api.js'
import { MeQueryItem } from '@/components/index.js'
import isPermission from '@/utils/permissionsTool.js'
// 定义组件名称。设置keepAlive需将组件的name设置成当前菜单的code。一定要这样写才可以切换页面时保存当前标签页的状态。
defineOptions({ name: 'BusTruckMgt' })

// 进入页面时执行
onMounted(() => {
  // 初始化获取数据
  handleQuery()
})

// 表格标题及单元格数据定义
const columns = [
  {
    title: '品牌',
    key: 'brand',
    ellipsis: { tooltip: true },
  },
  {
    title: '发动机编号',
    key: 'engineNo',
    ellipsis: { tooltip: true },
  },
  {
    title: '文档编号',
    key: 'fileNo',
    ellipsis: { tooltip: true },
  },
  {
    title: '发证机关',
    key: 'issuers',
    ellipsis: { tooltip: true },
  },
  {
    title: '型号',
    key: 'model',
    ellipsis: { tooltip: true },
  },
  {
    title: '车辆所有人',
    key: 'owner',
    ellipsis: { tooltip: true },
  },
  {
    title: '车牌号',
    key: 'plateNo',
    ellipsis: { tooltip: true },
  },
  {
    title: '总质量kg',
    key: 'quality',
    ellipsis: { tooltip: true },
  },
  {
    title: '注册日期',
    key: 'regDate',
    ellipsis: { tooltip: true },
  },
  {
    title: '使用性质',
    key: 'useCharacter',
    ellipsis: { tooltip: true },
  },
  {
    title: '车型',
    key: 'vehicleType',
    ellipsis: { tooltip: true },
  },
  {
    title: 'VIN车辆识别代码',
    key: 'vin',
    ellipsis: { tooltip: true },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: !isPermission('EditBusTruck'),
            onClick: () => handelEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-me:edit text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'tiny',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: !isPermission('DelBusTruck'),
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

// 表格对象
const table = ref(null)
// 查询参数
const queryItems = ref({})
// 定义一个变量控制是否显示加载层
const loading = ref(false)
// 表格数据
const tableData = ref([])
// 表格分页对象
const pagination = reactive({
  page: 1,
  pageSize: 10,
  pageSizes: [5, 10, 20, 30, 40, 50, 100],
  showSizePicker: true,
  showQuickJumper: true,
  displayOrder: ['pages', 'quick-jumper', 'size-picker'],
  prefix({ itemCount }) {
    return `共${itemCount} 条数据`
  },
  onChange: (page) => {
    pagination.page = page
    handleQuery()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    handleQuery()
  },
})

// 定义一个变量控制查询参数是否展开
const isExpanded = ref(false)

// 反转变量控制查询参数是否展开
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

/**
 * 重置查询方法
 * @returns {Promise<void>}
 */
async function handleReset() {
  for (const key in queryItems.value) {
    if (Object.prototype.hasOwnProperty.call(queryItems.value, key)) {
      queryItems.value[key] = null
    }
  }
  await nextTick()
  pagination.page = 1
  handleQuery()
}

/**
 * 搜索查询方法
 * @param keepCurrentPage
 */
function handleSearch(keepCurrentPage = false) {
  if (keepCurrentPage) {
    handleQuery()
  }
  else {
    onPageChange(1)
  }
}

/**
 * 执行API查询方法
 * @returns {Promise<void>}
 */
async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}

    paginationParams = { pageNo: pagination.page, pageSize: pagination.pageSize }
    const res = await api.read({
      ...queryItems.value,
      ...paginationParams,
    })
    // 判断使用后端分页还是前端分页
    tableData.value = res.result?.records || res.result
    pagination.itemCount = res.result.total ?? res.result.length
    if (pagination.itemCount && !tableData.value.length && pagination.page > 1) {
      // 如果当前页数据为空，且总条数不为0，则返回上一页数据
      onPageChange(pagination.page - 1)
    }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  }
  finally {
    loading.value = false
  }
}

/**
 * 手动修改页码变更
 * @param currentPage
 */
function onPageChange(currentPage) {
  pagination.page = currentPage
  handleQuery()
}

// 定义一个变量控制新增|编辑抽屉显示
const drawerShowFlag = ref(false)
// 抽屉标题
const getDrawerTitle = ref()
// 抽屉保存类型
let drawerSaveType
// 抽屉表单
const formRef = ref(null)
// 表单值
const formValue = ref({})
// 表单验证规则
const rules = {
  brand: {
    required: false,
    message: '请输入品牌',
    trigger: ['input', 'blur'],
  },
  engineNo: {
    required: false,
    message: '请输入发动机编号',
    trigger: ['input', 'blur'],
  },
  fileNo: {
    required: false,
    message: '请输入文档编号',
    trigger: ['input', 'blur'],
  },
  issuers: {
    required: false,
    message: '请输入发证机关',
    trigger: ['input', 'blur'],
  },
  model: {
    required: false,
    message: '请输入型号',
    trigger: ['input', 'blur'],
  },
  owner: {
    required: false,
    message: '请输入车辆所有人',
    trigger: ['input', 'blur'],
  },
  plateNo: {
    required: false,
    message: '请输入车牌号',
    trigger: ['input', 'blur'],
  },
  quality: {
    required: false,
    message: '请输入总质量kg',
    trigger: ['input', 'blur'],
  },
  regDate: {
    required: false,
    message: '请输入注册日期',
    trigger: ['input', 'blur'],
  },
  useCharacter: {
    required: false,
    message: '请输入使用性质',
    trigger: ['input', 'blur'],
  },
  vehicleType: {
    required: false,
    message: '请输入车型',
    trigger: ['input', 'blur'],
  },
  vin: {
    required: false,
    message: '请输入VIN车辆识别代码',
    trigger: ['input', 'blur'],
  },
}

/**
 * 抽屉关闭回调
 */
function drawerLeave() {
  if (drawerSaveType === 'edit') {
    formValue.value = {}
  }
}

/**
 * 添加数据方法
 */
function handelAdd() {
  // 显示抽屉
  drawerShowFlag.value = true
  // 设置抽屉标题
  getDrawerTitle.value = '创建车辆'
  // 设置抽屉操作类型
  drawerSaveType = 'add'
}

/**
 * 编辑数据方法
 * @param row 原数据
 */
function handelEdit(row) {
  // 显示抽屉
  drawerShowFlag.value = true
  // 设置抽屉标题
  getDrawerTitle.value = '编辑车辆'
  // 设置抽屉操作类型
  drawerSaveType = 'edit'
  // 设置编辑数据回显值
  formValue.value = { ...row }
}

/**
 * 数据保存方法
 * @param saveType 操作类型 edit 编辑、add 新增
 * @param row 表格中行数据
 */
function handelOnSave() {
  // 验证表单
  formRef.value?.validate(async (errors) => {
    // 验证通过再发起请求
    if (!errors) {
      // 请求响应值
      let res

      // 创建
      if (drawerSaveType === 'add') {
        // 执行创建请求
        res = await api.create(formValue.value)
      }
      else {
        // 编辑
        // 执行编辑请求
        res = await api.update(formValue.value)
      }

      // 判断调用结果
      if (res.result) {
        $message.success(res.message)
      }
      // 刷新数据
      await handleQuery()
      // 关闭抽屉
      drawerShowFlag.value = false
      // 清空表单数据
      formValue.value = {}
    }
  })
}

/**
 * 删除数据方法
 * @param data 删除的数据id集合。 示列 {ids: [ 1 , 2 ,3]}
 */
function handleDelete(data) {
  if (!data)
    return
  const d = $dialog.warning({
    content: '确定删除？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        d.loading = true
        const res = await api.delete(data)
        if (res.result) {
          $message.success('删除成功')
          // 刷新数据
          handleQuery()
        }
        else {
          $message.error(`删除失败 ${res.message}`)
        }
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
      }
      finally {
        d.loading = false
      }
    },
  })
}
</script>

<style scoped>

</style>
