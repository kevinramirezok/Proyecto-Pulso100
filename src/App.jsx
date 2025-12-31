import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import UsuariosAdmin from './pages/admin/Usuarios';
import { useAuth } from './context/AuthContext';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { EntrenamientoProvider, useEntrenamiento } from './context/EntrenamientoContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { useProgress } from './hooks/useProgress';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import EntrenamientoActivo from './components/features/EntrenamientoActivo';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import LayoutUsuario from './components/layout/LayoutUsuario';
import LayoutAdmin from './components/layout/LayoutAdmin';
import HomeUsuario from './pages/usuario/Home';
import Rutinas from './pages/usuario/Rutinas';
import DashboardAdmin from './pages/admin/Dashboard';
import EjerciciosAdmin from './pages/admin/Ejercicios';
import RutinasAdmin from './pages/admin/RutinasAdmin';
import Calendario from './pages/usuario/Calendario';
import Progreso from './pages/usuario/Progreso';
import Perfil from './pages/usuario/Perfil';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pulso-negro">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Verificar rol si es requerido
  if (requiredRole && role !== requiredRole) {
    const redirectPath = role === 'admin' ? '/admin/dashboard' : '/usuario/home';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
}

function AuthRedirect() {
  const { isAuthenticated, loading, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/usuario/home';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, role, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pulso-negro">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  
  return <Login />;
}

function EntrenamientoActivoGlobal() {
  const { entrenamientoActivo, scheduledWorkoutId, detenerEntrenamiento } = useEntrenamiento();
  const { refreshSchedule } = useSchedule();
  const { refreshProgress } = useProgress();

  if (!entrenamientoActivo) return null;

  return (
    <EntrenamientoActivo
      workout={entrenamientoActivo}
      scheduledWorkoutId={scheduledWorkoutId}
      onCancel={detenerEntrenamiento}
      onComplete={async (data) => {
        // Refrescar los workouts agendados y progreso (medallas, stats)
        await Promise.all([
          refreshSchedule(),
          refreshProgress()
        ]);
        // Cerrar el modal
        detenerEntrenamiento();
      }}
    />
  );
}

function App() {
  return (
    <ScheduleProvider>
      <EntrenamientoProvider>
        <WorkoutProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Rutas de usuario */}
              <Route path="/usuario/*" element={
                <ProtectedRoute requiredRole="usuario">
                  <LayoutUsuario>
                    <Routes>
                      <Route path="home" element={<HomeUsuario />} />
                      <Route path="calendario" element={<Calendario />} />
                      <Route path="rutinas" element={<Rutinas />} />
                      <Route path="progreso" element={<Progreso />} />
                      <Route path="perfil" element={<Perfil />} />
                    </Routes>
                  </LayoutUsuario>
                </ProtectedRoute>
              } />
              
              {/* Rutas de admin */}
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <LayoutAdmin>
                    <Routes>
                      <Route path="dashboard" element={<DashboardAdmin />} />
                      <Route path="ejercicios" element={<EjerciciosAdmin />} />
                      <Route path="usuarios" element={<UsuariosAdmin />} />
                      <Route path="rutinas" element={<RutinasAdmin />} />
                      <Route path="calendario" element={<div className="text-white">Calendario General (próximamente)</div>} />
                      <Route path="config" element={<div className="text-white">Configuración (próximamente)</div>} />
                    </Routes>
                  </LayoutAdmin>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
          <EntrenamientoActivoGlobal />
          <Toaster 
            position="top-right" 
            expand={true}
            richColors
            closeButton
            theme="dark"
          />
        </WorkoutProvider>
      </EntrenamientoProvider>
    </ScheduleProvider>
  );
}

export default App;