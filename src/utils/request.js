import { useAuthStore } from '../store/useAuthStore'

export const BASE_URL = 'http://151.241.216.192:8000'

function getToken() {
  // 优先从 zustand 内存状态读取
  const token = useAuthStore.getState().token
  if (token) return token
  // fallback：直接从 localStorage 读取（防止 persist hydration 未完成）
  try {
    const raw = localStorage.getItem('rwa-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.token ?? null
    }
  } catch {}
  return null
}

function getAuthHeaders(isFormData = false) {
  const token = getToken()
  const headers = {}
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function request(path, options = {}) {
  const { headers: extraHeaders, body, ...rest } = options
  const isFormData = body instanceof FormData

  const res = await fetch(`${BASE_URL}${path}`, {
    body,
    ...rest,
    headers: {
      ...getAuthHeaders(isFormData),
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

/** 文件上传（multipart/form-data），自动带 token */
export function upload(path, files, fieldName = 'files') {
  const formData = new FormData()
  const list = Array.isArray(files) ? files : [files]
  list.forEach(f => formData.append(fieldName, f))
  return request(path, { method: 'POST', body: formData })
}
