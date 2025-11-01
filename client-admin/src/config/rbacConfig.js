export const roles = {
  ADMIN: 'admin',
  STAFF: 'staff'
}

export const permissions = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_BOOKS: 'view_books',
  VIEW_REQUESTS: 'view_requests',
  VIEW_PUBLISHERS: 'view_publishers'
}

export const rolePermissions = {
  [roles.ADMIN]: Object.values(permissions),
  [roles.STAFF]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_REQUESTS
  ]
}
