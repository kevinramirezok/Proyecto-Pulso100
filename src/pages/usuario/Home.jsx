import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';
import { useProgress } from '../../hooks/useProgress';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Flame, Clock, Target, TrendingUp, CheckCircle, Calendar, Play, Dumbbell, Award } from 'lucide-react';
import { useWorkouts } from '../../context/WorkoutContext';
import { useEntrenamiento } from '../../context/EntrenamientoContext';
import { obtenerHoyLocal } from '../../utils/dateUtils';

export default function Home() {
  const { user } = useAuth();
  const { scheduledWorkouts, loading: scheduleLoading } = useSchedule();
  const { stats, medals } = useProgress();
  const navigate = useNavigate();
  const { iniciarEntrenamiento } = useEntrenamiento();
  const { workouts, loading: workoutsLoading } = useWorkouts();

  // Obtener entrenamientos de hoy pendientes
  const hoy = obtenerHoyLocal();
  const entrenamientosHoy = scheduledWorkouts.filter(w => {
    return w.scheduled_date === hoy && w.status === 'pendiente';
  });
  const proximoEntrenamiento = entrenamientosHoy[0];

  // Formatear fecha de hoy
  const fechaHoyFormateada = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Calcular semana actual - DÍAS ÚNICOS con entrenamientos completados
  const getWeekCompleted = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    const dia = hoy.getDay();
    const diff = dia === 0 ? 6 : dia - 1;
    inicioSemana.setDate(hoy.getDate() - diff);
    const inicioStr = inicioSemana.toISOString().split('T')[0];

    // Obtener fechas únicas de workouts completados esta semana
    const fechasUnicas = new Set(
      scheduledWorkouts
        .filter(w => w.scheduled_date >= inicioStr && w.status === 'completado')
        .map(w => w.scheduled_date)
    );

    return fechasUnicas.size;
  };

  // Loading profesional
  if (workoutsLoading || scheduleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm capitalize">{fechaHoyFormateada}</p>
          <h1 className="text-3xl font-bold text-white mt-1">Hola, {user?.user_metadata?.name || 'Atleta'}! 👋</h1>
        </div>
        <div className="bg-pulso-rojo/10 px-4 py-2 rounded-xl text-center">
          <p className="text-pulso-rojo text-2xl font-bold">{stats.streak}</p>
          <p className="text-gray-400 text-xs">🔥 Racha</p>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-4">
          <div className="bg-pulso-rojo/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Flame className="text-pulso-rojo" size={20} />
          </div>
          <p className="text-white text-xl font-bold">{getWeekCompleted()}</p>
          <p className="text-gray-500 text-xs">Esta semana</p>
        </Card>
        
        <Card className="text-center py-4">
          <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="text-blue-500" size={20} />
          </div>
          <p className="text-white text-xl font-bold">{stats.totalCompleted}</p>
          <p className="text-gray-500 text-xs">Total</p>
        </Card>
        
        <Card className="text-center py-4">
          <div className="bg-green-500/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Dumbbell className="text-green-500" size={20} />
          </div>
          <p className="text-white text-xl font-bold">{workouts.length}</p>
          <p className="text-gray-500 text-xs">Rutinas</p>
        </Card>
      </div>

      {/* Progreso semanal */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Progreso Semanal</h3>
          <span className="text-gray-400 text-sm">{getWeekCompleted()}/6 días</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-pulso-rojo to-orange-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min((getWeekCompleted() / 6) * 100, 100)}%` }}
          ></div>
        </div>
        {getWeekCompleted() >= 6 && (
          <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
            <Award size={14} />
            ¡Objetivo semanal completado!
          </p>
        )}
      </Card>

      {/* Rutina del día */}
      <div>
        <h3 className="text-white font-semibold mb-3">Rutina de Hoy</h3>
        <Card className={proximoEntrenamiento ? 'border-pulso-rojo/30' : ''}>
          {proximoEntrenamiento ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-2">
                    {proximoEntrenamiento.workout?.name || 'Rutina'}
                  </h4>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <Clock size={20} />
                      {proximoEntrenamiento.workout?.duration || 0} min
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">
                      {proximoEntrenamiento.workout?.level || 'Intermedio'}
                    </span>
                  </div>
                </div>
                <Badge variant={proximoEntrenamiento.workout?.category || 'fuerza'}>
                  {proximoEntrenamiento.workout?.category || 'Fuerza'}
                </Badge>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    iniciarEntrenamiento(proximoEntrenamiento, proximoEntrenamiento.id);
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Iniciar
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    completeScheduledWorkout(proximoEntrenamiento.id);
                  }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Completar
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Calendar size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm mb-4">No tenés entrenamientos programados para hoy</p>
              <Button 
                variant="primary"
                onClick={() => navigate('/usuario/rutinas')}
              >
                Ver Rutinas
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Acceso rápido */}
      <div>
        <h3 className="text-white font-semibold mb-3">Acceso Rápido</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="cursor-pointer hover:border-pulso-rojo/50 transition-all"
            onClick={() => navigate('/usuario/rutinas')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-pulso-rojo/10 p-2.5 rounded-xl">
                <Target className="text-pulso-rojo" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Rutinas</p>
                <p className="text-gray-500 text-xs">{workouts.length} disponibles</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-pulso-rojo/50 transition-all"
            onClick={() => navigate('/usuario/calendario')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <Calendar className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Calendario</p>
                <p className="text-gray-500 text-xs">Programar</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-pulso-rojo/50 transition-all"
            onClick={() => navigate('/usuario/progreso')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2.5 rounded-xl">
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Progreso</p>
                <p className="text-gray-500 text-xs">Estadísticas</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-pulso-rojo/50 transition-all"
            onClick={() => navigate('/usuario/perfil')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2.5 rounded-xl">
                  <Award className="text-purple-500" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Medallas</p>
                  <p className="text-gray-500 text-xs">Ver logros</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{medals.length}</p>
                <p className="text-gray-500 text-xs">desbloqueadas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Motivación basada en racha */}
      {stats.streak > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-pulso-rojo/10 border-orange-500/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-white font-semibold">
                {stats.streak >= 7 
                  ? '¡Increíble racha!' 
                  : stats.streak >= 3 
                    ? '¡Vas muy bien!' 
                    : '¡Buen comienzo!'}
              </p>
              <p className="text-gray-400 text-sm">
                {stats.streak} {stats.streak === 1 ? 'día' : 'días'} consecutivos entrenando
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}