<!--
 @Description: 代码生成api
 @Author: zuuuYao
 @Copyright: © 2024 HuangZhongYao | https://github.com/HuangZhongYao
-->
<template>
  <CommonPage>
    <n-space vertical>
      <n-flex justify="space-between">
        <n-button :bordered="false" size="large" tertiary ghost type="success" secondary strong @click="prev">
          上一步
          <template #icon>
            <n-icon size="30px" :depth="2" color="#0e7a0d">
              <MdArrowBack />
            </n-icon>
          </template>
        </n-button>
        <n-button focusable :bordered="false" size="large" tertiary ghost type="success" icon-placement="right" secondary strong @click="next">
          下一步
          <template #icon>
            <n-icon size="30px" :depth="2" color="#0e7a0d">
              <MdArrowForward />
            </n-icon>
          </template>
        </n-button>
      </n-flex>
      <n-flex style="margin: 40px" justify="center">
        <n-steps :current="currentRef" :status="currentStatus" @update:current="currentRef">
          <template #finish-icon>
            <n-icon>
              <i class="i-fe:check"/>
            </n-icon>
          </template>
          <template #error-icon>
            <n-icon>
              <i class="i-fe:x" />
            </n-icon>
          </template>
          <n-step
            title="选择表"
            description=""
            :status="stepOneStatus"
          >
            <template #icon>
              <n-icon>
                <DatabaseExport />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="配置生成规则"
            description=""
            :status="stepTwoStatus"
          >
            <template #icon>
              <n-icon>
                <CreditCard />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="字段信息"
            description=""
            :status="stepThreeStatus"
          >
            <template #icon>
              <n-icon>
                <FileText />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="生成代码中"
            description=""
            :status="stepFourStatus"
          >
            <template #icon>
              <n-icon>
                <Settings />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="完成"
            description=""
            :status="stepFiveStatus"
          >
            <template #icon>
              <n-icon>
                <i class="i-fe:check-circle" />
              </n-icon>
            </template>
          </n-step>
        </n-steps>
      </n-flex>
      <n-card v-show="currentRef === 1">
        <n-data-table
          v-model:checked-row-keys="checkedRowKeysRef"
          :columns="columns"
          :data="tableData"
          :scroll-x="1200"
          :max-height="350"
          :bordered="false"
          :single-line="false"
          size="small"
        />
      </n-card>
      <n-card v-show="currentRef === 2">
        <n-form
          ref="stepTwoFormRef"
          label-width="140"
          :model="stepTwoFormValue"
          :rules="stepTwoFormRules"
          label-placement="left"
          label-align="right"
          size="large"
        >
          <n-form-item label="所属菜单" path="parentMenuId">
            <QuestionLabel label="" content="生成的页面所属菜单; 在左侧菜单栏中所处位置"/>
            <n-tree-select
              v-model:value="stepTwoFormValue.parentMenuId"
              :options="menuOptions"
              label-field="name"
              key-field="id"
              placeholder="根菜单"
              clearable
            />
          </n-form-item>
          <n-form-item label="表名" path="tableName">
            <QuestionLabel
              label=""
              content="以该表生成前端后端增删改查功能"
            />
            <n-input v-model:value="checkedRowKeysRef[0]" disabled placeholder="请选择表" />
          </n-form-item>
          <n-form-item label="模块名" path="moduleName">
            <QuestionLabel
              label=""
              content="功能模块名称; 列子1 表名sys_user 模块名user, 列子2 表名bus_order 模块名order "
            />
            <n-input v-model:value="stepTwoFormValue.moduleName" placeholder="请输入模块名" />
          </n-form-item>
          <n-form-item label="包名" path="packageName">
            <QuestionLabel
              label=""
              content="源码所属包名; entity、service、controller、repository、mapper所处包"
            />
            <n-input v-model:value="stepTwoFormValue.packageName" default-value="com.github.zuuuyao" placeholder="请输入包名" />
          </n-form-item>
          <n-form-item label="添加到资源管理" path="addResources">
            <QuestionLabel
              label=""
              content="自动添加到资源管理,无需手动到资源管理中添加页面和按钮"
            />
            <n-switch
              v-model:value="stepTwoFormValue.addResources"
              size="large"
              :checked-value="true"
              :unchecked-value="false"
            />
          </n-form-item>
        </n-form>
      </n-card>
      <n-card v-show="currentRef === 3">
        <n-data-table
          :columns="stepThreeColumns"
          :data="stepThreeTableData"
          :scroll-x="1200"
          :max-height="350"
          :bordered="false"
          :single-line="false"
          size="small"
        />
      </n-card>
      <n-flex v-show="currentRef === 4" justify="center" align="center">
        <NButton strong secondary round type="success" @click="generateCode">
          开始生成代码
        </NButton>
      </n-flex>
      <n-card v-show="currentRef === 5">
        <n-descriptions>
          <n-descriptions-item>5</n-descriptions-item>
        </n-descriptions>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeysRef"
          :columns="columns"
          :data="tableData"
          :scroll-x="1200"
          :max-height="350"
          :bordered="false"
          :single-line="false"
          size="small"
        />
      </n-card>
    </n-space>
  </CommonPage>
</template>

<script setup lang="js">
// 从xicons中导入图标
import { MdArrowBack, MdArrowForward } from '@vicons/ionicons4'
import { CreditCard, DatabaseExport, FileText, Settings } from '@vicons/tabler'
import api from './api.js'
import resourceApi from '@/views/pms/resource/api.js'
import QuestionLabel from '@/views/pms/resource/components/QuestionLabel.vue'

// 定义组件名称
defineOptions({ name: 'CodeGenerate' })

// 菜单树数据
const treeData = ref([])

// 组件挂载
onMounted(async () => {
  getTablesData()
  const res = await resourceApi.getMenuTree()
  treeData.value = res?.result || []
})

// steps 当前位置
const currentRef = ref(1)
// 当前步骤状态
const currentStatus = ref('process')

// 步骤状态 默认为等待处理
const stepOneStatus = ref('wait')
const stepTwoStatus = ref('wait')
const stepThreeStatus = ref('wait')
const stepFourStatus = ref('wait')
const stepFiveStatus = ref('wait')

/**
 * 上一步
 */
function prev() {
  // 判断是不是第一步
  if (currentRef.value === 1)
    return

  if (currentRef.value === 2) {
    stepTwoStatus.value = stepTwoStatus.value === 'process' ? 'wait' : stepTwoStatus.value
  }
  if (currentRef.value === 3) {
    stepThreeStatus.value = stepThreeStatus.value === 'process' ? 'wait' : stepThreeStatus.value
  }
  currentRef.value = currentRef.value - 1
}

/**
 * 表名转换为模块名
 * @returns {*}
 * @param tableName 表名
 */
function tableNameToModuleName(tableName) {
  return tableName.replace(/_/g, '')
}
/**
 * 下一步
 */
function next() {
  // 步骤一必选
  if (currentRef.value === 1) {
    // eslint-disable-next-line ts/no-use-before-define
    if (checkedRowKeysRef.value.length === 0) {
      $message.warning('请选择表')
      return
    }
    // 选择表设置模块名称
    // eslint-disable-next-line ts/no-use-before-define
    stepTwoFormValue.value.moduleName = tableNameToModuleName(checkedRowKeysRef.value[0])
  }

  if (currentRef.value === 2) {
    stepTwoStatus.value = stepTwoStatus.value === 'process' ? 'wait' : stepTwoStatus.value
  }
  if (currentRef.value === 3) {
    stepThreeStatus.value = stepThreeStatus.value === 'process' ? 'wait' : stepThreeStatus.value
  }
  // 只能到第四步 生成成功自动跳到第五步
  if (currentRef.value === 4)
    return
  currentRef.value = currentRef.value + 1
}

// 表格列定义
const columns = [
  {
    title: '库名',
    key: 'tableSchema',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '表名',
    key: 'tableName',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '表注释',
    key: 'tableComment',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '存储引擎',
    key: 'engine',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '表排序规则',
    key: 'tableCollation',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '选择',
    type: 'selection',
    key: 'tableCollation',
    multiple: false,
    width: 100,
    fixed: 'right',
    disabled(row) {
      // 基础模板表禁止
      return row.tableName === 'base_template'
    },
  },
]

// 选择表名 表格数据
const tableData = ref([])
// 表选中值
const checkedRowKeysRef = ref([])

/**
 * 获取表数据
 */
function getTablesData() {
  api.getTables().then((res) => {
    if (res.success) {
      const data = res.result.map(item => ({ ...item, key: item.tableName }))
      tableData.value.push(...data)
    }
  })
}

/**
 * 获取表数据
 */
async function getTableColumns(tableName) {
  const res = await api.getTableColumns(tableName)
  if (res.success) {
    stepThreeTableData.value.length = 0
    stepThreeTableData.value.push(...res.result)
  }
}

// 监视步骤变化设置
watch(currentRef, (newValue, oldValue) => {
  switch (newValue) {
    case 1 :
      stepOneStatus.value = 'process'
      break
    case 2 :
      stepTwoStatus.value = 'process'
      break
    case 3 :
      getTableColumns(checkedRowKeysRef.value[0])
      stepThreeStatus.value = 'process'
      break
    case 4 :
      stepFourStatus.value = 'process'
      break
    default :
      break
  }
  // 判断步骤一是否选择表
  stepOneStatus.value = checkedRowKeysRef.value.length > 0 ? 'finish' : stepOneStatus.value = 'error'

  // 判断步骤二状态
  // eslint-disable-next-line ts/no-use-before-define
  stepTwoFormRef.value?.validate((errors) => {
    if (currentRef.value !== 2) {
      stepTwoStatus.value = !errors ? 'finish' : 'error'
    }
  })
}, {})

const menuOptions = computed(() => {
  return [{ name: '根菜单', id: '', children: treeData.value || [] }]
})

// 步骤二 表单对象
const stepTwoFormRef = ref(null)
// 步骤二 表单数据
const stepTwoFormValue = ref({
  packageName: 'com.github.zuuuyao',
  addResources: true,
  moduleName: null,
})
// 步骤二 表单验证规则
const stepTwoFormRules = {
  moduleName: {
    required: true,
    message: '请选择输入模块名',
    trigger: ['input', 'blur'],
  },
  packageName: {
    required: true,
    message: '请输入包名',
    trigger: ['input', 'blur'],
  },
  parentMenuId: {
    required: true,
    message: '请选择所属菜单',
    trigger: ['input', 'change', 'blur'],
  },
}

// 步骤三表格表格数据
const stepThreeTableData = ref([])
// 步骤三表格列定义
const stepThreeColumns = [
  {
    title: '库名',
    key: 'tableSchema',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '表名',
    key: 'tableName',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '列名',
    key: 'columnName',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '字段注释',
    key: 'columnComment',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '字段类型',
    key: 'dataType',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '列主键',
    key: 'columnKey',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
]

/**
 * 提交数据生成代码
 */
async function generateCode() {
  const res = await api.codeGeneration({
    tableName: checkedRowKeysRef.value[0],
    ...stepTwoFormValue.value,
    columns: stepThreeTableData.value,
  })
  if (res) {
    $message.success('生成代码成功')
  }
}
</script>

<style scoped>

</style>
