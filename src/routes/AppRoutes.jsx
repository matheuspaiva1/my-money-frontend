import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { Cadastro } from '../pages/Cadastro/Cadastro'
import { Login } from '../pages/Login/Login'
import { CadastroEmpresa } from '../pages/CadastroEmpresa/CadastroEmpresa'
import { Home } from '../pages/Home/Home'
import { useAuth } from '../hooks/useAuth'

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
        <Route path="/home" element={<Home />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />}
      />
    </Routes>
  )
}
