const BASE_URL = 'http://151.241.216.192:8000'

export async function getNonce(wallet) {
  const res = await fetch(`${BASE_URL}/api/v1/app/auth/nonce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.msg || `获取 Nonce 失败: ${res.status}`)
  }
  const data = await res.json()
  return data.data ?? data
}

export async function loginWithSignature(wallet, nonce, signature) {
  const res = await fetch(`${BASE_URL}/api/v1/app/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, nonce, signature }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.msg || `登录失败: ${res.status}`)
  }
  const data = await res.json()
  return data.data ?? data
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${BASE_URL}/api/v1/app/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.msg || `刷新 Token 失败: ${res.status}`)
  }
  const data = await res.json()
  return data.data ?? data
}
