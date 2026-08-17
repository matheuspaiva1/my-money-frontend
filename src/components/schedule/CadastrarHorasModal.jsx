import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { horasSchema } from '../../utils/validators'

/**
 * Modal "Cadastrar Horas" (US04). Se `existingEntry` já existir para o dia
 * selecionado, mostra em modo leitura — a API não tem endpoint de edição e
 * recusa (409) um segundo POST /schedule para o mesmo dia.
 */
export function CadastrarHorasModal({ open, dateKey, existingEntry, onClose, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(horasSchema) })

  const label = dateKey
    ? format(parseISO(dateKey), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  function handleClose() {
    reset()
    onClose()
  }

  async function submit({ horas }) {
    await onSubmit(horas)
    reset()
  }

  return (
    <Modal open={open} title="Cadastrar Horas" onClose={handleClose}>
      <p className="mb-4 text-sm text-gray-500">{label}</p>

      {existingEntry ? (
        <div className="space-y-4">
          <p className="rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-700">
            Você já registrou <strong>{existingEntry.horas_cadastradas_dia}h</strong> neste dia. Ainda
            não é possível editar um registro existente.
          </p>
          <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
            Fechar
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Input
            type="number"
            step="0.5"
            min="0"
            max="24"
            placeholder="Quantidade de horas"
            className="text-center"
            error={errors.horas?.message}
            {...register('horas')}
          />
          <Button type="submit" variant="secondary" fullWidth loading={submitting}>
            Concluir
          </Button>
        </form>
      )}
    </Modal>
  )
}
