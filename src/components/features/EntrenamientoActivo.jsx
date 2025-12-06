import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Play, Pause, Square, Clock, Flame, CheckCircle } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 bg-pulso-negro z-50 flex flex-col">
      {/* Header */}
      <div className="bg-pulso-negroSec p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{workout.name}</h2>
            <Badge variant={workout.category}>{workout.category}</Badge>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Timer Central */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-6xl font-bold text-white mb-4 font-mono">
          {formatearTiempo(segundos)}
        </div>
        
        <div className="flex items-center gap-6 text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>Meta: {workout.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span>~{Math.round((segundos / 60) * 10)} kcal</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActivo(!activo)}
            className="w-16 h-16 rounded-full p-0 flex items-center justify-center"
          >
            {activo ? <Pause size={28} /> : <Play size={28} />}
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => onComplete(segundos)}
            className="px-8"
          >
            <CheckCircle size={20} className="mr-2" />
            Finalizar
          </Button>
        </div>
      </div>

      {/* Ejercicios */}
      {ejercicios.length > 0 && (
        <div className="bg-pulso-negroSec p-4 border-t border-gray-800 max-h-[40vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Ejercicios</h3>
            <span className="text-gray-400 text-sm">{ejercicioActual}/{ejercicios.length}</span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-pulso-rojo h-2 rounded-full transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>

          <div className="space-y-2">
            {ejercicios.map((ejercicio, index) => (
              <div
                key={index}
                onClick={() => setEjercicioActual(index + 1)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all
                  ${index < ejercicioActual 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : index === ejercicioActual 
                      ? 'bg-pulso-rojo/10 border border-pulso-rojo/30' 
                      : 'bg-pulso-negro border border-gray-800'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index < ejercicioActual 
                      ? 'bg-green-500 text-white' 
                      : index === ejercicioActual 
                        ? 'bg-pulso-rojo text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {index < ejercicioActual ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${index < ejercicioActual ? 'text-green-500' : 'text-white'}`}>
                      {ejercicio.name}
                    </p>
                    <p className="text-gray-500 text-xs">{ejercicio.reps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
