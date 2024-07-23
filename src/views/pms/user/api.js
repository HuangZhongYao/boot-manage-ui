/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  /**
   * 用户管理相关操作的定义。
   * 这些操作包括创建用户、读取用户、更新用户信息、删除用户、重置用户密码以及获取所有启用的角色。
   * 每个操作都通过调用request对象的相应方法来实现对用户数据的CRUD操作。
   */

  /**
   * 创建用户。
   * @param {Object} data - 包含新用户信息的对象。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  create: data => request.post('/user/addUser', data),

  /**
   * 读取用户列表，支持分页查询。
   * @param {object} params - 查询参数，包含分页信息等。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  read: (params = {}) => request.get('/user/pageQueryList', { params }),

  /**
   * 更新用户信息。
   * @param {Object} data - 包含待更新用户信息的对象，必须包含用户ID。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  update: data => request.patch(`/user/editUser`, data),

  /**
   * 删除指定ID的用户。
   * @param {Object} data - 待删除用户的ID。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  delete: data => request.delete('/user/delUser', { data }),

  /**
   * 重置指定ID用户的密码。
   * @param {string|number} id - 用户ID。
   * @param {Object} data - 包含新密码信息的对象。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  resetPwd: (id, data) => request.patch(`/user/resetPassword`, data),

  /**
   * 分配用户角色
   * @param data 包含用户id角色id的对象
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  setRole: data => request.patch(`/user/setRole`, data),

  /**
   * 查询用户的角色列表
   * @param id 用户id
   * @returns {*} 用户的角色列表
   */
  getUserRole: id => request.get(`/user/queryUserRoleList?id=${id}`),

  /**
   * 获取所有已启用的角色。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  getAllRoles: () => request.get('/role/queryList?enable=true'),
}
