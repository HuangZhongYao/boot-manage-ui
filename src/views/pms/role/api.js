/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: data => request.post('/role/addRole', data),
  read: (params = {}) => request.get('/role/pageQueryList', { params }),
  update: data => request.patch(`/role/editRole`, data),
  delete: data => request.delete(`/role/delRole`, { data }),
  // 查询角色下的用户
  queryRoleUser: roleId => request.get(`/role/queryRoleUserList?id=${roleId}`),
  // 分配角色的用户接口
  setRoleUser: data => request.post('/role/setRoleUser', data),
  // 查询全部用户
  getAllUsers: () => request.get('/user/queryAllUserList'),
  getAllPermissionTree: () => request.get('/resources/resourcesTree'),
  addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data),
}
