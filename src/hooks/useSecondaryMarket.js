import { useState, useEffect, useCallback } from 'react'
import { get } from '../utils/request'

const MOCK_DATA = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  symbol: `RWAT-PRO-${String(i + 1).padStart(2, '0')}/USDT`,
  baseAsset: `RWAT${100000 + i * 13457}`,
  quoteSymbol: 'USDT',
  projectId: 980023458 + i,
  projectTitle: 'Opensea House',
  projectToken: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f45b0',
  status: 'active',
  // 额外展示字段
  totalSupply: 500063,
  tokenizedValue: 500063,
  estimatedAPY: '20%',
  useOfProceeds: 'Construction Funds',
  circulatingSupply: '200,000.00',
  marketCap: '$893,233.456.0046',
  currentPrice: '3400.5038',
  currentHolders: '45000',
  share: '23%',
}))

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
      const list = Array.isArray(raw) ? raw : []
      // 接口无数据时使用 mock 数据方便调试
      setData(list.length > 0 ? list : MOCK_DATA)
      setTotal(json.total ?? (list.length > 0 ? 0 : MOCK_DATA.length))
    } catch {
      // 请求失败时也回退到 mock 数据
      setData(MOCK_DATA)
      setTotal(MOCK_DATA.length)
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
