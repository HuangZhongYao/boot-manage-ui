<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:49:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-config-provider
    class="wh-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="appStore.isDark ? darkTheme : undefined"
    :theme-overrides="appStore.naiveThemeOverrides"
  >
    <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
      <component :is="Layout">
        <KeepAlive :include="keepAliveNames">
          <component :is="Component" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
        </KeepAlive>
      </component>

      <LayoutSetting v-if="layoutSettingVisible" class="fixed right-12 top-1/2 z-999" />
    </router-view>
  </n-config-provider>
</template>

<script setup>
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { layoutSettingVisible } from './settings'
import { LayoutSetting } from '@/components'
import { useAppStore, useTabStore } from '@/store'

/**
 * 使用Map缓存布局组件，以避免重复加载。
 * @param {string} name - 布局的名称。
 * @returns {Object} - 对应布局的Vue组件。
 */
const layouts = new Map()
function getLayout(name) {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.get(name))
    return layouts.get(name)
  const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
  layouts.set(name, layout)
  return layout
}

const route = useRoute()
const appStore = useAppStore()
/**
 * 根据应用商店中的布局设置，初始化布局。
 */
if (appStore.layout === 'default')
  appStore.setLayout('')
const Layout = computed(() => {
  /**
   * 根据当前路由和应用商店中的布局设置，决定使用的布局组件。
   * 如果当前路由没有匹配的布局，返回null。
   */
  if (!route.matched?.length)
    return null
  return getLayout(route.meta?.layout || appStore.layout)
})

const tabStore = useTabStore()
/**
 * 计算需要进行缓存的标签页名称列表。
 */
const keepAliveNames = computed(() => {
  return tabStore.tabs.filter(item => item.keepAlive).map(item => item.name)
})

/**
 * 监视应用商店中的主题设置，并更新主题颜色。
 */
watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark)
})
</script>
