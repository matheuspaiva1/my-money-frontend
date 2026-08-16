import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import CadastroPage from '../features/auth/CadastroPage';
import LoginPage from '../features/auth/LoginPage';
import CadastroEmpresaPage from '../features/company/CadastroEmpresaPage';
import HomePage from '../features/hours/HomePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/cadastro-empresa" element={<CadastroEmpresaPage />} />
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
