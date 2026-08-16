import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

// Usuário sem token válido tentando acessar qualquer tela além de
// cadastro/login é redirecionado para o login.
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
