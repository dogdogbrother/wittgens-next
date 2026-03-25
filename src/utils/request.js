import { useAuthStore } from '../store/useAuthStore'

export const BASE_URL = 'http://151.241.216.192:8000'

function getAuthHeaders() {
  const token = useAuthStore.getState().token
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function request(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...getAuthHeaders(),
      ...extraHeaders,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.msg || `请求失败: ${res.status}`)
  }
  const data = await res.json()
  return data.data ?? data
}

export function get(path, params, options = {}) {
  const query = params ? `?${new URLSearchParams(params)}` : ''
  return request(`${path}${query}`, { method: 'GET', ...options })
}

export function post(path, body, options = {}) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  })
}

export function put(path, body, options = {}) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  })
}

export function del(path, options = {}) {
  return request(path, { method: 'DELETE', ...options })
}
