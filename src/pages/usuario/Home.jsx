import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Flame, Clock, Target, TrendingUp, CheckCircle, Calendar, Play } from 'lucide-react';
import { WORKOUTS } from '../../data/mockWorkouts';
import { useEntrenamiento } from '../../context/EntrenamientoContext';

export default function Home() {
  const { user, logout } = useAuth();
  const { scheduledWorkouts, completeScheduledWorkout, getStreak, getTotalCompleted, getWeekCompleted } = useSchedule();
  const navigate = useNavigate();
  const { iniciarEntrenamiento } = useEntrenamiento();

  // Obtener entrenamientos de hoy pendientes
  const hoy = new Date();
  const entrenamientosHoy = scheduledWorkouts.filter(w => {
    const fechaWorkout = new Date(w.scheduledDate);
    return fechaWorkout.toDateString() === hoy.toDateString() && w.status === 'pending';
  });
  const proximoEntrenamiento = entrenamientosHoy[0];

  // Formatear fecha de hoy
  const fechaHoyFormateada = hoy.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="min-h-screen relative">
      {/* Fondo con overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/logo-runner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pulso-negro/95 via-pulso-negro/85 to-pulso-negro/95"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 space-y-6 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, {user?.name}! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Listo para entrenar hoy?</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex items-center gap-3 backdrop-blur-sm bg-pulso-negroSec/80">
            <div className="bg-pulso-rojo/10 p-3 rounded-lg">
              <Flame className="text-pulso-rojo" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Esta Semana</p>
              <p className="text-white text-2xl font-bold">{getWeekCompleted()}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 backdrop-blur-sm bg-pulso-negroSec/80">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Clock className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-white text-2xl font-bold">{getTotalCompleted()}</p>
            </div>
          </Card>
        </div>

        {/* Racha */}
        <Card className="backdrop-blur-sm bg-pulso-negroSec/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-3 rounded-lg">
                <span className="text-3xl">🔥</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Racha Actual</p>
                 <p className="text-white text-2xl font-bold">{getStreak()} {getStreak() === 1 ? 'día' : 'días'}</p>
              </div>
            </div>
            {getStreak() >= 7 && (
              <div className="bg-orange-500/20 px-3 py-1 rounded-full">
                <span className="text-orange-500 text-sm font-bold">🏆 ¡Increíble!</span>
              </div>
            )}
          </div>
          {getStreak() === 0 && (
            <p className="text-gray-500 text-sm mt-3">¡Completá un entrenamiento hoy para iniciar tu racha!</p>
          )}
        </Card>

        {/* Rutina del día */}
        <Card className="backdrop-blur-sm bg-pulso-negroSec/80">
          {proximoEntrenamiento ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Rutina de Hoy</h3>
                  <p className="text-gray-400 text-sm capitalize">{fechaHoyFormateada}</p>
                </div>
                <Badge variant={proximoEntrenamiento.workoutCategory}>
                  {proximoEntrenamiento.workoutCategory}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Target size={16} />
                  <span>{proximoEntrenamiento.workoutName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Clock size={16} />
                  <span>{proximoEntrenamiento.workoutDuration} minutos</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    const rutinaCompleta = WORKOUTS.find(w => w.name === proximoEntrenamiento.workoutName) || {
                      ...proximoEntrenamiento,
                      name: proximoEntrenamiento.workoutName,
                      category: proximoEntrenamiento.workoutCategory,
                      duration: proximoEntrenamiento.workoutDuration,
                      exercises: []
                    };
                    iniciarEntrenamiento(rutinaCompleta, proximoEntrenamiento.id);
                  }}
                >
                  <Play size={20} className="mr-2" />
                  Iniciar Entrenamiento
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      completeScheduledWorkout(proximoEntrenamiento.id);
                      alert('¡Entrenamiento completado! 🎉');
                    }}
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Completar
                  </Button>
                  <Button 
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/usuario/rutinas')}
                  >
                    Ver Rutinas
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-6">
                <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Sin entrenamientos hoy</h3>
                <p className="text-gray-400 text-sm mb-4">¡Programá una rutina para hoy!</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/usuario/rutinas')}
                >
                  Ver Rutinas
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Progreso Semanal */}
        <Card className="backdrop-blur-sm bg-pulso-negroSec/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Progreso Semanal</h3>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Entrenamientos completados</span>
              <span className="text-white font-bold">{getWeekCompleted()}/6</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-pulso-rojo h-2 rounded-full transition-all" 
                style={{ width: `${Math.min((getWeekCompleted() / 6) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}