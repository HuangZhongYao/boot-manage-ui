/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/04/01 15:52:04
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import axios from 'axios'
import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/resources/resourcesTree'),
  getButtons: ({ parentId }) => request.get(`/resources/button/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: data => request.post('/resources/addResources', data),
  savePermission: (id, data) => request.patch(`/resources/editResources`, data),
  setState: data => request.patch(`/resources/setState`, data),
  deletePermission: data => request.delete(`/resources/delResources`, { data }),
}
