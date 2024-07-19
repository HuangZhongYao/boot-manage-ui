import { defineStore } from 'pinia'
import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/store'

/**
 * 使用defineStore创建一个名为'auth'的store。
 * 该store用于管理用户的认证状态，包括令牌的设置和重置，
 * 以及角色切换和登录/登出逻辑。
 */
export const useAuthStore = defineStore('auth', {
  /**
   * 初始化state，定义store的初始状态。
   * @returns {Object} 返回一个包含accessToken属性的对象，初始值为undefined。
   */
  state: () => ({
    accessToken: undefined,
  }),
  /**
   * 定义actions，用于执行影响store状态的操作。
   */
  actions: {
    /**
     * 设置accessToken的值。
     * @param {Object} data 包含accessToken的对象。
     */
    setToken({ accessToken }) {
      this.accessToken = accessToken
    },
    /**
     * 重置accessToken的值为初始状态。
     */
    resetToken() {
      this.$reset()
    },
    /**
     * 重定向到登录页面。
     * 使用从useRouterStore获取的router来执行页面重定向。
     */
    toLogin() {
      const { router, route } = useRouterStore()
      router.replace({
        path: '/login',
        query: route.query,
      })
    },
    /**
     * 切换当前角色。
     * 先重置登录状态，然后设置新的accessToken。
     * @param {Object} data 包含新角色的访问令牌的对象。
     */
    async switchCurrentRole(data) {
      this.resetLoginState()
      await nextTick()
      this.setToken(data)
    },
    /**
     * 重置登录状态。
     * 调用其他store的重置方法，重置用户信息、路由、权限和标签页状态，
     * 并重置accessToken。
     */
    resetLoginState() {
      const { resetUser } = useUserStore()
      const { resetRouter } = useRouterStore()
      const { resetPermission, accessRoutes } = usePermissionStore()
      const { resetTabs } = useTabStore()
      // 重置路由
      resetRouter(accessRoutes)
      // 重置用户
      resetUser()
      // 重置权限
      resetPermission()
      // 重置Tabs
      resetTabs()
      // 重置token
      this.resetToken()
    },
    /**
     * 执行登出操作。
     * 重置登录状态并重定向到登录页面。
     */
    async logout() {
      this.resetLoginState()
      this.toLogin()
    },
  },
  /**
   * 配置持久化选项。
   * 指定store的状态应保存在名为'vue-naivue-admin_auth'的key下。
   */
  persist: {
    key: 'vue-naivue-admin_auth',
  },
})
