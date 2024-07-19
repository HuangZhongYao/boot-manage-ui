/**
 * 配置Vite开发环境。
 *
 * 本文件使用Vite的defineConfig函数定义项目配置。配置根据环境模式（mode）动态加载环境变量，
 * 并设置项目的基础路径、插件、解析别名等关键配置。
 *
 * @param {object} context - 包含当前环境模式的上下文对象。
 * @returns {object} - 返回Vite项目配置对象。
 */
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import removeNoMatch from 'vite-plugin-router-warn'
import { pluginIcons, pluginPagePathes } from './build/plugin-isme'

export default defineConfig(({ mode }) => {
  // 加载环境变量，根据当前模式加载对应的.env文件。
  const viteEnv = loadEnv(mode, process.cwd())
  // 从环境变量中提取公共路径和代理目标。
  const { VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = viteEnv

  return {
    // 设置项目的基础路径。
    base: VITE_PUBLIC_PATH || '/',
    // 定义使用的插件列表。
    plugins: [
      // 启用Vue支持。
      Vue(),
      // 启用Vue DevTools插件，用于前端开发时的调试。
      VueDevTools(),
      // 启用UnoCSS，一个强大的CSS框架按需加载插件。
      Unocss(),
      // 自动导入指定的Vue组件和指令。
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: false,
      }),
      // 自动注册Vue组件，使用Naive UI组件库作为解析器。
      Components({
        resolvers: [NaiveUiResolver()],
        dts: false,
      }),
      // 自定义插件，用于生成页面路径并添加到虚拟模块。
      pluginPagePathes(),
      // 自定义插件，用于处理图标并添加到虚拟模块。
      pluginIcons(),
      // 移除不必要的Vue Router动态路由警告。
      removeNoMatch(),
    ],
    // 设置模块解析的别名，方便导入文件。
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '~': path.resolve(process.cwd()),
      },
    },
    // 配置开发服务器参数。
    server: {
      // 监听所有网络接口。
      host: '0.0.0.0',
      // 设置服务器端口。
      port: 3200,
      // 开发服务器启动时是否自动打开浏览器。
      open: false,
      // 配置代理，将/api路径的请求代理到指定服务器。
      proxy: {
        '/api': {
          target: VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          secure: false,
          configure: (proxy, options) => {
            // 在代理响应中添加原始URL信息。
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target)?.href || ''
            })
          },
        },
      },
    },
    // 配置构建参数。
    build: {
      // 设置分块大小警告限制。
      chunkSizeWarningLimit: 1024,
    },
  }
})
