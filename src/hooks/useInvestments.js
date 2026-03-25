import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { get } from '../utils/request'

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
      setData(json.list ?? json.data ?? json ?? [])
      setTotal(json.total ?? 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token, submittedKeyword, pageIndex, pageSize])

  useEffect(() => { fetchData() }, [fetchData])

  // 点击搜索按钮或按 Enter 时调用
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
