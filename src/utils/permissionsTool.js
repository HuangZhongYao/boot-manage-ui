import { router } from '@/router'

/**
 * 判断是否具有权限
 * @param permissionCode 权限编码
 * @returns {boolean} 是否具有权限
 */
export default function isPermission(permissionCode) {
  // 获取当前路由信息
  const currentRoute = unref(router.currentRoute)
  // 从当前路由的元信息中提取按钮权限码列表
  const btns = currentRoute.meta?.btns?.map(item => item.code) || []
  // 检查当前权限码是否在列表中，若不在，则移除元素
  if (!btns.includes(permissionCode)) {
    return false
  }
  return true
}
