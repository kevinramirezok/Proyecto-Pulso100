import { useMemo } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Card from '../../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, Flame, Clock, Target, Award, Dumbbell } from 'lucide-react';
import MedalCard from '../../components/features/MedalCard';

export default function Progreso() {
  const { stats, completedWorkouts, medalsProgress, loading } = useProgress();

  const datosUltimos7Dias = useMemo(() => {
    const dias = [];
    const hoy = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const entrenamientosDia = completedWorkouts.filter(w => {
        return w.completed_date === fechaStr;
      });
      
      const minutos = entrenamientosDia.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);
      
      dias.push({
        dia: fecha.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase(),
        entrenamientos: entrenamientosDia.length,
        minutos,
      });
    }
    
    return dias;
  }, [completedWorkouts]);

  const datosCategorias = useMemo(() => {
    const categorias = {};
    completedWorkouts.forEach(w => {
      const cat = w.workout?.category || 'otro';
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    
    return Object.entries(categorias).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: completedWorkouts.length > 0 ? Math.round((cantidad / completedWorkouts.length) * 100) : 0
    }));
  }, [completedWorkouts]);

  const medallasDesbloqueadas = useMemo(() => {
    return medalsProgress.filter(m => m.isUnlocked);
  }, [medalsProgress]);

  const medallasPendientes = useMemo(() => {
    return medalsProgress.filter(m => !m.isUnlocked).slice(0, 4);
  }, [medalsProgress]);

  const CATEGORY_COLORS = {
    fuerza: 'bg-red-500',
    cardio: 'bg-green-500',
    hiit: 'bg-orange-500',
    flexibilidad: 'bg-purple-500',
    otro: 'bg-gray-500',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-pulso-negro border border-gray-700 rounded-lg p-2 text-sm">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.value} {entry.name}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calcular semana actual
  const getWeekCompleted = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    const dia = hoy.getDay();
    const diff = dia === 0 ? 6 : dia - 1;
    inicioSemana.setDate(hoy.getDate() - diff);
    inicioSemana.setHours(0, 0, 0, 0);
    const inicioStr = inicioSemana.toISOString().split('T')[0];

    return completedWorkouts.filter(w => w.completed_date >= inicioStr).length;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-24 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 bg-gray-800 rounded w-32"></div>
            <div className="h-4 bg-gray-800 rounded w-48"></div>
          </div>
          <div className="bg-gray-800 rounded-xl h-16 w-20"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-900 rounded-xl p-3 space-y-2">
              <div className="h-8 w-8 bg-gray-800 rounded-lg mx-auto"></div>
              <div className="h-6 bg-gray-800 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-gray-800 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Gráfico Skeleton */}
        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          <div className="h-5 bg-gray-800 rounded w-32"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>

        {/* Medallas Skeleton */}
        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          <div className="h-5 bg-gray-800 rounded w-24"></div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Progreso</h1>
          <p className="text-gray-400 text-sm">Tu evolución de entrenamiento</p>
        </div>
        <div className="bg-pulso-rojo/10 px-4 py-2 rounded-xl text-center">
          <p className="text-pulso-rojo text-2xl font-bold">{stats.totalCompleted}</p>
          <p className="text-gray-400 text-xs">Total</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="text-center py-3 px-2">
          <div className="bg-pulso-rojo/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1">
            <Target className="text-pulso-rojo" size={16} />
          </div>
          <p className="text-white text-lg font-bold">{getWeekCompleted()}</p>
          <p className="text-gray-500 text-[10px]">Semana</p>
        </Card>
        
        <Card className="text-center py-3 px-2">
          <div className="bg-orange-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1">
            <span className="text-sm">🔥</span>
          </div>
          <p className="text-white text-lg font-bold">{stats.streak}</p>
          <p className="text-gray-500 text-[10px]">Racha</p>
        </Card>
        
        <Card className="text-center py-3 px-2">
          <div className="bg-blue-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1">
            <Clock className="text-blue-500" size={16} />
          </div>
          <p className="text-white text-lg font-bold">{stats.totalMinutes}</p>
          <p className="text-gray-500 text-[10px]">Minutos</p>
        </Card>
        
        <Card className="text-center py-3 px-2">
          <div className="bg-green-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1">
            <Flame className="text-green-500" size={16} />
          </div>
          <p className="text-white text-lg font-bold">{stats.totalCalories}</p>
          <p className="text-gray-500 text-[10px]">Calorías</p>
        </Card>
      </div>

      {/* Gráfico últimos 7 días */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Últimos 7 días</h3>
          <TrendingUp className="text-pulso-rojo" size={18} />
        </div>
        
        {completedWorkouts.length === 0 ? (
          <div className="text-center py-6">
            <Dumbbell className="mx-auto text-gray-600 mb-2" size={32} />
            <p className="text-gray-500 text-sm">Completá entrenamientos para ver tu progreso</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={datosUltimos7Dias} barSize={20}>
              <XAxis 
                dataKey="dia" 
                stroke="#666" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="entrenamientos" 
                fill="#FF0000" 
                radius={[4, 4, 0, 0]}
                name="entrenos"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Minutos por día */}
      {completedWorkouts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Minutos activos</h3>
            <Clock className="text-blue-500" size={18} />
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={datosUltimos7Dias}>
              <XAxis 
                dataKey="dia" 
                stroke="#666" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="minutos" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.2}
                strokeWidth={2}
                name="min"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Distribución por categoría */}
      {datosCategorias.length > 0 && (
        <Card>
          <h3 className="text-white font-semibold mb-3">Por categoría</h3>
          <div className="space-y-2">
            {datosCategorias.map(({ nombre, cantidad, porcentaje }) => (
              <div key={nombre}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[nombre] || 'bg-gray-500'}`} />
                    <span className="text-white text-sm capitalize">{nombre}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{cantidad}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${CATEGORY_COLORS[nombre] || 'bg-gray-500'}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Medallas */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Medallas</h3>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
            {medallasDesbloqueadas.length}/{medalsProgress.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {medalsProgress.slice(0, 6).map(medal => (
            <MedalCard
              key={medal.id}
              medal={medal}
              unlocked={medal.isUnlocked}
              progress={medal.percentage}
              compact
            />
          ))}
        </div>
        {medalsProgress.length > 6 && (
          <p className="text-center text-gray-500 text-xs mt-3">
            +{medalsProgress.length - 6} medallas más
          </p>
        )}
      </Card>

      {/* Racha motivacional */}
      {stats.streak > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-pulso-rojo/10 border-orange-500/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-white font-semibold">
                {stats.streak >= 7 ? '¡Racha increíble!' : stats.streak >= 3 ? '¡Seguí así!' : '¡Buen comienzo!'}
              </p>
              <p className="text-gray-400 text-sm">
                {stats.streak} {stats.streak === 1 ? 'día' : 'días'} consecutivos
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}