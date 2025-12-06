import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarioCustom({ scheduledWorkouts, onDayClick }) {
  const [mesActual, setMesActual] = useState(new Date());

  // Obtener días del mes
  const getDiasDelMes = (fecha) => {
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasAnteriores = primerDia.getDay();
    
    const dias = [];
    
    // Días del mes anterior (para completar la primera semana)
    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const dia = new Date(year, month, -i);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(year, month, i);
      dias.push({ fecha: dia, esMesActual: true });
    }
    
    // Días del siguiente mes (para completar la última semana)
    const diasRestantes = 42 - dias.length; // 6 semanas = 42 días
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(year, month + 1, i);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    return dias;
  };

  // Obtener entrenamientos de un día
  const getWorkoutsDelDia = (fecha) => {
    const fechaStr = fecha.toDateString();
    return scheduledWorkouts.filter(
      sw => new Date(sw.scheduledDate).toDateString() === fechaStr
    );
  };

  // Verificar si es hoy
  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  // Cambiar mes
  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const dias = getDiasDelMes(mesActual);

  return (
    <div className="bg-pulso-negroSec rounded-2xl p-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => cambiarMes(-1)}
          className="p-2 hover:bg-pulso-rojo/10 rounded-lg transition-colors text-gray-400 hover:text-pulso-rojo"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h3 className="text-2xl font-bold text-white">
          {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
        </h3>
        
        <button
          onClick={() => cambiarMes(1)}
          className="p-2 hover:bg-pulso-rojo/10 rounded-lg transition-colors text-gray-400 hover:text-pulso-rojo"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DIAS_SEMANA.map(dia => (
          <div key={dia} className="text-center text-sm font-bold text-gray-400 py-2 uppercase">
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map(({ fecha, esMesActual }, index) => {
          const workouts = getWorkoutsDelDia(fecha);
          const tieneWorkouts = workouts.length > 0;
          const todosCompletados = workouts.length > 0 && workouts.every(w => w.status === 'completed');

          return (
            <button
              key={index}
              onClick={() => esMesActual && onDayClick(fecha, workouts)}
              className={`
                min-h-[80px] p-2 rounded-lg transition-all
                flex flex-col items-center justify-start
                ${!esMesActual ? 'opacity-30 cursor-default' : 'hover:bg-pulso-negro/50 cursor-pointer'}
                ${esHoy(fecha) && esMesActual ? 'ring-2 ring-pulso-rojo' : ''}
              `}
            >
              {/* Número del día */}
              <span className={`
                text-sm font-semibold mb-1
                ${!esMesActual ? 'text-gray-600' : esHoy(fecha) ? 'text-pulso-rojo' : 'text-white'}
              `}>
                {fecha.getDate()}
              </span>

              {/* Indicadores de entrenamientos */}
              {tieneWorkouts && esMesActual && (
                <div className="flex flex-wrap gap-1 justify-center w-full">
                  {workouts.slice(0, 3).map((workout, i) => (
                    <div
                      key={i}
                      className={`
                        w-2 h-2 rounded-full
                        ${workout.status === 'completed' ? 'opacity-40' : ''}
                        ${workout.workoutCategory === 'bicicleta' ? 'bg-blue-500' : ''}
                        ${workout.workoutCategory === 'running' ? 'bg-green-500' : ''}
                        ${workout.workoutCategory === 'fuerza' ? 'bg-red-500' : ''}
                        ${workout.workoutCategory === 'natacion' ? 'bg-cyan-500' : ''}
                        ${workout.workoutCategory === 'otro' ? 'bg-gray-500' : ''}
                      `}
                    />
                  ))}
                  {workouts.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{workouts.length - 3}</span>
                  )}
                </div>
              )}

              {/* Checkmark si todos completados */}
              {todosCompletados && esMesActual && (
                <div className="text-green-500 text-xs mt-1">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}