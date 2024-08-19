import { request } from '@/utils/index.js'

/**
 * 商城订单Api接口
 * Desc   Created by Velocity Generate.
 * Time   2024-07-31 10:03:05
 * Author zuuuYao (https://github.com/HuangZhongYao)
 * Copyright © 2024 ZuuuuYao By GitHub
 */
export default {
  /**
   * 创建商城订单。
   * @param {Object} data - 包含新商城订单信息的对象。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  create: data => request.post('/order/addBusOrder', data),

  /**
   * 读取商城订单列表，支持分页查询。
   * @param {object} params - 查询参数，包含分页信息等。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  read: (params = {}) => request.get('/order/pageQueryList', { params }),

  /**
   * 更新商城订单信息。
   * @param {Object} data - 包含待更新商城订单信息的对象，必须包含商城订单ID。
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  update: data => request.patch(`/order/editBusOrder`, data),

  /**
   * 删除指定ID的商城订单。
   * @param {Array} data - 待删除商城订单的ID数组。示列{ids:[1,2,3,4]}
   * @returns {Promise} - 一个Promise对象，用于处理异步请求的结果。
   */
  delete: data => request.delete('/order/delBusOrder', { data }),
}
