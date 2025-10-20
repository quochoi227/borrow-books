import authorizedAxiosInstance from '../utils/authorizeAxios'
import { API_ROOT } from '@/utils/constants'
// Users
export const fetchAllUsersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users`)
  return response.data
}

export const registerAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  return response.data
}

export const loginAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  return response.data
}

export const logoutAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
  return response.data
}

// Admins
export const adminRegisterAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/admins/register`, data)
  return response.data
}

export const adminLoginAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/admins/login`, data)
  return response.data
}

export const adminLogoutAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/admins/logout`)
  return response.data
}

// Books
export const fetchBooksAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books`)
  return response.data
}

export const getBookDetailsAPI = async (bookId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books/${bookId}`)
  return response.data
}

export const addNewBookAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books`, data)
  return response.data
}

export const updateBookAPI = async (bookId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/books/${bookId}`, data)
  return response.data
}

export const deleteBookAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/books/${id}`)
  return response.data
}

export const uploadImageAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books/upload_image`, data)
  return response.data
}

export const uploadImagesAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books/upload_images`, data)
  return response.data
}

// Publishers
export const fetchPublishersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/sources`)
  return response.data
}

export const addNewPublisherAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/sources`, data)
  return response.data
}

// Requests
export const getAllRequests = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/requests`)
  return response.data
}

export const updateRequestAPI = async (requestId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/requests/${requestId}`, data)
  return response.data
}
