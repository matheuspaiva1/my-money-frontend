import { useMemo, useState } from 'react'
import { LogOut, PiggyBank } from 'lucide-react'
import { toast } from 'sonner'
import { CalendarView } from '../../components/calendar/CalendarView'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { PageFrame } from '../../components/layout/PageFrame'
import { CadastrarHorasModal } from '../../components/schedule/CadastrarHorasModal'
import { useAuth } from '../../hooks/useAuth'
import { useCompany } from '../../hooks/useCompany'
import { useSchedule } from '../../hooks/useSchedule'
import { useEarnings } from '../../hooks/useEarnings'
import { formatCurrency } from '../../utils/formatters'
import { formatMonthLabel, toDateKey } from '../../utils/dateHelpers'
import { HOURLY_RATE, TOTAL_HORAS_ESTAGIO } from '../../utils/config'
import { getApiErrorMessage } from '../../services/api'

export function Home() {
  const { user, logout } = useAuth()
  const { company } = useCompany()
  const { loading: scheduleLoading, addEntry, entryByKey, markedKeys, entries, refetch: refetchSchedule } =
    useSchedule()
  const { earnings, refetch: refetchEarnings } = useEarnings()

  const [month, setMonth] = useState(() => new Date())
  const [selectedKey, setSelectedKey] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const modalOpen = Boolean(selectedKey)
  const existingEntry = selectedKey ? entryByKey(selectedKey) : null

  const monthlyValue = useMemo(() => {
    const monthPrefix = toDateKey(month).slice(0, 7) // "yyyy-MM"
    const monthHours = entries
      .filter((entry) => String(entry.dia_cadastrado).slice(0, 7) === monthPrefix)
      .reduce((sum, entry) => sum + Number(entry.horas_cadastradas_dia), 0)
    return monthHours * HOURLY_RATE
  }, [entries, month])

  const horasRestantes = Math.max(TOTAL_HORAS_ESTAGIO - Number(earnings?.total_horas || 0), 0)

  async function handleSubmitHoras(horas) {
    if (!selectedKey) return
    setSubmitting(true)
    try {
      await addEntry(selectedKey, Number(horas))
      toast.success('Horas registradas!')
      setSelectedKey(null)
      // Mantém total de horas, restantes e valor acumulado sincronizados (US04/US05).
      refetchEarnings()
      refetchSchedule()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Não foi possível registrar as horas.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageFrame className="p-8 sm:p-10">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">
        Bem vindo, {user?.nome}
        {company?.nome_empresa ? ` de ${company.nome_empresa}` : ''}.
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <CalendarView
            month={month}
            onMonthChange={setMonth}
            markedKeys={markedKeys}
            selectedKey={selectedKey}
            onSelectDay={(day) => setSelectedKey(day.key)}
          />

          <div className="rounded-xl border-2 border-primary-500 px-4 py-3 text-center text-sm font-medium text-gray-800">
            {scheduleLoading
              ? 'Carregando horas registradas...'
              : `Falta ${horasRestantes}h para o fim do estágio`}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex min-h-[220px] flex-col items-center justify-between border-[3px] py-6 text-center">
            <PiggyBank className="text-secondary-500" size={32} />
            <p className="text-sm font-semibold text-primary-600">
              No mês de {formatMonthLabel(month)} você faturou
            </p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyValue)}</p>
          </Card>

          <Button
            variant="secondary"
            fullWidth
            onClick={logout}
            className="flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>

      <CadastrarHorasModal
        open={modalOpen}
        dateKey={selectedKey}
        existingEntry={existingEntry}
        submitting={submitting}
        onClose={() => setSelectedKey(null)}
        onSubmit={handleSubmitHoras}
      />
    </PageFrame>
  )
}
