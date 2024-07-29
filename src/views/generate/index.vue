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
        <n-button :bordered="false" size="large" tertiary ghost type="success" icon-placement="right" secondary strong @click="next">
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
              <MdHappy/>
            </n-icon>
          </template>
          <template #error-icon>
            <n-icon>
              <MdSad/>
            </n-icon>
          </template>
          <n-step
            title="选择表"
            description=""
          />
          <n-step
            title="配置生成规则"
            description=""
          />
          <n-step
            title="字段信息"
            description=""
          />
          <n-step
            title="生成代码中"
            description=""
          >
            <template #icon>
              <n-icon>
                <MdCafe />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="完成"
            description=""
          >
            <template #icon>
              <n-icon>
                <MdCafe />
              </n-icon>
            </template>
          </n-step>
        </n-steps>
      </n-flex>
      <n-card>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeysRef"
          :columns="columns"
          :data="data"
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
import { MdArrowBack, MdArrowForward, MdCafe, MdHappy, MdSad } from '@vicons/ionicons4'
import api from './api.js'

onMounted(() => {
  api.getTables()
})

const currentRef = ref(1)
const currentStatus = ref('finish')
const data = Array.from({ length: 46 }).map((_, index) => ({
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
  key: index,
}))
const checkedRowKeysRef = ref([4, 1])
const columns = [
  {
    title: 'Name',
    key: 'name',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: 'Age',
    key: 'age',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: 'Address',
    key: 'address',
    resizable: true,
    minWidth: 60,
    maxWidth: 600,
  },
  {
    title: '选择',
    type: 'selection',
    multiple: false,
    width: 100,
    fixed: 'right',
    disabled(row) {
      return row.name === 'Edward King 3'
    },
    options: {
      label: 'HXY',
      onSelect(r) {
        console.log(r)
      },
    },
  },
]
</script>

<style scoped>

</style>
