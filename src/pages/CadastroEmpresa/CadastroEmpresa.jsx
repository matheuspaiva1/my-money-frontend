import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Input } from '../../components/common/Input'
import { TextArea } from '../../components/common/TextArea'
import { RadioGroup } from '../../components/common/RadioGroup'
import { Button } from '../../components/common/Button'
import { empresaSchema } from '../../utils/validators'
import { createCompany, getCompany } from '../../services/companyService'
import { getApiErrorMessage } from '../../services/api'

export function CadastroEmpresa() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existingCompany, setExistingCompany] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(empresaSchema), defaultValues: { transporte: 'nao' } })

  const illustration = (
    <img src="/cad_empresa.svg" alt="Ilustração de cadastro de empresa" className="h-full w-full" />
  )

  useEffect(() => {
    let active = true
    getCompany()
      .then((company) => {
        if (active) setExistingCompany(company)
      })
      .catch(() => toast.error('Não foi possível carregar os dados da empresa.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      await createCompany({
        nome_empresa: values.nome_empresa,
        observacoes: values.observacoes,
        transporte: values.transporte === 'sim',
      })
      toast.success('Dados da empresa salvos!')
      navigate('/home')
    } catch (error) {
      const status = error.response?.status
      const message = getApiErrorMessage(error, 'Não foi possível salvar os dados da empresa.')
      toast.error(message)
      if (status === 409) navigate('/home')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AuthLayout title="Fale um pouco sobre sua empresa" illustration={illustration}>
        <p className="text-sm text-gray-400">Carregando...</p>
      </AuthLayout>
    )
  }

  if (existingCompany) {
    return (
      <AuthLayout title="Sua empresa" illustration={illustration}>
        <div className="space-y-3 text-left text-sm text-gray-700">
          <p>
            <strong>Nome:</strong> {existingCompany.nome_empresa}
          </p>
          {existingCompany.observacoes && (
            <p>
              <strong>Atividades:</strong> {existingCompany.observacoes}
            </p>
          )}
          <p>
            <strong>Vale transporte:</strong> {existingCompany.transporte ? 'Sim' : 'Não'}
          </p>
          <div className="flex justify-center pt-1">
            <Button type="button" onClick={() => navigate('/home')}>
              Ir para a Home
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Fale um pouco sobre sua empresa" illustration={illustration}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome da empresa:"
          error={errors.nome_empresa?.message}
          {...register('nome_empresa')}
        />
        <TextArea
          label="Fala um pouco sobre o que você faz:"
          rows={5}
          error={errors.observacoes?.message}
          {...register('observacoes')}
        />
        <RadioGroup
          label="A empresa oferece vale transporte?"
          name="transporte"
          register={register}
          error={errors.transporte?.message}
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
        />
        <div className="flex justify-center pt-1">
          <Button type="submit" variant="primary" loading={submitting}>
            Enviar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
