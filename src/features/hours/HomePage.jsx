import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PiggyBank } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Calendar from './Calendar';
import CadastrarHorasModal from './CadastrarHorasModal';
import { useAuth } from '../auth/useAuth';
import { useCompany } from '../../hooks/useCompany';
import { useSchedules } from '../../hooks/useSchedules';
import { useEarnings } from '../../hooks/useEarnings';
import { calculateMonthSummary } from '../../utils/earnings';
import { formatCurrency } from '../../utils/currency';
import { getErrorMessage } from '../../utils/errorMessage';

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [selectedDate, setSelectedDate] = useState(null);

  const companyQuery = useCompany();
  const schedulesQuery = useSchedules();
  const earningsQuery = useEarnings();

  const shouldRedirectToCompany =
    companyQuery.isError && companyQuery.error?.response?.status === 404;

  // Aluno logado sem empresa cadastrada: manda pro cadastro da empresa
  // (fluxo Cadastro → Login → Cadastro da empresa → Home).
  useEffect(() => {
    if (shouldRedirectToCompany) {
      navigate('/cadastro-empresa', { replace: true });
    }
  }, [shouldRedirectToCompany, navigate]);

  const schedules = useMemo(() => schedulesQuery.data ?? [], [schedulesQuery.data]);
  const transporte = Boolean(companyQuery.data?.transporte);

  const monthSummary = useMemo(
    () => calculateMonthSummary(schedules, { transporte, month: viewDate.month, year: viewDate.year }),
    [schedules, transporte, viewDate],
  );

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  if (companyQuery.isLoading || shouldRedirectToCompany) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">Carregando...</div>
    );
  }

  const companyError =
    companyQuery.isError && companyQuery.error?.response?.status !== 404 ? companyQuery.error : null;

  if (companyError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-danger">{getErrorMessage(companyError)}</p>
        <Button
          variant="primary"
          fullWidth={false}
          className="px-6"
          onClick={() => companyQuery.refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8 lg:px-16">
      <h1 className="mb-8 font-heading text-lg font-bold text-ink sm:text-xl">
        Bem vindo, {user?.nome ?? 'aluno'}.
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Calendar
            month={viewDate.month}
            year={viewDate.year}
            schedules={schedules}
            onMonthChange={(month, year) => setViewDate({ month, year })}
            onSelectDay={setSelectedDate}
          />
        </Card>

        <Card className="flex flex-col items-center justify-center gap-2 text-center">
          <PiggyBank className="size-10 text-accent" strokeWidth={1.5} aria-hidden="true" />
          <p className="font-heading text-base font-bold text-primary">
            Em {MONTH_NAMES[viewDate.month]} você faturou
          </p>
          <p className="font-heading text-3xl font-bold text-ink">
            {formatCurrency(monthSummary.totalValor)}
          </p>
          <p className="text-sm text-muted">
            {monthSummary.totalHoras}h registradas em {monthSummary.totalDias}{' '}
            {monthSummary.totalDias === 1 ? 'dia' : 'dias'}
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 font-heading text-sm font-bold text-ink">Total geral do estágio</h2>
          {earningsQuery.isLoading && <p className="text-sm text-muted">Carregando total geral...</p>}
          {earningsQuery.isError && (
            <p className="text-sm text-danger">{getErrorMessage(earningsQuery.error)}</p>
          )}
          {earningsQuery.data && (
            <p className="text-sm text-ink">
              {earningsQuery.data.total_horas}h em {earningsQuery.data.total_dias}{' '}
              {earningsQuery.data.total_dias === 1 ? 'dia' : 'dias'} ·{' '}
              {formatCurrency(earningsQuery.data.total)}
            </p>
          )}
        </Card>

        <div className="flex items-center justify-end">
          <Button variant="accent" fullWidth={false} className="px-8" onClick={handleLogout}>
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
      </div>

      {schedulesQuery.isError && (
        <p className="mt-6 text-center text-sm text-danger">{getErrorMessage(schedulesQuery.error)}</p>
      )}

      <CadastrarHorasModal open={Boolean(selectedDate)} date={selectedDate} onClose={() => setSelectedDate(null)} />
    </div>
  );
}
