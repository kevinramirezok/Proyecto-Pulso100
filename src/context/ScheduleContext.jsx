import { createContext, useContext, useState, useEffect } from 'react';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [scheduledWorkouts, setScheduledWorkouts] = useState(() => {
    const saved = localStorage.getItem('pulso-scheduled');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pulso-scheduled', JSON.stringify(scheduledWorkouts));
  }, [scheduledWorkouts]);

  const scheduleWorkout = (workout, date) => {
    const newSchedule = {
      id: Date.now(),
      workoutId: workout.id,
      workoutName: workout.name,
      workoutCategory: workout.category,
      workoutDuration: workout.duration,
      scheduledDate: date,
      status: 'pending', // pending, completed, skipped
      completedAt: null,
    };
    setScheduledWorkouts([...scheduledWorkouts, newSchedule]);
  };

  const completeScheduledWorkout = (scheduleId) => {
    setScheduledWorkouts(
      scheduledWorkouts.map(s =>
        s.id === scheduleId
          ? { ...s, status: 'completed', completedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const deleteScheduledWorkout = (scheduleId) => {
    setScheduledWorkouts(scheduledWorkouts.filter(s => s.id !== scheduleId));
  };

  const getWorkoutsForDate = (date) => {
    const dateStr = new Date(date).toDateString();
    return scheduledWorkouts.filter(
      s => new Date(s.scheduledDate).toDateString() === dateStr
    );
  };

  // Calcular racha de días consecutivos
  const getStreak = () => {
    if (scheduledWorkouts.length === 0) return 0;
    
    // Obtener entrenamientos completados
    const completados = scheduledWorkouts.filter(w => w.status === 'completed');
    if (completados.length === 0) return 0;
    
    // Obtener fechas únicas de entrenamientos completados
    const fechasCompletadas = [...new Set(
      completados.map(w => new Date(w.completedAt || w.scheduledDate).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a)); // Ordenar de más reciente a más antigua
    
    // Verificar si hoy o ayer tiene entrenamiento (para contar racha activa)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    const primeraFecha = new Date(fechasCompletadas[0]);
    primeraFecha.setHours(0, 0, 0, 0);
    
    // Si la última actividad no fue hoy ni ayer, la racha se rompió
    if (primeraFecha < ayer) return 0;
    
    // Contar días consecutivos
    let racha = 1;
    for (let i = 0; i < fechasCompletadas.length - 1; i++) {
      const fechaActual = new Date(fechasCompletadas[i]);
      const fechaSiguiente = new Date(fechasCompletadas[i + 1]);
      
      fechaActual.setHours(0, 0, 0, 0);
      fechaSiguiente.setHours(0, 0, 0, 0);
      
      const diffDias = (fechaActual - fechaSiguiente) / (1000 * 60 * 60 * 24);
      
      if (diffDias === 1) {
        racha++;
      } else {
        break;
      }
    }
    
    return racha;
  };

  // Completar workout HOY (para usar desde Rutinas)
  const completeWorkoutToday = (workout) => {
    const hoy = new Date();
    const nuevoSchedule = {
      id: Date.now(),
      workoutId: workout.id,
      workoutName: workout.name,
      workoutCategory: workout.category,
      workoutDuration: workout.duration,
      scheduledDate: hoy.toISOString(),
      status: 'completed',
      completedAt: hoy.toISOString(),
    };
    setScheduledWorkouts(prev => [...prev, nuevoSchedule]);
  };

  // Obtener total de entrenamientos completados
  const getTotalCompleted = () => {
    return scheduledWorkouts.filter(w => w.status === 'completed').length;
  };

  // Obtener entrenamientos completados de la semana actual (lunes a domingo)
  const getWeekCompleted = () => {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes, etc.
    
    // Calcular el lunes de esta semana
    const lunes = new Date(hoy);
    const diasDesdelunes = diaSemana === 0 ? 6 : diaSemana - 1;
    lunes.setDate(hoy.getDate() - diasDesdelunes);
    lunes.setHours(0, 0, 0, 0);
    
    // Calcular el domingo de esta semana
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);
    
    return scheduledWorkouts.filter(w => {
      if (w.status !== 'completed') return false;
      const fecha = new Date(w.completedAt || w.scheduledDate);
      return fecha >= lunes && fecha <= domingo;
    }).length;
  };

  // Verificar si un workout ya fue completado (por workoutId)
  const isWorkoutCompleted = (workoutId) => {
    return scheduledWorkouts.some(w => w.workoutId === workoutId && w.status === 'completed');
  };

  return (
    <ScheduleContext.Provider
      value={{
        scheduledWorkouts,
        scheduleWorkout,
        completeScheduledWorkout,
        deleteScheduledWorkout,
        getWorkoutsForDate,
        getStreak,
        completeWorkoutToday,
        getTotalCompleted,
        getWeekCompleted,
        isWorkoutCompleted,
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