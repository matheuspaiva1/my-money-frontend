import { useCallback, useEffect, useState } from 'react'
import { getCompany } from '../services/companyService'

export function useCompany() {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const data = await getCompany()
      setCompany(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { company, loading, refetch }
}
