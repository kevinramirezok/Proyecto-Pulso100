import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { EntrenamientoProvider, useEntrenamiento } from './context/EntrenamientoContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { useEffect } from 'react';
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
  
  console.log('🔴 [PROTECTED] Verificando acceso:', { isAuthenticated, loading, role, requiredRole, path: location.pathname });
  
  if (loading) {
    console.log('🔴 [PROTECTED] Loading=true, mostrando pantalla de carga');
    return (
      <div className="min-h-screen flex items-center justify-center bg-pulso-negro">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('🔴 [PROTECTED] No autenticado, redirigiendo a /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Verificar rol si es requerido
  if (requiredRole && role !== requiredRole) {
    const redirectPath = role === 'admin' ? '/admin/dashboard' : '/usuario/home';
    console.log('🔴 [PROTECTED] Rol incorrecto, redirigiendo a:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }
  
  console.log('✅ [PROTECTED] Acceso permitido');
  return children;
}

function AuthRedirect() {
  const { isAuthenticated, loading, role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('🟣 [AUTH_REDIRECT] Estado:', { isAuthenticated, loading, role });
    if (!loading && isAuthenticated) {
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/usuario/home';
      console.log('🟣 [AUTH_REDIRECT] Redirigiendo a:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, role, navigate]);
  
  if (loading) {
    console.log('🟣 [AUTH_REDIRECT] Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-pulso-negro">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  
  console.log('🟣 [AUTH_REDIRECT] Mostrando Login');
  return <Login />;
}

function EntrenamientoActivoGlobal() {
  const { entrenamientoActivo, scheduledWorkoutId, detenerEntrenamiento } = useEntrenamiento();
  const { completeScheduledWorkout, completeWorkoutToday } = useSchedule();

  if (!entrenamientoActivo) return null;

  return (
    <EntrenamientoActivo
      workout={entrenamientoActivo}
      onCancel={detenerEntrenamiento}
      onComplete={(segundos) => {
        if (scheduledWorkoutId) {
          completeScheduledWorkout(scheduledWorkoutId);
        } else {
          completeWorkoutToday(entrenamientoActivo);
        }
        detenerEntrenamiento();
        alert(`¡Entrenamiento completado en ${Math.floor(segundos / 60)}:${(segundos % 60).toString().padStart(2, '0')}! 🎉`);
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
                      <Route path="usuarios" element={<div className="text-white">Mis Usuarios (próximamente)</div>} />
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
        </WorkoutProvider>
      </EntrenamientoProvider>
    </ScheduleProvider>
  );
}

export default App;