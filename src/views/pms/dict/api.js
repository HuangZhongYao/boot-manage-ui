/**
 * Time      2024-08-18 12:24
 * Author    ZhongYao.Huang (https://github.com/HuangZhongYao)
 * Copyright © 2024 ZuuuuYao By Github
 */

import { request } from '@/utils'

export default {
  /**
   * 添加字典类型
   * @param data
   * @returns {*}
   */
  addDictType: data => request.post('/dict/addDictType', data),
  /**
   * 获取字典类型树
   * @param params
   * @returns {*}
   */
  getDictTypeTree: (params = {}) => request.get('/dict/dictTypeTree', { params }),
  /**
   * 编辑字典类型
   * @param data
   * @returns {*}
   */
  editDictType: data => request.patch(`/dict/editDictType`, data),
  /**
   * 删除字典类型
   * @param data
   * @returns {*}
   */
  delDictType: data => request.delete(`/dict/delDictType`, { data }),

  /**
   * 添加字典数据
   * @param data
   * @returns {*}
   */
  addDictData: data => request.post('/dict/addDictData', data),

  /**
   * 根据字典类型id获取字典数据
   * @param params
   * @returns {*}
   */
  getDictDataQueryList: (params = {}) => request.get('/dict/dictDataQueryList', { params }),

  /**
   * 编辑字典数据
   * @param data
   * @returns {*}
   */
  editDict: data => request.patch(`/dict/editDictData`, data),

  /**
   * 删除字典数据
   * @param data
   * @returns {*}
   */
  delDict: data => request.delete(`/dict/delDictData`, { data }),

}
