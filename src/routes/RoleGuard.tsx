import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import type { Permission } from '@/constants/roles'

function RoleGuard({ permission, children }: { permission: Permission; children: React.ReactNode }) {
  const { can } = usePermission()
  if (!can(permission)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default RoleGuard
