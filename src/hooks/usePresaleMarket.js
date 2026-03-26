import { useState, useEffect, useCallback } from 'react'
import { get } from '../utils/request'

const now = Date.now()
const DAY = 86400000

const MOCK_DATA = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  projectId: 980023458 + i,
  projectTitle: 'Opensea House',
  baseAsset: `RWAT${100000 + i * 13457}`,
  symbol: `RWAT-PRO-${String(i + 1).padStart(2, '0')}/USDT`,
  projectToken: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f45b0',
  status: i < 4 ? 'live' : 'ended',
  // 顶部统计
  totalSupply: 500063,
  tokenizedValue: 500063,
  projectedAPY: '20%',
  // 时间
  startDate: new Date(now - DAY * 5).toISOString().slice(0, 10),
  endDate: new Date(now + DAY * (30 - i * 5)).toISOString().slice(0, 10),
  endTimestamp: now + DAY * (30 - i * 5),
  // 列表统计
  presaleSupply: 1000000,
  issuePrice: '0.003',
  useOfProceeds: 'Upgrade Infrastructure',
  // 表格专用
  icoStatus: i < 4 ? 'ICO live' : 'ICO Ended',
  lockUpStatus: 'Not Expired',
  totalSupplyRaw: (15558878 + i * 1234567).toFixed(2),
  sharesHeld: (8234 - i * 400).toLocaleString(),
  lockUpPeriod: [30, 60, 30, 60, 30, 60][i],
  shareBoost: ['4×', '2×', '15×', '1×', '4×', '10×'][i],
  investmentFunds: (15558878 + i * 1234567).toFixed(2),
  owner: ['20%', '50%', '50%', '30%', '10%', '50%'][i],
  canRedeem: i % 2 === 0,
}))

export function usePresaleMarket() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const json = await get('/api/v1/app/market/presale', {
        keyword: submittedKeyword,
        pageSize,
        pageIndex,
      })
      const raw = json.list ?? json.data ?? json
      const list = Array.isArray(raw) ? raw : []
      setData(list.length > 0 ? list : MOCK_DATA)
      setTotal(json.total ?? (list.length > 0 ? 0 : MOCK_DATA.length))
    } catch {
      setData(MOCK_DATA)
      setTotal(MOCK_DATA.length)
    } finally {
      setLoading(false)
    }
  }, [submittedKeyword, pageIndex, pageSize])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = useCallback(() => {
    setSubmittedKeyword(keyword)
    setPageIndex(1)
  }, [keyword])

  return { data, total, loading, keyword, setKeyword, handleSearch, pageIndex, setPageIndex, pageSize }
}
