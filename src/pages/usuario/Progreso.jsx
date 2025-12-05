import { useMemo } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import Card from '../../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Flame, Clock, Target, Award } from 'lucide-react';

export default function Progreso() {
  const { scheduledWorkouts, getStreak, getTotalCompleted, getWeekCompleted } = useSchedule();

  // Obtener solo entrenamientos completados
  const completados = useMemo(() => {
    return scheduledWorkouts.filter(w => w.status === 'completed');
  }, [scheduledWorkouts]);

  // Calcular stats generales
  const stats = useMemo(() => {
    const totalMinutos = completados.reduce((acc, w) => acc + (w.workoutDuration || 0), 0);
    const totalCalorias = completados.reduce((acc, w) => {
      // Estimación: 10 cal por minuto promedio
      return acc + ((w.workoutDuration || 0) * 10);
    }, 0);
    
    return {
      totalMinutos,
      totalCalorias,
      promedioMinutos: completados.length > 0 ? Math.round(totalMinutos / completados.length) : 0,
    };
  }, [completados]);

  // Datos para gráfico de últimas 4 semanas
  const datosSemanas = useMemo(() => {
    const semanas = [];
    const hoy = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const inicioSemana = new Date(hoy);
      const diaSemana = inicioSemana.getDay();
      const diasDesdelunes = diaSemana === 0 ? 6 : diaSemana - 1;
      inicioSemana.setDate(hoy.getDate() - diasDesdelunes - (i * 7));
      inicioSemana.setHours(0, 0, 0, 0);
      
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);
      
      const entrenamientosSemana = completados.filter(w => {
        const fecha = new Date(w.completedAt || w.scheduledDate);
        return fecha >= inicioSemana && fecha <= finSemana;
      });
      
      const minutos = entrenamientosSemana.reduce((acc, w) => acc + (w.workoutDuration || 0), 0);
      const calorias = minutos * 10;
      
      semanas.push({
        semana: `Sem ${4 - i}`,
        entrenamientos: entrenamientosSemana.length,
        minutos,
        calorias,
      });
    }
    
    return semanas;
  }, [completados]);

  // Datos para gráfico de últimos 7 días
  const datosUltimos7Dias = useMemo(() => {
    const dias = [];
    const hoy = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      fecha.setHours(0, 0, 0, 0);
      
      const entrenamientosDia = completados.filter(w => {
        const fechaW = new Date(w.completedAt || w.scheduledDate);
        return fechaW.toDateString() === fecha.toDateString();
      });
      
      const minutos = entrenamientosDia.reduce((acc, w) => acc + (w.workoutDuration || 0), 0);
      
      dias.push({
        dia: fecha.toLocaleDateString('es-ES', { weekday: 'short' }),
        entrenamientos: entrenamientosDia.length,
        minutos,
      });
    }
    
    return dias;
  }, [completados]);

  // Distribución por categoría
  const datosCategorias = useMemo(() => {
    const categorias = {};
    completados.forEach(w => {
      const cat = w.workoutCategory || 'otro';
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    
    return Object.entries(categorias).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
  }, [completados]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-pulso-negro border border-gray-700 rounded-lg p-3">
          <p className="text-white font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Progreso</h1>
        <p className="text-gray-400">Tu evolución de entrenamiento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <div className="bg-pulso-rojo/10 p-3 rounded-lg">
            <Target className="text-pulso-rojo" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Esta Semana</p>
            <p className="text-white text-2xl font-bold">{getWeekCompleted()}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-orange-500/10 p-3 rounded-lg">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Racha</p>
            <p className="text-white text-2xl font-bold">{getStreak()} días</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <Clock className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Minutos Totales</p>
            <p className="text-white text-2xl font-bold">{stats.totalMinutos}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-green-500/10 p-3 rounded-lg">
            <Flame className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Calorías Quemadas</p>
            <p className="text-white text-2xl font-bold">{stats.totalCalorias}</p>
          </div>
        </Card>
      </div>

      {/* Gráfico: Entrenamientos últimos 7 días */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Últimos 7 días</h3>
          <TrendingUp className="text-pulso-rojo" size={20} />
        </div>
        
        {completados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos todavía</p>
            <p className="text-gray-600 text-sm">Completá entrenamientos para ver tu progreso</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datosUltimos7Dias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="dia" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="entrenamientos" 
                fill="#FF0000" 
                radius={[4, 4, 0, 0]}
                name="Entrenamientos"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Gráfico: Minutos por semana */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Minutos por Semana</h3>
          <Clock className="text-blue-500" size={20} />
        </div>
        
        {completados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos todavía</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={datosSemanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="semana" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="minutos" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                name="Minutos"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Gráfico: Calorías por semana */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Calorías por Semana</h3>
          <Flame className="text-orange-500" size={20} />
        </div>
        
        {completados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos todavía</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosSemanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="semana" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="calorias" 
                stroke="#F97316" 
                strokeWidth={3}
                dot={{ fill: '#F97316', strokeWidth: 2 }}
                name="Calorías"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Distribución por categoría */}
      {datosCategorias.length > 0 && (
        <Card>
          <h3 className="text-white font-bold text-lg mb-4">Por Categoría</h3>
          <div className="space-y-3">
            {datosCategorias.map(({ nombre, cantidad }) => (
              <div key={nombre} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${nombre === 'fuerza' ? 'bg-red-500' : ''}
                    ${nombre === 'running' ? 'bg-green-500' : ''}
                    ${nombre === 'bicicleta' ? 'bg-blue-500' : ''}
                    ${nombre === 'natacion' ? 'bg-cyan-500' : ''}
                    ${nombre === 'otro' ? 'bg-gray-500' : ''}
                  `} />
                  <span className="text-white capitalize">{nombre}</span>
                </div>
                <span className="text-gray-400">{cantidad} entrenamientos</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resumen */}
      <Card className="bg-gradient-to-r from-pulso-rojo/20 to-transparent border-pulso-rojo/30">
        <div className="flex items-center gap-4">
          <Award className="text-pulso-rojo" size={40} />
          <div>
            <h3 className="text-white font-bold text-lg">Total Completados</h3>
            <p className="text-3xl font-bold text-pulso-rojo">{getTotalCompleted()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
