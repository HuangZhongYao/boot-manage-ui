/**
 * UNO CSS 配置文件
 *
 * 本文件用于配置 UnoCSS，一个基于 Rust 的极简 CSS 预设生成器，旨在为 VuePress 等项目提供快速、高效的 CSS 支持。
 * 它通过预设和自定义规则，简化了 CSS 类的编写，同时通过图标集和自定义样式提升了项目的视觉一致性和开发效率。
 */

// 导入 UnoCSS 配置相关模块
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
// 导入将 rem 转换为 px 的预设
import presetRemToPx from '@unocss/preset-rem-to-px'
// 导入文件系统图标加载器，用于加载自定义图标集
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
// 导入获取图标列表的函数
import { getIcons } from './build'

// 从外部文件获取图标列表
const icons = getIcons()

// 定义 UnoCSS 配置对象
export default defineConfig({
  // 使用的预设列表
  presets: [
    // 预设 Uno，提供基本样式支持
    presetUno(),
    // 预设 Attributify，提供通过属性选择器触发样式的功能
    presetAttributify(),
    // 预设 Icons，提供图标支持
    presetIcons({
      // 开启警告，帮助调试
      warn: true,
      // 定义图标前缀
      prefix: ['i-'],
      // 添加额外的 CSS 属性，如 display: inline-block，使图标正确显示
      extraProperties: {
        display: 'inline-block',
        width: '1em',
        height: '1em',
      },
      // 定义自定义图标集合，使用 FileSystemIconLoader 加载本地图标文件
      collections: {
        me: FileSystemIconLoader('./src/assets/icons/isme'),
        fe: FileSystemIconLoader('./src/assets/icons/feather'),
      },
    }),
    // 预设 RemToPx，将 rem 单位转换为 px，确保在不同设备上的一致显示
    presetRemToPx({ baseFontSize: 4 }),
  ],
  // 白名单列表，防止某些样式被优化掉
  safelist: icons.map(icon => `${icon} ${icon}?mask`.split(' ')).flat(),
  // 简写规则，方便快速编写常见的样式组合
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['f-c-c', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['card-border', 'border border-solid border-light_border dark:border-dark_border'],
    ['auto-bg', 'bg-white dark:bg-dark'],
    ['auto-bg-hover', 'hover:bg-#eaf0f1 hover:dark:bg-#1b2429'],
    ['auto-bg-highlight', 'bg-#eaf0f1 dark:bg-#1b2429'],
    ['text-highlight', 'rounded-4 px-8 py-2 auto-bg-highlight'],
  ],
  // 自定义规则，针对特定样式定义盒模型属性
  rules: [
    [
      'card-shadow',
      { 'box-shadow': '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017' },
    ],
  ],
  // 主题配置，定义一些常用的颜色变量
  theme: {
    colors: {
      primary: 'rgba(var(--primary-color))',
      dark: '#18181c',
      light_border: '#efeff5',
      dark_border: '#2d2d30',
    },
  },
})
