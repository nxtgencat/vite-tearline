import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('hms_token')
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status
    const message =
      status === 400 ? 'Bad request — check your input'
      : status === 401 ? 'Unauthorized — please login again'
      : status === 404 ? 'Not found'
      : status === 500 ? 'Server error — try again later'
      : err.code === 'ECONNABORTED' ? 'Request timed out'
      : err.message === 'Network Error' ? 'Network failure — check connection'
      : 'Something went wrong'
    if (status === 401) {
      localStorage.removeItem('hms_token')
      localStorage.removeItem('hms_user')
      // allow app to handle redirect
    }
    return Promise.reject({ ...err, friendlyMessage: message, status })
  }
)

// delay helper to simulate loading states
export function delay(ms = 500) {
  return new Promise(res => setTimeout(res, ms))
}

export type ApiError = { friendlyMessage: string; status?: number; message: string }
