import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';
import { MEDALS } from '../../data/medals';
import Card from '../../components/ui/Card';
import MedalCard from '../../components/features/MedalCard';
import { 
  User, Mail, Calendar, Award, TrendingUp, Clock, 
  Flame, Target, LogOut, Settings, ChevronRight, Edit
} from 'lucide-react';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { 
    scheduledWorkouts, 
    getStreak, 
    getTotalCompleted, 
    getWeekCompleted 
  } = useSchedule();

  // Calcular estadísticas
  const completados = scheduledWorkouts.filter(w => w.status === 'completed');
  const totalMinutos = completados.reduce((acc, w) => acc + (w.workoutDuration || 0), 0);
  const totalCalorias = totalMinutos * 10;
  const categorias = new Set(completados.map(w => w.workoutCategory));

  // Stats para medallas
  const statsParaMedallas = {
    totalCompleted: completados.length,
    streak: getStreak(),
    weekCompleted: getWeekCompleted(),
    totalCalories: totalCalorias,
    totalMinutes: totalMinutos,
    categoriesUsed: categorias.size,
  };

  // Medallas desbloqueadas
  const medallasDesbloqueadas = MEDALS.filter(medal => medal.condition(statsParaMedallas));

  // Nivel de actividad
  const getNivel = () => {
    const total = getTotalCompleted();
    if (total < 5) return { nombre: 'Principiante', progreso: (total / 5) * 100, siguiente: 5 };
    if (total < 15) return { nombre: 'Intermedio', progreso: ((total - 5) / 10) * 100, siguiente: 15 };
    if (total < 30) return { nombre: 'Avanzado', progreso: ((total - 15) / 15) * 100, siguiente: 30 };
    return { nombre: 'Experto', progreso: 100, siguiente: null };
  };

  const nivel = getNivel();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Perfil</h1>
          <p className="text-gray-400 text-sm">Tu información personal</p>
        </div>
        <div className="bg-yellow-500/10 px-4 py-2 rounded-xl text-center">
          <p className="text-yellow-500 text-2xl font-bold">{medallasDesbloqueadas.length}</p>
          <p className="text-gray-400 text-xs">Medallas</p>
        </div>
      </div>

      {/* Info Usuario */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pulso-rojo/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pulso-rojo to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg truncate">{user?.name || 'Usuario'}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-1 truncate">
              <Mail size={12} />
              {user?.email || 'usuario@pulso100.com'}
            </p>
          </div>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
            <Edit size={18} />
          </button>
        </div>

        {/* Nivel */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Nivel</span>
            <span className="text-white font-medium text-sm">{nivel.nombre}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pulso-rojo to-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${nivel.progreso}%` }}
            />
          </div>
          {nivel.siguiente && (
            <p className="text-gray-500 text-xs mt-1">
              {getTotalCompleted()}/{nivel.siguiente} para siguiente nivel
            </p>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="text-center py-3 px-1">
          <Target className="mx-auto text-pulso-rojo mb-1" size={18} />
          <p className="text-white text-lg font-bold">{getTotalCompleted()}</p>
          <p className="text-gray-500 text-[10px]">Entrenos</p>
        </Card>

        <Card className="text-center py-3 px-1">
          <span className="text-sm block mb-1">🔥</span>
          <p className="text-white text-lg font-bold">{getStreak()}</p>
          <p className="text-gray-500 text-[10px]">Racha</p>
        </Card>

        <Card className="text-center py-3 px-1">
          <Clock className="mx-auto text-blue-500 mb-1" size={18} />
          <p className="text-white text-lg font-bold">{totalMinutos}</p>
          <p className="text-gray-500 text-[10px]">Minutos</p>
        </Card>

        <Card className="text-center py-3 px-1">
          <Flame className="mx-auto text-orange-500 mb-1" size={18} />
          <p className="text-white text-lg font-bold">{totalCalorias >= 1000 ? `${(totalCalorias/1000).toFixed(1)}k` : totalCalorias}</p>
          <p className="text-gray-500 text-[10px]">Calorías</p>
        </Card>
      </div>

      {/* Categorías exploradas */}
      <Card>
        <h3 className="text-white font-semibold mb-3">Categorías exploradas</h3>
        <div className="flex flex-wrap gap-2">
          {['fuerza', 'running', 'bicicleta', 'natacion', 'otro'].map(cat => (
            <div
              key={cat}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium capitalize
                ${categorias.has(cat) 
                  ? 'bg-pulso-rojo/20 text-pulso-rojo border border-pulso-rojo/30' 
                  : 'bg-gray-800 text-gray-600 border border-gray-700'
                }
              `}
            >
              {cat}
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {categorias.size}/5 categorías desbloqueadas
        </p>
      </Card>

      {/* Medallas */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="text-yellow-500" size={18} />
            <h3 className="text-white font-semibold">Todas las Medallas</h3>
          </div>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
            {medallasDesbloqueadas.length}/{MEDALS.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MEDALS.map(medal => (
            <MedalCard
              key={medal.id}
              medal={medal}
              unlocked={medallasDesbloqueadas.some(m => m.id === medal.id)}
              compact
            />
          ))}
        </div>
      </Card>

      {/* Opciones */}
      <Card>
        <h3 className="text-white font-semibold mb-3">Opciones</h3>
        
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Settings className="text-gray-400" size={18} />
              </div>
              <span className="text-white text-sm">Configuración</span>
            </div>
            <ChevronRight className="text-gray-600" size={18} />
          </button>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2 rounded-lg">
                <LogOut className="text-red-500" size={18} />
              </div>
              <span className="text-red-500 text-sm">Cerrar Sesión</span>
            </div>
            <ChevronRight className="text-red-500/50" size={18} />
          </button>
        </div>
      </Card>

      {/* Versión */}
      <p className="text-center text-gray-600 text-xs">
        PULSO 100 v2.0 • Tu límite es el siguiente pulso
      </p>
    </div>
  );
}