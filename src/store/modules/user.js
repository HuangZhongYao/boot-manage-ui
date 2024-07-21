/**
 * 使用pinia创建一个名为user的store。
 * 这个store用于管理用户信息的状态，包括获取和设置用户详细信息。
 */
import { defineStore } from 'pinia'

/**
 * 定义一个名为useUserStore的函数，用于获取user store的实例。
 * 这个函数使用defineStore函数创建，并配置了user store的相关属性和方法。
 * @returns {Object} 返回一个包含state、getters、actions的对象，用于操作和获取用户信息。
 */
export const useUserStore = defineStore('user', {
  /**
   * 定义store的初始状态。
   * @returns {Object} 返回一个包含userInfo的对象，userInfo初始值为null。
   */
  state: () => ({
    userInfo: null,
  }),
  /**
   * 定义getters，用于从state中派生出一些计算属性。
   * 这些计算属性提供了更方便的方式来访问和使用userInfo中的数据。
   */
  getters: {
    /**
     * 获取用户的ID。
     * @returns {number | null} 返回用户的ID，如果userInfo为null，则返回null。
     */
    userId() {
      return this.userInfo?.id
    },
    /**
     * 获取用户的用户名。
     * @returns {String|null} 返回用户的用户名，如果userInfo为null，则返回null。
     */
    username() {
      return this.userInfo?.username
    },
    /**
     * 获取用户的账号。
     * @returns {String|null} 返回用户的账号，如果userInfo为null，则返回null。
     */
    account() {
      return this.userInfo?.account
    },
    /**
     * 获取用户的电话号码。
     * @returns {String|null} 返回用户的电话号码，如果userInfo为null，则返回null。
     */
    phone() {
      return this.userInfo?.phone
    },
    /**
     * 获取用户的昵称。
     * @returns {String|null} 返回用户的昵称，如果userInfo为null，则返回null。
     */
    nickName() {
      return this.userInfo?.nickName
    },
    /**
     * 获取用户的头像URL。
     * @returns {String|null} 返回用户的头像URL，如果userInfo为null，则返回null。
     */
    avatar() {
      return this.userInfo?.avatar
    },
    /**
     * 获取用户上次登录的时间。
     * @returns {Date|null} 返回用户上次登录的时间，如果userInfo为null，则返回null。
     */
    lastLoginTime() {
      return this.userInfo?.lastLoginTime
    },
    /**
     * 获取用户备注信息
     * @returns {function(): *}
     */
    remark() {
      return this.userInfo?.remark
    },
    /**
     * 获取用户当前的角色信息。
     * @returns {Object|{}} 返回用户当前的角色信息，如果userInfo为null，则返回空对象{}。
     */
    currentRole() {
      return this.userInfo?.currentRole || {}
    },
    /**
     * 获取用户的全部角色信息。
     * @returns {Array[]} 返回用户的全部角色信息数组，如果userInfo为null，则返回空数组[]。
     */
    roles() {
      return this.userInfo?.roles || []
    },
  },
  /**
   * 定义actions，用于发起一些改变state的操作。
   * 这些操作通常是异步的，可以用于更新store中的数据。
   */
  actions: {
    /**
     * 设置用户信息。
     * @param {Object} user - 包含用户信息的对象。
     */
    setUser(user) {
      this.userInfo = user
    },
    /**
     * 重置用户信息。
     * 这个方法会将store的状态重置为初始状态。
     */
    resetUser() {
      this.$reset()
    },
  },
})
