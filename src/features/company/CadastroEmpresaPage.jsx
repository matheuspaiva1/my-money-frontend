import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AuthLayout from '../../components/AuthLayout';
import PrototypeIllustration from '../../components/PrototypeIllustration';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import RadioGroup from '../../components/RadioGroup';
import Button from '../../components/Button';
import { companySchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errorMessage';
import { createCompany, getCompany } from '../../services/companyService';

// US03 — Cadastro da empresa: nome_empresa, observacoes, transporte.
// A API não expõe edição de empresa, então a tela funciona em dois modos:
// consulta (200 já tem empresa) ou cadastro (404 ainda não tem).
export default function CadastroEmpresaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState('');

  const companyQuery = useQuery({ queryKey: ['company'], queryFn: getCompany, retry: false });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: { nome_empresa: '', observacoes: '', transporte: false },
  });

  async function onSubmit(values) {
    setSubmitError('');
    try {
      await createCompany(values);
      toast.success('Empresa cadastrada com sucesso!');
      await queryClient.invalidateQueries({ queryKey: ['company'] });
      navigate('/', { replace: true });
    } catch (error) {
      if (error.response?.status === 409) {
        // "Aluno já tem empresa": não mostra erro cru, redireciona pra consulta.
        await queryClient.invalidateQueries({ queryKey: ['company'] });
        navigate('/', { replace: true });
        return;
      }
      setSubmitError(getErrorMessage(error));
    }
  }

  if (companyQuery.isLoading) {
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
        <Button variant="primary" fullWidth={false} className="px-6" onClick={() => companyQuery.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const companyIllustration = (
    <PrototypeIllustration src="/img_emp.svg" alt="Ilustração da tela de cadastro da empresa" />
  );

  if (companyQuery.isSuccess) {
    const company = companyQuery.data;
    return (
      <AuthLayout title="Sua empresa" illustration={companyIllustration}>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-ink">Nome da empresa:</p>
            <p className="text-sm text-muted">{company.nome_empresa}</p>
          </div>
          {company.observacoes && (
            <div>
              <p className="text-sm font-semibold text-ink">Fala um pouco sobre o que você faz:</p>
              <p className="whitespace-pre-line text-sm text-muted">{company.observacoes}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-ink">A empresa oferece vale transporte?</p>
            <p className="text-sm text-muted">{company.transporte ? 'Sim' : 'Não'}</p>
          </div>
          <Button variant="primary" fullWidth={false} className="px-8" onClick={() => navigate('/')}>
            Ir para a Home
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Fale um pouco sobre sua empresa" illustration={companyIllustration}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="Nome da empresa:"
          {...register('nome_empresa')}
          error={errors.nome_empresa?.message}
        />
        <TextArea
          label="Fala um pouco sobre o que você faz:"
          rows={5}
          {...register('observacoes')}
          error={errors.observacoes?.message}
        />
        <Controller
          control={control}
          name="transporte"
          render={({ field }) => (
            <RadioGroup
              label="A empresa oferece vale transporte?"
              name="transporte"
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: 'Sim', value: true },
                { label: 'Não', value: false },
              ]}
            />
          )}
        />

        {submitError && <p className="text-sm text-danger">{submitError}</p>}

        <Button type="submit" variant="primary" fullWidth={false} className="px-10" loading={isSubmitting}>
          Enviar
        </Button>
      </form>
    </AuthLayout>
  );
}
