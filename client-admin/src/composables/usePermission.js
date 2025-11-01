import { rolePermissions } from "@/config/rbacConfig"

export const usePermission = (role) => {
  const hasPermission = (permission) => {
    const permissions = rolePermissions[role] || []

    return permissions.includes(permission)
  }

  return { hasPermission }
}
