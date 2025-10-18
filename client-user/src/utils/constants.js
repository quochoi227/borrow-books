let apiRoot = 'http://localhost:8017'

export const API_ROOT = apiRoot

export const PROTECTED_ROUTES = ['home', 'borrowing-history']

export const REQUEST_STATUS = {
  PENDING: 'chờ duyệt',
  ACCEPT: 'đang mượn',
  REJECTED: 'đã từ chối',
  RETURNED: 'đã trả',
  LATE: 'quá hạn',
  LOSTED: 'bị mất'
}
