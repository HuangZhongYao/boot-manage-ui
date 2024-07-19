/**********************************
 * @FilePath: interceptors.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:40
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { resolveResError } from './helpers'
import { useAuthStore } from '@/store'

/**
 * 设置axios实例的拦截器。
 * @param {Object} axiosInstance - Axios实例，用于挂载请求和响应拦截器。
 */
export function setupInterceptors(axiosInstance) {
  /**
   * 请求拦截器：在请求发送前进行处理。
   * @param {Object} config - Axios请求配置。
   * @returns {Object} 修改后的请求配置。
   */
  function reqResolve(config) {
    // 如果请求标记为不需要token，则直接返回配置
    // 处理不需要token的请求
    if (config.needToken === false) {
      return config
    }

    // 使用Auth Store获取访问令牌
    const { accessToken } = useAuthStore()
    // 如果存在访问令牌，将其添加到请求头中
    if (accessToken) {
      // token: Bearer + xxx
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  }

  /**
   * 请求拦截器：在请求错误时进行处理。
   * @param {Error} error - 发生的错误。
   * @returns {Promise} 包含错误的拒绝承诺。
   */
  function reqReject(error) {
    return Promise.reject(error)
  }

  // 定义成功状态码列表
  const SUCCESS_CODES = [0, 200]
  /**
   * 响应拦截器：在接收到响应后进行处理。
   * @param {Object} response - Axios响应。
   * @returns {Promise} 根据响应内容处理后的承诺。
   */
  function resResolve(response) {
    const { data, status, config, statusText, headers } = response
    // 如果响应内容类型是JSON且包含成功状态码
    if (headers['content-type']?.includes('json')) {
      // 如果数据中的代码是成功代码之一，返回数据
      if (SUCCESS_CODES.includes(data?.code)) {
        return Promise.resolve(data)
      }
      // 使用数据中的代码或状态码作为错误代码
      const code = data?.code ?? status

      // 判断是否需要提示错误信息
      const needTip = config?.needTip !== false

      // 根据代码处理错误信息，并返回包含错误代码和消息的承诺
      // 根据code处理对应的操作，并返回处理后的message
      const message = resolveResError(code, data?.message ?? statusText, needTip)

      return Promise.reject({ code, message, error: data ?? response })
    }
    // 如果响应内容不是JSON，直接返回数据或响应
    return Promise.resolve(data ?? response)
  }

  /**
   * 响应拦截器：在响应错误时进行处理。
   * @param {Error} error - 发生的错误。
   * @returns {Promise} 包含处理后的错误代码和消息的拒绝承诺。
   */
  async function resReject(error) {
    // 如果没有错误或没有响应数据
    if (!error || !error.response) {
      // 使用错误代码或默认状态码
      const code = error?.code
      /** 根据code处理对应的操作，并返回处理后的message */
      const message = resolveResError(code, error.message)
      return Promise.reject({ code, message, error })
    }

    // 获取响应数据中的代码、状态和配置
    const { data, status, config } = error.response
    // 使用数据中的代码或状态码作为错误代码
    const code = data?.code ?? status

    // 判断是否需要提示错误信息
    const needTip = config?.needTip !== false

    // 根据代码处理错误信息，并返回包含错误代码和消息的承诺
    const message = resolveResError(code, data?.message ?? error.message, needTip)
    return Promise.reject({ code, message, error: error.response?.data || error.response })
  }

  // 使用拦截器处理请求和响应
  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use(resResolve, resReject)
}
