import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkouts } from '../../context/WorkoutContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Users, 
  Dumbbell, 
  ClipboardList, 
  Settings, 
  TrendingUp,
  Youtube,
  ChevronRight,
  LogOut,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { workouts, exercises, loading } = useWorkouts();
  const navigate = useNavigate();

  // Estadísticas reales
  const stats = {
    totalExercises: exercises.length,
    exercisesWithVideo: exercises.filter(e => e.video_url).length,
    totalWorkouts: workouts.length,
    totalWorkoutExercises: workouts.reduce((acc, w) => acc + (w.exercises?.length || 0), 0),
    categoryCounts: workouts.reduce((acc, w) => {
      acc[w.category] = (acc[w.category] || 0) + 1;
      return acc;
    }, {}),
    levelCounts: workouts.reduce((acc, w) => {
      acc[w.level] = (acc[w.level] || 0) + 1;
      return acc;
    }, {})
  };

  const menuItems = [
    {
      title: 'Ejercicios',
      description: 'Biblioteca de ejercicios con videos',
      icon: Dumbbell,
      path: '/admin/ejercicios',
      stat: `${stats.totalExercises} ejercicios`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Rutinas',
      description: 'Gestionar rutinas de entrenamiento',
      icon: ClipboardList,
      path: '/admin/rutinas',
      stat: `${stats.totalWorkouts} rutinas`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Usuarios',
      description: 'Ver usuarios registrados',
      icon: Users,
      path: '/admin/usuarios',
      stat: 'Próximamente',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      disabled: true
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Settings,
      path: '/admin/config',
      stat: 'Próximamente',
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      disabled: true
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Panel de Administración</h1>
          <p className="text-gray-400">Bienvenido, {user?.name || 'Admin'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut size={18} className="mr-2" />
          Salir
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Dumbbell className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ejercicios</p>
              <p className="text-white text-2xl font-bold">{stats.totalExercises}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <Youtube size={12} />
              {stats.exercisesWithVideo} con video
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-xl">
              <ClipboardList className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rutinas</p>
              <p className="text-white text-2xl font-bold">{stats.totalWorkouts}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-xl">
              <BarChart3 className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ejercicios en Rutinas</p>
              <p className="text-white text-2xl font-bold">{stats.totalWorkoutExercises}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-xl">
              <TrendingUp className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Promedio por Rutina</p>
              <p className="text-white text-2xl font-bold">
                {stats.totalWorkouts > 0 
                  ? Math.round(stats.totalWorkoutExercises / stats.totalWorkouts) 
                  : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribución por categoría y nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-white font-semibold mb-4">Rutinas por Categoría</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryCounts).length > 0 ? (
              Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-400 capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pulso-rojo rounded-full"
                        style={{ width: `${(count / stats.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay rutinas creadas</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-4">Rutinas por Nivel</h3>
          <div className="space-y-3">
            {Object.entries(stats.levelCounts).length > 0 ? (
              Object.entries(stats.levelCounts).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-gray-400">{level}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(count / stats.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay rutinas creadas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Menú de acciones */}
      <div>
        <h3 className="text-white font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.title}
              className={`cursor-pointer transition-all hover:border-pulso-rojo/50 ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !item.disabled && navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`${item.bgColor} p-3 rounded-xl`}>
                  <item.icon className={item.color} size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-sm">{item.stat}</span>
                  <ChevronRight className="text-gray-600 ml-auto mt-1" size={20} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}