import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { EntrenamientoProvider, useEntrenamiento } from './context/EntrenamientoContext';
import EntrenamientoActivo from './components/features/EntrenamientoActivo';
import Login from './pages/auth/Login';
import LayoutUsuario from './components/layout/LayoutUsuario';
import LayoutAdmin from './components/layout/LayoutAdmin';
import HomeUsuario from './pages/usuario/Home';
import Rutinas from './pages/usuario/Rutinas';
import DashboardAdmin from './pages/admin/Dashboard';
import Calendario from './pages/usuario/Calendario';
import Progreso from './pages/usuario/Progreso';
import Perfil from './pages/usuario/Perfil';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/usuario/*" element={
              <ProtectedRoute>
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
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <Routes>
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    <Route path="usuarios" element={<div className="text-white">Mis Usuarios (próximamente)</div>} />
                    <Route path="rutinas" element={<div className="text-white">Gestionar Rutinas (próximamente)</div>} />
                    <Route path="calendario" element={<div className="text-white">Calendario General (próximamente)</div>} />
                    <Route path="config" element={<div className="text-white">Configuración (próximamente)</div>} />
                  </Routes>
                </LayoutAdmin>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
        <EntrenamientoActivoGlobal />
      </EntrenamientoProvider>
    </ScheduleProvider>
  );
}

export default App;