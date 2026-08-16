import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/AuthLayout';
import PrototypeIllustration from '../../components/PrototypeIllustration';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { cadastroSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errorMessage';
import { useAuth } from './useAuth';

// US01 — Cadastro: nome, matrícula e senha, POST /users.
export default function CadastroPage() {
  const { register: registerStudent, login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(cadastroSchema) });

  async function onSubmit(values) {
    setSubmitError('');
    try {
      await registerStudent(values);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      return;
    }

    // Cadastro concluído: loga automaticamente para uma UX mais fluida e
    // segue para o cadastro da empresa (a API não retorna token no cadastro).
    try {
      await login({ matricula: values.matricula, senha: values.senha });
      toast.success('Cadastro realizado com sucesso!');
      navigate('/cadastro-empresa', { replace: true });
    } catch {
      toast.success('Cadastro realizado! Faça login para continuar.');
      navigate('/login', { replace: true });
    }
  }

  return (
    <AuthLayout
      title="Crie seu usuário"
      illustration={<PrototypeIllustration src="/img_cad.svg" alt="Ilustração da tela de cadastro" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input label="Nome:" autoComplete="name" {...register('nome')} error={errors.nome?.message} />
        <Input
          label="Matricula:"
          autoComplete="username"
          {...register('matricula')}
          error={errors.matricula?.message}
        />
        <Input
          label="Senha:"
          type="password"
          autoComplete="new-password"
          {...register('senha')}
          error={errors.senha?.message}
        />

        {submitError && <p className="text-sm text-danger">{submitError}</p>}

        <Button type="submit" variant="primary" loading={isSubmitting}>
          Cadastrar
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="accent" onClick={() => navigate('/login')}>
          Login
        </Button>
      </form>
    </AuthLayout>
  );
}
