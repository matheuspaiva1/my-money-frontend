import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { horasSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errorMessage';
import { toApiDateString } from '../../utils/date';
import { createSchedule } from '../../services/scheduleService';

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

// US04 — Cadastrar Horas (modal), aberto ao selecionar uma data no calendário.
export default function CadastrarHorasModal({ open, date, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(horasSchema) });

  useEffect(() => {
    if (open) reset({ horas: '' });
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: async () => {
      toast.success('Horas registradas com sucesso!');
      // Atualiza a Home imediatamente, sem exigir reload manual.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['schedules'] }),
        queryClient.invalidateQueries({ queryKey: ['earnings'] }),
      ]);
      onClose();
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        setError('horas', { message: 'Você já registrou horas nesse dia.' });
        return;
      }
      toast.error(getErrorMessage(error));
    },
  });

  function onSubmit(values) {
    if (!date) return;
    mutation.mutate({
      dia_cadastrado: toApiDateString(date),
      horas_cadastradas_dia: values.horas,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Cadastrar Horas">
      {date && (
        <p className="mb-4 text-center text-sm capitalize text-muted">
          {DATE_LABEL_FORMATTER.format(date)}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          type="number"
          step="0.5"
          min="0"
          max="24"
          placeholder="0"
          className="text-center"
          aria-label="Quantidade de horas"
          {...register('horas')}
          error={errors.horas?.message}
        />
        <Button type="submit" variant="accent" loading={isSubmitting || mutation.isPending}>
          Concluir
        </Button>
      </form>
    </Modal>
  );
}
