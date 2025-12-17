import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Play, Pause, Clock, Flame, CheckCircle, X, ChevronRight } from 'lucide-react';

export default function EntrenamientoActivo({ workout, onComplete, onCancel }) {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(true);
  const [ejercicioActual, setEjercicioActual] = useState(0);

  useEffect(() => {
    let intervalo = null;
    if (activo) {
      intervalo = setInterval(() => {
        setSegundos(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [activo]);

  const formatearTiempo = (totalSegundos) => {
    const mins = Math.floor(totalSegundos / 60);
    const segs = totalSegundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const ejercicios = workout.exercises || [];
  const progreso = ejercicios.length > 0 
    ? Math.round((ejercicioActual / ejercicios.length) * 100) 
    : 0;
  
  const ejercicioSiguiente = ejercicios[ejercicioActual];
  const caloriasQuemadas = Math.round((segundos / 60) * 8);

  return (
    <div className="fixed inset-0 bg-pulso-negro z-50 flex flex-col">
      {/* Header */}
      <div className="bg-pulso-negroSec px-4 py-5 border-b border-gray-800 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl truncate">{workout.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={workout.category}>{workout.category}</Badge>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-400 text-sm">{workout.level || 'Intermedio'}</span>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors ml-2"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Timer Central */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pulso-negroSec/50 to-transparent">
        {/* Timer */}
        <div className="relative mb-6">
          <div className="text-7xl sm:text-8xl font-bold text-white font-mono tracking-wider">
            {formatearTiempo(segundos)}
          </div>
          {!activo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-pulso-rojo text-lg font-medium animate-pulse">PAUSADO</span>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-8 text-gray-400 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Clock size={16} className="text-blue-400" />
              <span className="text-white font-semibold">{workout.duration}</span>
            </div>
            <span className="text-xs text-gray-500">min meta</span>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Flame size={16} className="text-orange-500" />
              <span className="text-white font-semibold">{caloriasQuemadas}</span>
            </div>
            <span className="text-xs text-gray-500">kcal</span>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-white font-semibold">{ejercicioActual}/{ejercicios.length}</span>
            </div>
            <span className="text-xs text-gray-500">ejercicios</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivo(!activo)}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all
              ${activo 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-pulso-rojo text-white hover:bg-pulso-rojo/80'
              }
            `}
          >
            {activo ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => onComplete(segundos)}
            className="px-8 h-14"
          >
            <CheckCircle size={20} className="mr-2" />
            Finalizar
          </Button>
        </div>
      </div>

      {/* Ejercicios */}
      {ejercicios.length > 0 && (
        <div className="bg-pulso-negroSec border-t border-gray-800 max-h-[45vh] flex flex-col">
          {/* Header ejercicios */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Ejercicios</h3>
              <span className="text-sm text-gray-400">{ejercicioActual} de {ejercicios.length}</span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-pulso-rojo to-orange-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          {/* Lista de ejercicios */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {ejercicios.map((ejercicio, index) => {
              const isCompleted = index < ejercicioActual;
              const isCurrent = index === ejercicioActual;
              const isPending = index > ejercicioActual;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (index <= ejercicioActual) {
                      setEjercicioActual(index + 1);
                    }
                  }}
                  className={`
                    p-3 rounded-xl transition-all cursor-pointer
                    ${isCompleted 
                      ? 'bg-green-500/10 border border-green-500/20 opacity-60' 
                      : isCurrent 
                        ? 'bg-pulso-rojo/10 border-2 border-pulso-rojo/50 scale-[1.02]' 
                        : 'bg-gray-800/30 border border-gray-800 opacity-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Indicador */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                          ? 'bg-pulso-rojo text-white' 
                          : 'bg-gray-700 text-gray-400'
                      }
                    `}>
                      {isCompleted ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        isCompleted ? 'text-green-400' : isCurrent ? 'text-white' : 'text-gray-400'
                      }`}>
                        {ejercicio.name}
                      </p>
                      <p className="text-gray-500 text-xs">{ejercicio.reps}</p>
                    </div>

                    {/* Acción */}
                    {isCurrent && (
                      <ChevronRight className="text-pulso-rojo" size={20} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}