/**********************************
 * @FilePath: index.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:28
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import axios from 'axios'
import { setupInterceptors } from './interceptors'

/**
 * 根据提供的选项创建一个 axios 实例。
 *
 * @param {Object} options - 自定义 axios 实例的配置项。
 * @returns {Object} 返回创建的 axios 实例。
 */
export function createAxios(options = {}) {
  // 定义默认配置项，包括基础URL和超时时间
  const defaultOptions = {
    baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
    timeout: 12000,
  }
  // 创建 axios 实例，并合并默认配置和传入的配置
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  // 设置 axios 实例的拦截器
  setupInterceptors(service)
  // 返回创建的 axios 实例
  return service
}

// 创建一个默认的 axios 实例，用于常规请求
export const request = createAxios()

// 创建一个专门用于模拟请求的 axios 实例，其基础URL指向模拟API
export const mockRequest = createAxios({
  baseURL: '/mock-api',
})
