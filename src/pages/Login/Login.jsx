import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema } from '../../utils/validators'
import { getApiErrorMessage } from '../../services/api'
import { getCompany } from '../../services/companyService'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      await login(values)
      // A Home depende de dados da empresa; se ainda não houver, manda para o cadastro dela.
      const company = await getCompany()
      navigate(company ? '/home' : '/cadastro-empresa')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Dados de acesso inválidos.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Login"
      titleAlign="center"
      illustration={<img src="/login.svg" alt="Ilustração de login" className="h-full w-full" />}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome ou Matricula:"
          error={errors.matricula?.message}
          {...register('matricula')}
        />
        <Input
          label="Senha:"
          type="password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <div className="flex justify-center pt-1">
          <Button type="submit" variant="primary" loading={submitting}>
            Login
          </Button>
        </div>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        ou
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <Link to="/cadastro">
          <Button type="button" variant="secondary">
            Cadastrar
          </Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
