import { hyphenate } from '@vueuse/core' // 引入转换驼峰命名至短横线命名的工具函数
import { defineStore } from 'pinia' // 引入pinia的store定义函数
import { isExternal } from '@/utils' // 引入判断路径是否为外部链接的工具函数

/**
 * 定义一个名为 'permission' 的 pinia store，用于管理权限相关的数据状态。
 * 包括可访问路由、权限列表和菜单列表。
 */
export const usePermissionStore = defineStore('permission', {
  /**
   * 初始化store的状态对象。
   * @returns {Object} 包含初始状态的对象。
   */
  state: () => ({
    accessRoutes: [], // 存储用户可以访问的路由列表
    permissions: [], // 存储用户的权限列表
    menus: [], // 存储用户的菜单列表
  }),

  /**
   * store的actions，用于处理异步操作和状态更新。
   */
  actions: {

    /**
     * 更新权限和菜单列表。
     * @param {Array} permissions - 用户的权限列表，包含类型为'MENU'的权限项。
     */
    setPermissions(permissions) {
      this.permissions = permissions // 更新权限列表
      // 从权限列表中筛选出类型为'MENU'的权限，并转换为菜单项
      this.menus = permissions
        .filter(item => item.type === 'MENU') // 筛选类型为'MENU'的权限项
        .map(item => this.getMenuItem(item)) // 将权限项转换为菜单项
        .filter(item => !!item) // 过滤掉无效的菜单项
        .sort((a, b) => a.order - b.order) // 按顺序排序菜单项
    },

    /**
     * 根据权限项生成菜单项。
     * @param {Object} item - 权限项，包含权限信息。
     * @param {Object} [parent] - 父菜单项，用于生成子菜单。
     * @returns {Object | null} 返回生成的菜单项或null（如果权限项不可见）。
     */
    getMenuItem(item, parent) {
      const route = this.generateRoute(item, item.show ? null : parent?.key) // 生成路由配置
      if (item.enable && route.path && !route.path.startsWith('http')) {
        this.accessRoutes.push(route) // 如果权限启用且路径有效，添加到可访问路由列表
      }
      if (!item.show) return null // 如果权限项不可见，返回null

      // 构建菜单项的基本信息
      const menuItem = {
        label: route.meta.title, // 菜单标题
        key: route.name, // 菜单键名
        path: route.path, // 路径
        originPath: route.meta.originPath, // 原始路径
        icon: () => h('i', { class: `${route.meta.icon} text-16` }), // 图标渲染函数
        order: item.order ?? 0, // 菜单顺序
      }

      // 如果权限项有子菜单，递归生成子菜单
      const children = item.children?.filter(item => item.type === 'MENU') || []
      if (children.length) {
        menuItem.children = children
          .map(child => this.getMenuItem(child, menuItem)) // 递归生成子菜单项
          .filter(item => !!item) // 过滤掉无效的子菜单项
          .sort((a, b) => a.order - b.order) // 按顺序排序子菜单项
        if (!menuItem.children.length) delete menuItem.children // 如果没有子菜单，删除children属性
      }
      return menuItem
    },

    /**
     * 根据权限项信息生成路由配置。
     * @param {Object} item - 权限项，包含权限信息。
     * @param {String} [parentKey] - 父菜单的key，用于生成子菜单的路由配置。
     * @returns {Object} 路由配置对象。
     */
    generateRoute(item, parentKey) {
      let originPath
      if (isExternal(item.path)) { // 如果路径是外部链接
        originPath = item.path // 记录原始路径
        item.component = '/src/views/iframe/index.vue' // 设置组件为iframe页面
        item.path = `/iframe/${hyphenate(item.code)}` // 转换路径格式
      }
      return {
        name: item.code, // 路由名称
        path: item.path, // 路径
        redirect: item.redirect, // 重定向路径
        component: item.component, // 组件路径
        meta: {
          originPath, // 原始路径
          icon: `${item.icon}?mask`, // 图标
          title: item.name, // 标题
          layout: item.layout, // 布局
          keepAlive: !!item.keepAlive, // 是否缓存
          parentKey, // 父菜单key
          btns: item.children
            ?.filter(item => item.type === 'BUTTON') // 筛选类型为'BUTTON'的权限项
            .map(item => ({ code: item.code, name: item.name })), // 构建按钮信息
        },
      }
    },

    /**
     * 重置权限相关信息。
     */
    resetPermission() {
      this.$reset() // 使用pinia提供的方法重置store状态
    },
  },
})
