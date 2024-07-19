import { basePermissions } from '@/settings'
import api from '@/api'

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
    roles,
    permissions,
    currentRole,
  }
}

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
