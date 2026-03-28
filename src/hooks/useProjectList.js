import { useState, useEffect, useCallback } from 'react'
import { get } from '../utils/request'

export function useProjectList(status, pageIndex = 1, pageSize = 10) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { pageSize, pageIndex }
      if (status && status !== 'all') params.status = status
      const json = await get('/api/v1/app/project', params)
      const list = Array.isArray(json.list) ? json.list : []
      setData(list)
      setTotal(json.count ?? list.length)
    } catch (err) {
      setError(err.message)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [status, pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, total, loading, error, refetch: fetchData }
}
