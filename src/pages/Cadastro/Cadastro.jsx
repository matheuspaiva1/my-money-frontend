import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { cadastroSchema } from '../../utils/validators'
import { getApiErrorMessage } from '../../services/api'

export function Cadastro() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(cadastroSchema) })

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      await registerUser(values)
      toast.success('Conta criada com sucesso!')
      navigate('/cadastro-empresa')
    } catch (error) {
      const status = error.response?.status
      const message = getApiErrorMessage(error, 'Não foi possível concluir o cadastro.')
      if (status === 409) {
        setError('matricula', { message })
      } else {
        toast.error(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crie seu usuário"
      illustration={<img src="/cadastro.svg" alt="Ilustração de cadastro" className="h-full w-full" />}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nome:" error={errors.nome?.message} {...register('nome')} />
        <Input label="Matricula:" error={errors.matricula?.message} {...register('matricula')} />
        <Input
          label="Senha:"
          type="password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <div className="flex justify-center pt-1">
          <Button type="submit" variant="primary" loading={submitting}>
            Cadastrar
          </Button>
        </div>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        ou
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <Link to="/login">
          <Button type="button" variant="secondary">
            Login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
