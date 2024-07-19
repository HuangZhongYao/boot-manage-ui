/**********************************
 * @Description: 项目入口文件，负责初始化Vue应用。
 * @FilePath: main.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:41:32
 * @Email: zclzone@outlook.com
 * @Copyright: © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

// 导入全局样式重置和主题样式
import '@/styles/reset.css'
import '@/styles/global.scss'
// 导入 Uno CSS 样式库
import 'uno.css'

// 导入Vue和应用组件
import { createApp } from 'vue'
import App from './App.vue'
// 导入并设置路由
import { setupRouter } from './router'
// 导入并设置 Vuex 存储
import { setupStore } from './store'
// 导入并设置离散API
import { setupNaiveDiscreteApi } from './utils'
// 导入并设置自定义指令
import { setupDirectives } from './directives'

/**
 * 应用启动函数，负责初始化和挂载Vue应用。
 * @returns {void}
 */
async function bootstrap() {
  // 创建Vue应用实例
  const app = createApp(App)
  // 设置全局存储
  setupStore(app)
  // 设置全局指令
  setupDirectives(app)
  // 等待路由设置完成
  await setupRouter(app)
  // 将应用实例挂载到指定元素上
  app.mount('#app')
  // 设置离散API
  setupNaiveDiscreteApi()
}

// 启动应用
bootstrap()
