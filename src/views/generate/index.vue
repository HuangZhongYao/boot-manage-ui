<!--
 @Description: 代码生成api
 @Author: zuuuYao
 @Copyright: © 2024 HuangZhongYao | https://github.com/HuangZhongYao
-->
<template>
  <CommonPage>
    <n-space vertical>
      <n-flex justify="space-between">
        <n-button :bordered="false" :disabled="completeFlag" size="large" tertiary ghost type="success" secondary strong @click="prev">
          上一步
          <template #icon>
            <n-icon size="30px" :depth="2" color="#0e7a0d">
              <MdArrowBack />
            </n-icon>
          </template>
        </n-button>
        <n-button focusable :bordered="false" :disabled="completeFlag" size="large" tertiary ghost type="success" icon-placement="right" secondary strong @click="next">
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
              <i class="i-fe:check" />
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
            :title="loadFlag ? `生成代码中` : `生成代码`"
            description=""
            :status="stepFourStatus"
          >
            <template #icon>
              <n-icon>
                <Code />
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
            <QuestionLabel label="" content="生成的页面所属菜单; 在左侧菜单栏中所处位置" />
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
            <NInput v-model:value="checkedRowKeysRef[0]" disabled placeholder="请选择表" />
          </n-form-item>
          <n-form-item label="表注释" path="tableComment">
            <QuestionLabel
              label=""
              content="表注释以功能+'表'，如:用户表、订单表、角色表、评论表"
            />
            <NInput v-model:value="stepTwoFormValue.tableComment" placeholder="请输入表注释" />
          </n-form-item>
          <n-form-item label="模块名" path="moduleName">
            <QuestionLabel
              label=""
              content="功能模块名称; 列子1 表名sys_user 模块名user, 列子2 表名bus_order 模块名order "
            />
            <NInput v-model:value="stepTwoFormValue.moduleName" placeholder="请输入模块名" />
          </n-form-item>
          <n-form-item label="包名" path="packageName">
            <QuestionLabel
              label=""
              content="源码所属包名; entity、service、controller、repository、mapper所处包"
            />
            <NInput v-model:value="stepTwoFormValue.packageName" default-value="com.github.zuuuyao" placeholder="请输入包名" />
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
        <n-spin v-show="loadFlag" :show="true" />
        <NButton v-show="!loadFlag" strong secondary round type="success" @click="generateCode">
          开始生成代码
        </NButton>
      </n-flex>
      <n-flex v-show="currentRef === 5" vertical justify="center" align="center">
        <n-icon size="300" :depth="1" color="#0e7a0d">
          <IosCheckmark />
        </n-icon>
        <NButton tertiary round type="success" @click="reset">
          再生成一个
        </NButton>
      </n-flex>
    </n-space>
  </CommonPage>
</template>

<script setup lang="js">
import { NInput } from 'naive-ui'
// 从xicons中导入图标
import { IosCheckmark, MdArrowBack, MdArrowForward } from '@vicons/ionicons4'
import { Code, CreditCard, DatabaseExport, FileText } from '@vicons/tabler'
import api from './api.js'
import resourceApi from '@/views/pms/resource/api.js'
import QuestionLabel from '@/views/pms/resource/components/QuestionLabel.vue'

// 定义组件名称。设置keepAlive需将组件的name设置成当前菜单的code。一定要这样写才可以切换页面时保存当前标签页的状态。
defineOptions({ name: 'CodeGenerate' })

// 菜单树数据
const treeData = ref([])
const menuOptions = computed(() => {
  return [{ name: '根菜单', id: '', children: treeData.value || [] }]
})
// 组件挂载
onMounted(async () => {
  getTablesData()
  const res = await resourceApi.getMenuTree()
  treeData.value = (res?.result || []).filter(item => item.type !== 'BUTTON')
})

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

// 步骤二 表单对象
const stepTwoFormRef = ref(null)
// 步骤二 表单数据
const stepTwoFormValue = ref({
  packageName: 'org.github.zuuuyao',
  addResources: true,
  moduleName: null,
  parentMenuId: null,
  tableComment: null,
})
// 步骤二 表单验证规则
const stepTwoFormRules = {
  moduleName: {
    required: true,
    message: '请选择输入模块名',
    trigger: ['input', 'blur'],
  },
  tableComment: {
    required: true,
    message: '请选择输入表注释',
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
    trigger: ['input', 'blur', 'change'],
    validator(rule, value) {
      // 如果选择根菜单
      if (value === '') {
        return true
      }
      if (value) {
        return true
      }
      else {
        return new Error('请选择所属菜单')
      }
    },
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
    render(row) {
      return h(NInput, {
        value: row.columnComment,
        onUpdateValue: v => row.columnComment = v,
      })
    },
  },
  {
    title: '字段类型',
    key: 'dataType',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
    render(row) {
      return h(NInput, {
        value: row.dataType,
        onUpdateValue: v => row.dataType = v,
      })
    },
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
 * 步骤三获取表字段数据
 */
async function getTableColumns(tableName) {
  const res = await api.getTableColumns(tableName)
  if (res.success) {
    stepThreeTableData.value.length = 0
    stepThreeTableData.value.push(...res.result)
  }
}

// steps 当前位置
const currentRef = ref(1)
// 当前步骤状态
const currentStatus = ref('process')
// 整个代码生成完成状态
const completeFlag = ref(false)
// 生成代码加载层
const loadFlag = ref(false)
// 步骤状态 默认为等待处理
const stepOneStatus = ref('process')
const stepTwoStatus = ref('wait')
const stepThreeStatus = ref('wait')
const stepFourStatus = ref('wait')
const stepFiveStatus = ref('wait')

/**
 * 表名转换为模块名
 * @returns {*}
 * @param tableName 表名
 */
function tableNameToModuleName(tableName) {
  return tableName.replace(/_/g, '')
}

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
  if (currentRef.value === 4) {
    stepFourStatus.value = stepFourStatus.value === 'process' ? 'wait' : stepFourStatus.value
  }
  currentRef.value = currentRef.value - 1
}

/**
 * 下一步
 */
function next() {
  // 步骤一必选
  if (currentRef.value === 1) {
    if (checkedRowKeysRef.value.length === 0) {
      $message.warning('请选择表')
      return
    }
    // 选择表设置模块名称
    stepTwoFormValue.value.moduleName = tableNameToModuleName(checkedRowKeysRef.value[0])
    // 表注释
    stepTwoFormValue.value.tableComment = tableData.value.find(item => item.tableName === checkedRowKeysRef.value[0]).tableComment
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

// 监视步骤变化设置 更新步骤状态
watch(currentRef, (newValue) => {
  switch (newValue) {
    case 1 :
      stepOneStatus.value = 'process'
      break
    case 2 :
      stepTwoStatus.value = 'process'
      break
    case 3 :
      // 查询表字段信息
      getTableColumns(checkedRowKeysRef.value[0])
      stepThreeStatus.value = 'process'
      break
    case 4 :
      stepFourStatus.value = 'process'
      break
    default :
      break
  }
  // 判断步骤一状态
  if (currentRef.value !== 1) {
    stepOneStatus.value = checkedRowKeysRef.value.length > 0 ? 'finish' : stepOneStatus.value = 'error'
  }

  // 判断步骤二状态
  stepTwoFormRef.value?.validate((errors) => {
    if (currentRef.value !== 2) {
      stepTwoStatus.value = !errors ? 'finish' : 'error'
    }
  })

  // 判断步骤三状态
  if (currentRef.value !== 3) {
    stepThreeStatus.value = stepThreeStatus.value.length > 0 ? 'finish' : 'error'
  }
  if (currentRef.value !== 4) {
    stepFourStatus.value = completeFlag.value ? 'finish' : stepFourStatus.value
  }
}, {})

/**
 * 提交数据生成代码
 */
async function generateCode() {
  // 验证各步骤状态都完成才能生成
  if (stepOneStatus.value !== 'finish') {
    $message.error('步骤一: 选择表未完成')
    return
  }
  if (stepTwoStatus.value !== 'finish') {
    $message.error('步骤二: 配置生成规则未完成')
    return
  }
  if (stepThreeStatus.value !== 'finish') {
    $message.error('步骤三: 字段信息未填写完整')
    return
  }
  // 显示加载层
  loadFlag.value = true
  // 执行生成代码请求
  const res = await api.codeGeneration({
    tableName: checkedRowKeysRef.value[0],
    ...stepTwoFormValue.value,
    columns: stepThreeTableData.value,
  }).catch((error) => {
    // 生成错误处理逻辑
  })
  // 等待2秒
  await sleep(2000)

  // 判断是否执行成功
  if (res) {
    $message.success('生成代码成功')
    // 设置状态为完成
    completeFlag.value = true
    // 跳转到步骤五
    currentRef.value = 5
    stepFourStatus.value = 'finish'
    stepFiveStatus.value = 'finish'

    // 创建一个对象URL，用于指向下载的文件
    const url = window.URL.createObjectURL(res)
    // 创建一个链接元素，用于触发文件下载
    const link = document.createElement('a')
    // 设置链接的URL为之前创建的对象URL，确保链接指向要下载的文件
    link.href = url
    // 设置链接的下载属性，指定下载文件的名称 -->
    link.setAttribute('download', `${stepTwoFormValue.value.moduleName}_code.zip`)
    // 将链接元素添加到文档中，这是为了确保链接可以被点击触发下载
    document.body.appendChild(link)
    // 触发链接点击从而开始文件下载
    link.click()
  }

  // 关闭加载层
  loadFlag.value = false
}

/**
 * 重置方法
 */
function reset() {
  // steps 当前位置
  currentRef.value = 1
  // 当前步骤状态
  currentStatus.value = 'process'
  // 整个代码生成完成状态
  completeFlag.value = false
  // 生成代码加载层
  loadFlag.value = false
  // 步骤状态 默认为等待处理
  stepOneStatus.value = 'process'
  stepTwoStatus.value = 'wait'
  stepThreeStatus.value = 'wait'
  stepFourStatus.value = 'wait'
  stepFiveStatus.value = 'wait'
  // 重置步骤一选中状态
  checkedRowKeysRef.value = []
  // 重置步骤二数据
  stepTwoFormValue.value = {
    packageName: 'org.github.zuuuyao',
    addResources: true,
    moduleName: null,
    parentMenuId: null,
    tableComment: null,
  }
  // 重置步骤三数据
  stepThreeTableData.value = []
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped>

</style>
