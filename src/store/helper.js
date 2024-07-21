import { basePermissions } from '@/settings'
import api from '@/api'

/**
 * 异步获取用户信息。
 *
 * 该函数通过调用API获取当前用户的信息，包括基础信息、角色和权限。
 * 返回一个包含用户详细信息的对象，这些信息可用于用户界面的展示和权限控制。
 *
 * @returns {Promise<object>} 包含用户信息的对象，包括ID、用户名、账户、头像、昵称、性别、地址、最后登录时间、电子邮件、电话、角色、权限和当前角色。
 */
export async function getUserInfo() {
  const res = await api.getUser()
  const { id, roles, permissions, currentRole } = res.result || {}
  return {
    id,
    username: res.result.username,
    account: res.result.account,
    avatar: res.result?.avatarUrl,
    nickName: res.result?.username,
    gender: res.result?.gender,
    address: res.result?.address,
    lastLoginTime: res.result?.lastLoginTime,
    email: res.result?.phone,
    phone: res.result?.phone,
    remark: res.result?.remark,
    roles,
    permissions,
    currentRole,
  }
}

/**
 * 异步获取用户的全部权限。
 *
 * 该函数首先尝试从API获取用户的动态权限，然后将这些权限与预定义的基础权限合并。
 * 返回一个包含所有权限的数组，这些权限可用于权限检查和界面展示。
 *
 * @returns {Promise<Array<string>>} 包含所有权限的数组。
 */
export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getPermissions()
    asyncPermissions = res?.result || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
