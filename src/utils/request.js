import { useAuthStore } from '../store/useAuthStore'

export const BASE_URL = 'http://151.241.216.192:8000'

// 防止并发请求同时触发多次刷新
let refreshingPromise = null

function getToken() {
  const token = useAuthStore.getState().token
  if (token) return token
  try {
    const raw = localStorage.getItem('rwa-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.token ?? null
    }
  } catch {}
  return null
}

function getRefreshToken() {
  const rt = useAuthStore.getState().refreshToken
  if (rt) return rt
  try {
    const raw = localStorage.getItem('rwa-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.refreshToken ?? null
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

async function tryRefreshToken() {
  if (refreshingPromise) return refreshingPromise

  refreshingPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) throw new Error('no_refresh_token')

    const res = await fetch(`${BASE_URL}/api/v1/app/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.code === 200) {
      const { accessToken, refreshToken: newRefreshToken } = data.data
      useAuthStore.getState().setAuth({
        token: accessToken,
        refreshToken: newRefreshToken,
        address: useAuthStore.getState().address,
      })
      return true
    }
    throw new Error('refresh_failed')
  })()
    .finally(() => { refreshingPromise = null })

  return refreshingPromise
}

export async function request(path, options = {}, _isRetry = false) {
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

  const data = await res.json().catch(() => ({}))

  // token 过期时尝试刷新后重试一次
  if ((res.status === 401 || data.code === 401) && !_isRetry) {
    try {
      await tryRefreshToken()
      return request(path, options, true)
    } catch {
      useAuthStore.getState().logout()
      throw new Error('登录已过期，请重新登录')
    }
  }

  if (!res.ok || data.code !== 200) {
    throw new Error(data.msg || `请求失败: ${data.code ?? res.status}`)
  }

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
