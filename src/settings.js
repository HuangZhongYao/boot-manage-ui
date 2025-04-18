/**
 * 项目名
 * @type {string}
 */
export const projectName = 'boot-admin'

/**
 * 默认的布局样式。 empty|full|normal|simple
 * @constant defaultLayout
 * @type {string}
 * @default 'normal'
 */
export const defaultLayout = 'normal'

/**
 * 默认的主题颜色。
 * @constant defaultPrimaryColor
 * @type {string}
 * @default '#316C72'
 */
export const defaultPrimaryColor = '#316C72'

/**
 * 控制布局设置组件的可见性。
 * @constant layoutSettingVisible
 * @type {boolean}
 * @default true
 */
// 控制 LayoutSetting 组件是否可见
export const layoutSettingVisible = true

/**
 * 提供Naive UI主题的自定义覆盖配置。
 * @constant naiveThemeOverrides
 * @type {object}
 */
export const naiveThemeOverrides = {
  common: {
    primaryColor: '#316C72FF',
    primaryColorHover: '#316C72E3',
    primaryColorPressed: '#2B4C59FF',
    primaryColorSuppl: '#316C72E3',
  },
}

/**
 * 定义基础权限列表。
 * 每个权限项包含代码、名称、类型、图标等信息，以及子权限列表。
 * @constant basePermissions
 * @type {array}
 */
export const basePermissions = [
  {
    code: 'ExternalLink',
    name: '外链(可内嵌打开)',
    type: 'MENU',
    icon: 'i-fe:external-link',
    order: 98,
    enable: true,
    show: true,
    children: [
      {
        code: 'ShowDocs',
        name: '项目文档',
        type: 'MENU',
        path: '#',
        icon: 'i-me:docs',
        order: 1,
        enable: true,
        show: true,
      },
      {
        code: 'ApiFoxDocs',
        name: '接口文档',
        type: 'MENU',
        path: 'https://apifox.com/apidoc/shared/328df828-c5b1-44b0-abfb-357ef8276d29',
        icon: 'i-me:apifox',
        order: 2,
        enable: true,
        show: true,
      },
      {
        code: 'NaiveUI',
        name: 'Naive UI',
        type: 'MENU',
        path: 'https://www.naiveui.com/zh-CN/os-theme',
        icon: 'i-me:naiveui',
        order: 3,
        enable: true,
        show: true,
      },
      {
        code: 'MyBlog',
        name: '博客-掘金',
        type: 'MENU',
        path: 'https://juejin.cn/user/1961184475483255/posts',
        icon: 'i-simple-icons:juejin',
        order: 4,
        enable: true,
        show: true,
      },
    ],
  },
]
