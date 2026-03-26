import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { get } from '../utils/request'

const MOCK_DATA = Array.from({ length: 5 }, (_, i) => ({
  projectId: 1001 + i,
  symbol: `RWAT-PRO-${String(i + 1).padStart(2, '0')}/USDT`,
  assetName: `Opensea House ${i + 1}`,
  sharesHeld: 50000 + i * 12345,
  heldRatio: 0.05 + i * 0.02,
  spent: 25000 + i * 5000,
  claimableEarnings: 1200 + i * 300,
  redemptionAmount: 26500 + i * 5200,
  redemptionAt: `2026-0${(i % 9) + 1}-15T10:30:00Z`,
  contract: `0x${(i + 1).toString().repeat(4)}aabbccddeeff${(i + 1).toString().repeat(4)}`,
  canClaimTokens: i % 2 === 0,
  canClaimEarnings: i % 3 === 0,
  canRedeem: i % 2 !== 0,
}))

export function useInvestments() {
  const { token } = useAuthStore()
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10

  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const json = await get('/api/v1/app/market/investments', { keyword: submittedKeyword, pageSize, pageIndex })
      const raw = json.list ?? json.data ?? json
      const list = Array.isArray(raw) ? raw : []
      // 接口无数据时使用 mock 数据方便调试
      setData(list.length > 0 ? list : MOCK_DATA)
      setTotal(json.total ?? (list.length > 0 ? 0 : MOCK_DATA.length))
    } catch {
      setData(MOCK_DATA)
      setTotal(MOCK_DATA.length)
    } finally {
      setLoading(false)
    }
  }, [token, submittedKeyword, pageIndex, pageSize])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = useCallback(() => {
    setSubmittedKeyword(keyword)
    setPageIndex(1)
  }, [keyword])

  return {
    data, total, loading, error,
    keyword, setKeyword,
    pageIndex, setPageIndex, pageSize,
    handleSearch,
  }
}
