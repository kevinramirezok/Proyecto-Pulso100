import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import LayoutUsuario from './components/layout/LayoutUsuario';
import LayoutEntrenadora from './components/layout/LayoutEntrenadora';
import LayoutAdmin from './components/layout/LayoutAdmin';
import HomeUsuario from './pages/usuario/Home';
import Rutinas from './pages/usuario/Rutinas';
import DashboardEntrenadora from './pages/entrenadora/Dashboard';
import DashboardAdmin from './pages/admin/Dashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/usuario/*" element={
          <ProtectedRoute>
            <LayoutUsuario>
              <Routes>
                <Route path="home" element={<HomeUsuario />} />
                <Route path="calendario" element={<div className="text-white">Calendario (próximamente)</div>} />
                <Route path="rutinas" element={<Rutinas />} />
                <Route path="progreso" element={<div className="text-white">Progreso (próximamente)</div>} />
                <Route path="perfil" element={<div className="text-white">Perfil (próximamente)</div>} />
              </Routes>
            </LayoutUsuario>
          </ProtectedRoute>
        } />

        <Route path="/entrenadora/*" element={
          <ProtectedRoute>
            <LayoutEntrenadora>
              <Routes>
                <Route path="dashboard" element={<DashboardEntrenadora />} />
                <Route path="calendario" element={<div className="text-white">Calendario (próximamente)</div>} />
                <Route path="usuarios" element={<div className="text-white">Usuarios (próximamente)</div>} />
                <Route path="crear" element={<div className="text-white">Crear Rutina (próximamente)</div>} />
                <Route path="perfil" element={<div className="text-white">Perfil (próximamente)</div>} />
              </Routes>
            </LayoutEntrenadora>
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute>
            <LayoutAdmin>
              <Routes>
                <Route path="dashboard" element={<DashboardAdmin />} />
                <Route path="usuarios" element={<div className="text-white">Usuarios (próximamente)</div>} />
                <Route path="entrenadores" element={<div className="text-white">Entrenadores (próximamente)</div>} />
                <Route path="config" element={<div className="text-white">Configuración (próximamente)</div>} />
              </Routes>
            </LayoutAdmin>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;