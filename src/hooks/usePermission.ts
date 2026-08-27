import { useCallback } from 'react'
import { ROLE_PERMISSIONS, type Permission, type Role } from '@/constants/roles'
import { useAuth } from './useAuth'

export function usePermission() {
  const { user } = useAuth()
  const role = user?.role as Role | undefined

  const can = useCallback((perm: Permission) => {
    if (!role) return false
    return ROLE_PERMISSIONS[role]?.includes(perm) ?? false
  }, [role])

  const isRole = useCallback((r: Role) => role === r, [role])

  return { can, isRole, role }
}
