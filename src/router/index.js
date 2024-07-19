/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:23
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { basicRoutes } from './basic-routes'

/**
 * 创建并配置路由实例。
 * 根据环境变量决定使用哈希历史记录模式还是HTML5的history模式。
 * 公共路径用于构建路由的历史记录对象。
 *
 * @returns {Router} 返回配置后的路由实例。
 */
export const router = createRouter({
  history:
    import.meta.env.VITE_USE_HASH === 'true'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH || '/')
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 在Vue应用中设置和初始化路由。
 * 这包括应用路由实例和设置路由守卫。
 *
 * @param {Object} app - Vue应用实例。
 */
export async function setupRouter(app) {
  app.use(router)
  setupRouterGuards(router)
}
