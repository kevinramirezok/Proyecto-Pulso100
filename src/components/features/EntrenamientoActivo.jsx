import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { checkAndUnlockMedals } from '../../services/medalService';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Play, Pause, Clock, Flame, CheckCircle, X, ChevronRight, Youtube, AlertCircle } from 'lucide-react';

export default function EntrenamientoActivo({ workout, scheduledWorkoutId, onComplete, onCancel }) {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(true);
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [videoActivo, setVideoActivo] = useState(null);
  const [completando, setCompletando] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
  
  // Cálculo de calorías basado en nivel y duración
  const calcularCalorias = () => {
    const minutos = segundos / 60;
    const factorNivel = {
      'Principiante': 6,
      'Intermedio': 8,
      'Avanzado': 10
    };
    const factor = factorNivel[workout.level] || 8;
    return Math.round(minutos * factor);
  };

  const caloriasQuemadas = calcularCalorias();

  // Manejar completar entrenamiento
  const handleComplete = async () => {
    if (completando) return;
    
    setCompletando(true);
    setActivo(false);

    try {
      const duracionMinutos = Math.round(segundos / 60);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('No se pudo obtener el usuario');
        setCompletando(false);
        return;
      }

      // El workout puede venir como objeto directo o como scheduled_workout con workout anidado
      const workoutId = workout.workout_id || workout.workout?.id || workout.id;
      
      if (!workoutId) {
        console.error('Workout sin ID válido:', workout);
        toast.error('Error: Workout inválido');
        setCompletando(false);
        return;
      }

      // 1. Guardar workout completado
      const { data: completedWorkout, error: completedError } = await supabase
        .from('completed_workouts')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          scheduled_workout_id: scheduledWorkoutId,
          duration_minutes: duracionMinutos,
          calories_burned: caloriasQuemadas,
          completed_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (completedError) throw completedError;

      // 2. Actualizar scheduled_workout si existe
      if (scheduledWorkoutId) {
        const { error: updateError } = await supabase
          .from('scheduled_workouts')
          .update({ 
            status: 'completado',
            completed_at: new Date().toISOString()
          })
          .eq('id', scheduledWorkoutId);

        if (updateError) throw updateError;
      }

      // 3. Verificar y desbloquear medallas
      const newMedals = await checkAndUnlockMedals(user.id);
      
      if (newMedals && newMedals.length > 0) {
        newMedals.forEach(medal => {
          toast.success(`¡Medalla desbloqueada! 🏅`, {
            description: medal.medal.name
          });
        });
      }

      toast.success('¡Entrenamiento completado!', {
        description: `${duracionMinutos} min · ${caloriasQuemadas} kcal quemadas`
      });

      // Llamar callback con datos completos
      onComplete({
        segundos,
        duracionMinutos,
        caloriasQuemadas,
        completedWorkout
      });

    } catch (error) {
      console.error('Error al completar entrenamiento:', error);
      toast.error('Error al guardar entrenamiento', {
        description: error.message
      });
    } finally {
      setCompletando(false);
    }
  };

  // Extraer video ID de YouTube URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleCancelar = () => {
    if (segundos > 30) {
      setShowExitConfirm(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-pulso-negro z-50 flex flex-col">
      {/* Modal de confirmación de salida */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center p-4">
          <div className="bg-pulso-negroSec border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-yellow-500" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">¿Cancelar entrenamiento?</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Llevas {formatearTiempo(segundos)} entrenando. Si cancelas, perderás tu progreso.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Continuar
              </Button>
              <Button
                variant="danger"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de video */}
      {videoActivo && (
        <div className="absolute inset-0 bg-black/90 z-10 flex items-center justify-center p-4">
          <div className="bg-pulso-negroSec border border-gray-800 rounded-2xl p-4 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">{videoActivo.name}</h3>
              <button
                onClick={() => setVideoActivo(null)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeId(videoActivo.video_url)}`}
                title={videoActivo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {videoActivo.description && (
              <p className="text-gray-400 text-sm mt-3">{videoActivo.description}</p>
            )}
          </div>
        </div>
      )}

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
            onClick={handleCancelar}
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
            onClick={handleComplete}
            disabled={completando}
            className="px-8 h-14"
          >
            {completando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle size={20} className="mr-2" />
                Finalizar
              </>
            )}
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
              const hasVideo = ejercicio.video_url;

              return (
                <div
                  key={index}
                  className={`
                    p-3 rounded-xl transition-all
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

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      {hasVideo && (
                        <button
                          onClick={() => setVideoActivo(ejercicio)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Youtube size={18} className="text-red-500" />
                        </button>
                      )}
                      {isCurrent && !isCompleted && (
                        <button
                          onClick={() => setEjercicioActual(index + 1)}
                          className="p-2 hover:bg-pulso-rojo/20 rounded-lg transition-colors"
                        >
                          <ChevronRight className="text-pulso-rojo" size={20} />
                        </button>
                      )}
                    </div>
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