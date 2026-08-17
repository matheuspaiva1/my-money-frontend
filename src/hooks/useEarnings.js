import { useCallback, useEffect, useState } from 'react'
import { getEarnings } from '../services/earningsService'

export function useEarnings() {
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const data = await getEarnings()
      setEarnings(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { earnings, loading, refetch }
}
