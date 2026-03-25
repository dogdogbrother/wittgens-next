import { post } from './request'

export function getNonce(wallet) {
  return post('/api/v1/app/auth/nonce', { wallet })
}

export function loginWithSignature(wallet, nonce, signature) {
  return post('/api/v1/app/auth/login', { wallet, nonce, signature })
}

export function refreshAccessToken(refreshToken) {
  return post('/api/v1/app/auth/refresh', { refreshToken })
}
