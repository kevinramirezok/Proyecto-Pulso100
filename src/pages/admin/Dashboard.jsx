import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, Calendar, Dumbbell, Settings, TrendingUp, Target } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { scheduledWorkouts } = useSchedule();

  // Stats reales
  const totalCompletados = scheduledWorkouts.filter(w => w.status === 'completed').length;
  const totalPendientes = scheduledWorkouts.filter(w => w.status === 'pending').length;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Hola, {user?.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Salir
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <Card className="flex items-center gap-3">
          <div className="bg-green-500/10 p-3 rounded-lg">
            <Target className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs whitespace-normal break-words sm:text-xs xs:text-[11px]" style={{ fontSize: '12px', whiteSpace: 'normal', wordBreak: 'break-word' }}>Entrenamientos Completados</p>
            <p className="text-white text-2xl font-bold">{totalCompletados}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-yellow-500/10 p-3 rounded-lg">
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs whitespace-normal break-words sm:text-xs xs:text-[11px]" style={{ fontSize: '12px', whiteSpace: 'normal', wordBreak: 'break-word' }}>Entrenamientos Pendientes</p>
            <p className="text-white text-2xl font-bold">{totalPendientes}</p>
          </div>
        </Card>
        <style>{`
          @media (max-width: 400px) {
            .grid {
              grid-template-columns: 1fr !important;
            }
            .text-xs {
              font-size: 11px !important;
            }
          }
        `}</style>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-white font-bold text-lg mb-4">Gestión</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full flex items-center justify-center">
            <Users size={18} className="mr-2" />
            Usuarios
          </Button>
          <Button variant="secondary" className="w-full flex items-center justify-center">
            <Dumbbell size={18} className="mr-2" />
            Rutinas
          </Button>
          <Button variant="secondary" className="w-full flex items-center justify-center">
            <Calendar size={18} className="mr-2" />
            Calendario
          </Button>
          <Button variant="secondary" className="w-full flex items-center justify-center">
            <Settings size={18} className="mr-2" />
            Configuración
          </Button>
        </div>
      </Card>

      {/* Info */}
      <Card className="bg-pulso-rojo/10 border-pulso-rojo/30">
        <p className="text-gray-300 text-sm">
          Desde este panel podés gestionar usuarios, crear rutinas personalizadas y ver el progreso general de la plataforma.
        </p>
      </Card>
    </div>
  );
}