import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import PrototypeIllustration from '../../components/PrototypeIllustration';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { loginSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errorMessage';
import { getCompany } from '../../services/companyService';
import { useAuth } from './useAuth';

// US02 — Login: matrícula e senha, POST /login.
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    setSubmitError('');
    try {
      await login(values);
    } catch (error) {
      // 401: mensagem genérica de credenciais inválidas (a API já não
      // distingue matrícula de senha), sem sair da tela.
      setSubmitError(getErrorMessage(error));
      return;
    }

    // Redireciona para a Home, ou para o cadastro da empresa se GET /company
    // retornar 404 (aluno ainda não tem empresa cadastrada).
    try {
      await getCompany();
      navigate('/', { replace: true });
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/cadastro-empresa', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }

  return (
    <AuthLayout
      title="Login"
      illustration={<PrototypeIllustration src="/img_login.svg" alt="Ilustração da tela de login" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="Nome ou Matricula:"
          autoComplete="username"
          {...register('matricula')}
          error={errors.matricula?.message}
        />
        <Input
          label="Senha:"
          type="password"
          autoComplete="current-password"
          {...register('senha')}
          error={errors.senha?.message}
        />

        {submitError && <p className="text-sm text-danger">{submitError}</p>}

        <Button type="submit" variant="primary" loading={isSubmitting}>
          Login
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="accent" onClick={() => navigate('/cadastro')}>
          Cadastrar
        </Button>
      </form>
    </AuthLayout>
  );
}
