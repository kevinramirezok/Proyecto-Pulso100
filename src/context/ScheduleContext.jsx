import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as scheduleService from '../services/scheduleService';
import * as progressService from '../services/progressService';
import { checkAndUnlockMedals } from '../services/medalService';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const { user } = useAuth();
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar entrenamientos agendados desde Supabase
  const loadScheduledWorkouts = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await scheduleService.getScheduledWorkouts(user.id);
      setScheduledWorkouts(data);
    } catch (err) {
      console.error('Error cargando agendados:', err);
      setError('Error al cargar entrenamientos agendados');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Cargar datos cuando el usuario cambie
  useEffect(() => {
    let isMounted = true;
    
    if (user?.id && isMounted) {
      loadScheduledWorkouts();
    } else {
      setScheduledWorkouts([]);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.id, loadScheduledWorkouts]);

  const scheduleWorkout = useCallback(async (workout, date) => {
    if (!user?.id) {
      setError('Debe iniciar sesión para agendar');
      return;
    }

    try {
      const scheduled = await scheduleService.scheduleWorkout(
        user.id,
        workout.id,
        date,
        'pendiente'
      );
      setScheduledWorkouts(prev => [...prev, scheduled]);
    } catch (err) {
      console.error('Error agendando workout:', err);
      setError('Error al agendar entrenamiento');
      throw err;
    }
  }, [user?.id]);

  const completeScheduledWorkout = useCallback(async (scheduleId) => {
    if (!user?.id) return;

    try {
      // Buscar el scheduled workout para obtener datos
      const scheduled = scheduledWorkouts.find(s => s.id === scheduleId);
      if (!scheduled) return;

      // Marcar como completado en scheduled_workouts
      const updated = await scheduleService.markAsCompleted(scheduleId);
      
      // Registrar en completed_workouts
      await progressService.completeWorkout(
        user.id,
        scheduled.workout_id,
        scheduleId,
        scheduled.workout?.duration,
        scheduled.workout?.calories
      );

      // Verificar y desbloquear medallas
      await checkAndUnlockMedals(user.id);

      // Actualizar estado local
      setScheduledWorkouts(prev =>
        prev.map(s => s.id === scheduleId ? updated : s)
      );
    } catch (err) {
      console.error('Error completando workout:', err);
      setError('Error al completar entrenamiento');
      throw err;
    }
  }, [user?.id, scheduledWorkouts]);

  const deleteScheduledWorkout = useCallback(async (scheduleId) => {
    if (!user?.id) return;

    try {
      await scheduleService.deleteScheduledWorkout(scheduleId);
      setScheduledWorkouts(prev => prev.filter(s => s.id !== scheduleId));
    } catch (err) {
      console.error('Error eliminando agendado:', err);
      setError('Error al eliminar entrenamiento');
      throw err;
    }
  }, [user?.id]);

  const getWorkoutsForDate = useCallback((date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return scheduledWorkouts.filter(
      s => s.scheduled_date === dateStr
    );
  }, [scheduledWorkouts]);

  // Completar workout HOY (para usar desde Rutinas - sin agendar previo)
  const completeWorkoutToday = useCallback(async (workout) => {
    if (!user?.id) {
      setError('Debe iniciar sesión');
      return;
    }

    try {
      // Registrar en completed_workouts
      await progressService.completeWorkout(
        user.id,
        workout.id,
        null, // sin scheduled_workout_id
        workout.duration,
        workout.calories
      );

      // Verificar medallas
      await checkAndUnlockMedals(user.id);

      // Recargar scheduled workouts por si hay cambios
      await loadScheduledWorkouts();
    } catch (err) {
      console.error('Error completando workout hoy:', err);
      setError('Error al registrar entrenamiento');
      throw err;
    }
  }, [user?.id, loadScheduledWorkouts]);

  // Memoizar valores calculados
  const totalCompleted = useMemo(() => {
    return scheduledWorkouts.filter(w => w.status === 'completado').length;
  }, [scheduledWorkouts]);

  const refreshSchedule = useCallback(async () => {
    await loadScheduledWorkouts();
  }, [loadScheduledWorkouts]);

  // Verificar si un workout ya fue completado
  const isWorkoutCompleted = useCallback((workoutId) => {
    return scheduledWorkouts.some(
      w => w.workout_id === workoutId && w.status === 'completado'
    );
  }, [scheduledWorkouts]);

  return (
    <ScheduleContext.Provider
      value={{
        scheduledWorkouts,
        loading,
        error,
        scheduleWorkout,
        completeScheduledWorkout,
        deleteScheduledWorkout,
        getWorkoutsForDate,
        completeWorkoutToday,
        isWorkoutCompleted,
        totalCompleted,
        refreshSchedule
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule debe usarse dentro de ScheduleProvider');
  return context;
};