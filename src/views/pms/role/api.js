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
  delete: data => request.delete(`/role/`, { data }),

  getAllPermissionTree: () => request.get('/resources/resourcesTree'),
  getAllUsers: (params = {}) => request.get('/user', { params }),
  addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data),
}
