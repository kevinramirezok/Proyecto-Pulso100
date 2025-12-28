import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const CATEGORY_COLORS = {
  bicicleta: 'bg-blue-500',
  running: 'bg-green-500',
  fuerza: 'bg-red-500',
  natacion: 'bg-cyan-500',
  otro: 'bg-gray-500',
};

export default function CalendarioCustom({ scheduledWorkouts, onDayClick }) {
  const [mesActual, setMesActual] = useState(new Date());

  const getDiasDelMes = (fecha) => {
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasAnteriores = primerDia.getDay();
    
    const dias = [];
    
    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const dia = new Date(year, month, -i);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(year, month, i);
      dias.push({ fecha: dia, esMesActual: true });
    }
    
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(year, month + 1, i);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    return dias;
  };

  const getWorkoutsDelDia = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    return scheduledWorkouts.filter(
      sw => sw.scheduled_date === fechaStr
    );
  };

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esPasado = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  };

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const dias = getDiasDelMes(mesActual);

  return (
    <div className="bg-pulso-negroSec rounded-2xl p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <button
          onClick={() => cambiarMes(-1)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-base sm:text-lg font-bold text-white">
          {MESES[mesActual.getMonth()]} <span className="text-gray-500 font-normal">{mesActual.getFullYear()}</span>
        </h3>
        
        <button
          onClick={() => cambiarMes(1)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-[1px] sm:gap-1 mb-1 sm:mb-2">
        {DIAS_SEMANA.map((dia, i) => (
          <div 
            key={i} 
            className={`text-center text-[11px] sm:text-xs font-medium py-1.5 sm:py-2 ${
              i === 0 ? 'text-red-400' : 'text-gray-500'
            }`}
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-[1px] sm:gap-1">
        {dias.map(({ fecha, esMesActual }, index) => {
          const workouts = getWorkoutsDelDia(fecha);
          const tieneWorkouts = workouts.length > 0;
          const todosCompletados = tieneWorkouts && workouts.every(w => w.status === 'completed');
          const algunoPendiente = tieneWorkouts && workouts.some(w => w.status === 'pending');
          const esDomingo = fecha.getDay() === 0;
          const pasado = esPasado(fecha);

          return (
            <button
              key={index}
              onClick={() => esMesActual && onDayClick(fecha, workouts)}
              disabled={!esMesActual}
              className={`
                aspect-square p-0.5 sm:p-1 rounded-xl transition-all relative
                flex flex-col items-center justify-center
                ${!esMesActual 
                  ? 'opacity-20 cursor-default' 
                  : 'hover:bg-gray-800 cursor-pointer active:scale-95'
                }
                ${esHoy(fecha) && esMesActual 
                  ? 'bg-pulso-rojo/20 ring-2 ring-pulso-rojo' 
                  : ''
                }
                ${tieneWorkouts && esMesActual && !esHoy(fecha)
                  ? todosCompletados 
                    ? 'bg-green-500/10' 
                    : 'bg-gray-800/50'
                  : ''
                }
              `}
            >
              {/* Número del día */}
              <span className={`
                text-[11px] sm:text-xs font-medium
                ${!esMesActual 
                  ? 'text-gray-600' 
                  : esHoy(fecha) 
                    ? 'text-pulso-rojo font-bold' 
                    : esDomingo 
                      ? 'text-red-400' 
                      : pasado 
                        ? 'text-gray-500' 
                        : 'text-white'
                }
              `}>
                {fecha.getDate()}
              </span>

              {/* Indicadores */}
              {tieneWorkouts && esMesActual && (
                <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-[1.5px] sm:gap-0.5">
                  {todosCompletados ? (
                    <div className="bg-green-500 rounded-full p-[2px] sm:p-0.5">
                      <Check size={7} className="text-white" />
                    </div>
                  ) : (
                    <>
                      {workouts.slice(0, 3).map((workout, i) => (
                        <div
                          key={i}
                          className={`
                            w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 rounded-full
                            ${workout.status === 'completed' ? 'opacity-50' : ''}
                            ${CATEGORY_COLORS[workout.workout?.category] || 'bg-gray-500'}
                          `}
                        />
                      ))}
                      {workouts.length > 3 && (
                        <span className="text-[8px] text-gray-400 ml-0.5">+{workouts.length - 3}</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      {/* Leyenda */}
      <div className="flex items-center justify-center gap-[2px] sm:gap-3 mt-1 pt-1 border-t border-gray-800 flex-wrap">
        <div className="flex items-center gap-[1.5px]">
          <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-red-500"></div>
          <span className="text-gray-500 text-[8px] sm:text-xs">Fuerza</span>
        </div>
        <div className="flex items-center gap-[1.5px]">
          <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
          <span className="text-gray-500 text-[8px] sm:text-xs">Running</span>
        </div>
        <div className="flex items-center gap-[1.5px]">
          <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
          <span className="text-gray-500 text-[8px] sm:text-xs">Bici</span>
        </div>
        <div className="flex items-center gap-[1.5px]">
          <div className="bg-green-500 rounded-full p-[1px] sm:p-0.5">
            <Check size={5} className="text-white" />
          </div>
          <span className="text-gray-500 text-[8px] sm:text-xs">Hecho</span>
        </div>
      </div>
    </div>
  );
}