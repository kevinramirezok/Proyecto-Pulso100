import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function MiniCalendario({ onSelectDate, selectedDate, minDate = new Date() }) {
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

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esFechaPasada = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  };

  const esSeleccionada = (fecha) => {
    if (!selectedDate) return false;
    return fecha.toDateString() === new Date(selectedDate).toDateString();
  };

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const dias = getDiasDelMes(mesActual);

  return (
    <div className="bg-pulso-negro rounded-xl p-4">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => cambiarMes(-1)}
          className="p-2 hover:bg-pulso-rojo/10 rounded-lg transition-colors text-gray-400 hover:text-pulso-rojo"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-lg font-bold text-white">
          {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
        </h3>
        
        <button
          onClick={() => cambiarMes(1)}
          className="p-2 hover:bg-pulso-rojo/10 rounded-lg transition-colors text-gray-400 hover:text-pulso-rojo"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map(dia => (
          <div key={dia} className="text-center text-xs font-bold text-gray-500 py-1">
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map(({ fecha, esMesActual }, index) => {
          const pasada = esFechaPasada(fecha);
          const seleccionada = esSeleccionada(fecha);
          const hoy = esHoy(fecha);

          return (
            <button
              key={index}
              disabled={!esMesActual || pasada}
              onClick={() => esMesActual && !pasada && onSelectDate(fecha)}
              className={`
                h-10 w-full rounded-lg text-sm font-medium transition-all
                ${!esMesActual || pasada 
                  ? 'text-gray-700 cursor-not-allowed' 
                  : 'hover:bg-pulso-rojo/20 cursor-pointer'
                }
                ${seleccionada 
                  ? 'bg-pulso-rojo text-white' 
                  : ''
                }
                ${hoy && !seleccionada && esMesActual
                  ? 'ring-2 ring-pulso-rojo text-pulso-rojo' 
                  : ''
                }
                ${esMesActual && !pasada && !seleccionada && !hoy
                  ? 'text-white'
                  : ''
                }
              `}
            >
              {fecha.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
