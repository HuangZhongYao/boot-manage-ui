/**
 * 导入Naive UI库的所有组件
 */
import * as NaiveUI from 'naive-ui'
/**
 * 导入用于检查值是否为null或undefined的工具函数
 */
import { isNullOrUndef } from '@/utils'
/**
 * 导入应用的全局状态管理店
 */
import { useAppStore } from '@/store'

/**
 * 设置消息提示的管理类
 * @param {Object} NMessage - Naive UI的消息提示实例
 * @returns {Message} - 消息提示管理类的实例
 */
export function setupMessage(NMessage) {
  /**
   * 消息提示管理类
   */
  class Message {
    /**
     * 实例存储
     */
    static instance
    /**
     * 构造函数，实现单例模式
     */
    constructor() {
      // 如果已存在实例，则直接返回，避免重复创建
      if (Message.instance) return Message.instance
      // 设置当前实例为新的实例
      Message.instance = this
      // 初始化消息存储和移除定时器
      this.message = {}
      this.removeTimer = {}
    }

    /**
     * 根据key移除消息提示，并设置定时器在指定延迟后执行
     * @param {string} key - 消息提示的唯一标识
     * @param {number} duration - 移除消息提示前的延迟时间，默认为5000毫秒
     */
    removeMessage(key, duration = 5000) {
      // 清除已存在的定时器
      this.removeTimer[key] && clearTimeout(this.removeTimer[key])
      // 设置新的定时器，在指定延迟后移除消息提示
      this.removeTimer[key] = setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    /**
     * 立即移除消息提示
     * @param {string} key - 消息提示的唯一标识
     * @param {number} duration - 移除消息提示前的延迟时间，默认为200毫秒
     */
    destroy(key, duration = 200) {
      setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    /**
     * 显示消息提示
     * @param {string} type - 消息提示的类型
     * @param {string|Array} content - 消息提示的内容
     * @param {Object} option - 消息提示的配置选项
     */
    showMessage(type, content, option = {}) {
      // 如果内容是数组，则对每个内容分别提示
      if (Array.isArray(content)) {
        return content.forEach(msg => NMessage[type](msg, option))
      }
      // 如果没有配置key，则直接显示消息提示
      if (!option.key) {
        return NMessage[type](content, option)
      }
      // 如果已存在相同key的消息提示，则更新其内容和类型
      const currentMessage = this.message[option.key]
      if (currentMessage) {
        currentMessage.type = type
        currentMessage.content = content
      }
      // 如果不存在相同key的消息提示，则创建新的消息提示，并设置在离开后自动销毁
      else {
        this.message[option.key] = NMessage[type](content, {
          ...option,
          duration: 0,
          onAfterLeave: () => {
            delete this.message[option.key]
          },
        })
      }
      // 设置移除消息提示的定时器
      this.removeMessage(option.key, option.duration)
    }

    /**
     * 显示加载中的消息提示
     * @param {string} content - 消息提示的内容
     * @param {Object} option - 消息提示的配置选项
     */
    loading(content, option) {
      this.showMessage('loading', content, option)
    }

    /**
     * 显示成功的消息提示
     * @param {string} content - 消息提示的内容
     * @param {Object} option - 消息提示的配置选项
     */
    success(content, option) {
      this.showMessage('success', content, option)
    }

    /**
     * 显示错误的消息提示
     * @param {string} content - 消息提示的内容
     * @param {Object} option - 消息提示的配置选项
     */
    error(content, option) {
      this.showMessage('error', content, option)
    }

    /**
     * 显示信息的消息提示
     * @param {string} content - 消息提示的内容
     * @param {object} option - 消息提示的配置选项
     */
    info(content, option) {
      this.showMessage('info', content, option)
    }

    /**
     * 显示警告的消息提示
     * @param {string} content - 消息提示的内容
     * @param {object} option - 消息提示的配置选项
     */
    warning(content, option) {
      this.showMessage('warning', content, option)
    }
  }

  // 返回消息提示管理类的新实例
  return new Message()
}

/**
 * 设置对话框的配置和行为
 * @param {Object} NDialog - Naive UI的对话框实例
 * @returns {Object} - 配置后的对话框实例
 */
export function setupDialog(NDialog) {
  // 重写confirm方法，提供更灵活的配置选项
  NDialog.confirm = function (option = {}) {
    // 判断是否显示图标，如果有标题则显示
    const showIcon = !isNullOrUndef(option.title)
    // 根据配置选项调用相应的对话框类型
    return NDialog[option.type || 'warning']({
      showIcon,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: option.confirm,
      onNegativeClick: option.cancel,
      onMaskClick: option.cancel,
      ...option,
    })
  }

  // 返回配置后的对话框实例
  return NDialog
}

/**
 * 设置离散的Naive UI API，使其可以在全局范围内访问
 */
export function setupNaiveDiscreteApi() {
  // 使用pinia获取应用的全局状态管理器
  const appStore = useAppStore()
  // 计算配置提供者的属性，根据应用的主题进行配置
  const configProviderProps = computed(() => ({
    theme: appStore.isDark ? NaiveUI.darkTheme : undefined,
    themeOverrides: useAppStore().naiveThemeOverrides,
  }))
  // 使用Naive UI创建离散的API，包括消息提示、对话框、通知和加载条
  const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    { configProviderProps },
  )

  // 将加载条、通知、消息提示和对话框实例绑定到全局变量
  window.$loadingBar = loadingBar
  window.$notification = notification
  window.$message = setupMessage(message)
  window.$dialog = setupDialog(dialog)
}
