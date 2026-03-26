import { useState, useEffect, useCallback } from 'react'
import { get } from '../utils/request'

export function useSecondaryMarket() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await get('/api/v1/app/market/symbols', {
        keyword: submittedKeyword,
        pageSize,
        pageIndex,
      })
      const raw = json.list ?? json.data ?? json
      setData(Array.isArray(raw) ? raw : [])
      setTotal(json.total ?? 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [submittedKeyword, pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = useCallback(() => {
    setSubmittedKeyword(keyword)
    setPageIndex(1)
  }, [keyword])

  return {
    data,
    total,
    loading,
    error,
    keyword,
    setKeyword,
    pageIndex,
    setPageIndex,
    pageSize,
    handleSearch,
  }
}
