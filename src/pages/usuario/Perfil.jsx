import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  User, Mail, Calendar, Award, TrendingUp, Clock, 
  Flame, Target, LogOut, Settings, ChevronRight 
} from 'lucide-react';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { stats, medals, completedWorkouts } = useProgress();

  // Stats ya vienen del hook useProgress
  const medallasDesbloqueadas = medals;

  // Calcular categorías usadas desde completed workouts
  const categorias = new Set(
    completedWorkouts.map(w => w.workout?.category).filter(Boolean)
  );

  // Fecha de registro (simulada)
  const fechaRegistro = new Date();
  fechaRegistro.setMonth(fechaRegistro.getMonth() - 1);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Perfil</h1>
        <p className="text-gray-400">Tu información y estadísticas</p>
      </div>

      {/* Info Usuario */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pulso-rojo/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-pulso-rojo to-red-700 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl">{user?.name || 'Usuario'}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Mail size={14} />
              {user?.email || 'usuario@pulso100.com'}
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
              <Calendar size={12} />
              Miembro desde {fechaRegistro.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </Card>

      {/* Estadísticas Resumen */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xs:grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <Card className="text-center">
          <Target className="mx-auto text-pulso-rojo mb-2" size={28} />
          <p className="text-2xl font-bold text-white">{stats.totalCompleted}</p>
          <p className="text-gray-400 text-xs">Entrenamientos</p>
        </Card>

        <Card className="text-center">
          <span className="text-2xl block mb-1">🔥</span>
          <p className="text-2xl font-bold text-white">{stats.streak}</p>
          <p className="text-gray-400 text-xs">Días de racha</p>
        </Card>

        <Card className="text-center">
          <Clock className="mx-auto text-blue-500 mb-2" size={28} />
          <p className="text-2xl font-bold text-white">{stats.totalMinutes}</p>
          <p className="text-gray-400 text-xs">Minutos totales</p>
        </Card>

        <Card className="text-center">
          <Flame className="mx-auto text-orange-500 mb-2" size={28} />
          <p className="text-2xl font-bold text-white">{stats.totalCalories.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Calorías quemadas</p>
        </Card>
        <style>{`
          @media (max-width: 400px) {
            .grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>

      {/* Medallas Destacadas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            <h3 className="text-white font-bold">Medallas</h3>
          </div>
          <span className="text-gray-400 text-sm">
            {medallasDesbloqueadas.length}
          </span>
        </div>

        {medallasDesbloqueadas.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {medallasDesbloqueadas.slice(0, 6).map(medal => (
              <div 
                key={medal.id}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 flex items-center gap-2"
                title={medal.description}
              >
                <span className="text-xl">{medal.icon}</span>
                <span className="text-white text-sm font-medium">{medal.name}</span>
              </div>
            ))}
            {medallasDesbloqueadas.length > 6 && (
              <div className="bg-pulso-negro rounded-lg px-3 py-2 flex items-center">
                <span className="text-gray-400 text-sm">+{medallasDesbloqueadas.length - 6} más</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            ¡Completá entrenamientos para desbloquear medallas!
          </p>
        )}
      </Card>

      {/* Progreso General */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500" size={20} />
          <h3 className="text-white font-bold">Tu Progreso</h3>
        </div>

        <div className="space-y-4">
          {/* Barra de nivel */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Nivel de actividad</span>
              <span className="text-white font-medium">
                {stats.totalCompleted < 5 ? 'Principiante' : 
                 stats.totalCompleted < 15 ? 'Intermedio' : 
                 stats.totalCompleted < 30 ? 'Avanzado' : 'Experto'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-pulso-rojo to-orange-500"
                style={{ width: `${Math.min((stats.totalCompleted / 50) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalCompleted}/50 para nivel máximo
            </p>
          </div>

          {/* Categorías usadas */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Categorías exploradas</p>
            <div className="flex flex-wrap gap-2 gap-y-2">
              {['fuerza', 'running', 'bicicleta', 'natacion', 'otro'].map(cat => (
                <div
                  key={cat}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${categorias.has(cat) 
                      ? 'bg-pulso-rojo/20 text-pulso-rojo border border-pulso-rojo/30' 
                      : 'bg-gray-800 text-gray-600'
                    }
                  `}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Opciones */}
      <Card>
        <h3 className="text-white font-bold mb-4">Opciones</h3>
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-pulso-negro transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="text-gray-400" size={20} />
              <span className="text-white">Configuración</span>
            </div>
            <ChevronRight className="text-gray-600" size={20} />
          </button>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="text-red-500" size={20} />
              <span className="text-red-500">Cerrar Sesión</span>
            </div>
            <ChevronRight className="text-red-500/50 group-hover:text-red-500" size={20} />
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
