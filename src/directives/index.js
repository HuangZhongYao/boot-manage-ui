/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:23:01
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { router } from '@/router'

/**
 * 权限指令定义对象
 * 用于在页面上动态控制元素的显示与隐藏，基于用户权限
 */
const permission = {
  /**
   * 指令的挂载阶段钩子
   * @param {Element} el 指令所绑定的元素
   * @param {Object} binding Vue的指令绑定对象
   * @param {Object} binding.value 指令的绑定值，代表需要的权限码
   */
  mounted(el, binding) {
    // 获取当前路由信息
    const currentRoute = unref(router.currentRoute)
    // 从当前路由的元信息中提取按钮权限码列表
    const btns = currentRoute.meta?.btns?.map(item => item.code) || []
    // 检查当前权限码是否在列表中，若不在，则移除元素
    if (!btns.includes(binding.value)) {
      el.remove()
    }
  },
}

/**
 * 在应用中注册自定义指令
 * @param {Object} app Vue应用实例
 */
export function setupDirectives(app) {
  // 注册权限指令
  app.directive('permission', permission)
}
