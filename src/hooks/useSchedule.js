import { useCallback, useEffect, useState } from 'react'
import { createSchedule, listSchedule } from '../services/scheduleService'
import { apiDateToKey } from '../utils/dateHelpers'

export function useSchedule() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const data = await listSchedule()
      setEntries(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const addEntry = useCallback(async (dia_cadastrado, horas_cadastradas_dia) => {
    const created = await createSchedule({ dia_cadastrado, horas_cadastradas_dia })
    setEntries((prev) => [...prev, created])
    return created
  }, [])

  const entryByKey = useCallback(
    (key) => entries.find((entry) => apiDateToKey(entry.dia_cadastrado) === key) || null,
    [entries],
  )

  const markedKeys = new Set(entries.map((entry) => apiDateToKey(entry.dia_cadastrado)))

  return { entries, loading, refetch, addEntry, entryByKey, markedKeys }
}
