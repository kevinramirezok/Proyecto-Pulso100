import { supabase } from '../lib/supabase';

// ==================== REGISTRAR ENTRENAMIENTOS COMPLETADOS ====================

// Registrar un entrenamiento completado
export const completeWorkout = async (userId, workoutId, scheduledWorkoutId = null, durationMinutes = null, caloriesBurned = null, notes = null) => {
  const completedDate = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('completed_workouts')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      scheduled_workout_id: scheduledWorkoutId,
      completed_date: completedDate,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      notes: notes
    })
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category
      )
    `)
    .single();
  
  if (error) {
    console.error('Error al completar entrenamiento:', error);
    throw error;
  }
  
  return data;
};

// ==================== OBTENER HISTORIAL ====================

// Obtener todos los entrenamientos completados de un usuario
export const getCompletedWorkouts = async (userId, limit = 90) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category
      )
    `)
    .eq('user_id', userId)
    .order('completed_date', { ascending: false })
    .limit(limit); // Limitar a últimos 90 entrenamientos
  
  if (error) {
    console.error('Error al obtener completados:', error);
    throw error;
  }
  
  return data;
};

// Obtener entrenamientos completados por rango de fechas
export const getCompletedWorkoutsByDateRange = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category
      )
    `)
    .eq('user_id', userId)
    .gte('completed_date', startDate)
    .lte('completed_date', endDate)
    .order('completed_date', { ascending: false });
  
  if (error) {
    console.error('Error al obtener completados por rango:', error);
    throw error;
  }
  
  return data;
};

// ==================== ESTADÍSTICAS ====================

// Obtener estadísticas generales del usuario
export const getUserStats = async (userId) => {
  // Total de entrenamientos completados
  const { count: totalCompleted, error: countError } = await supabase
    .from('completed_workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  if (countError) {
    console.error('Error al contar completados:', countError);
  }
  
  // Obtener solo últimos 90 días para calcular stats (optimización)
  const hace90Dias = new Date();
  hace90Dias.setDate(hace90Dias.getDate() - 90);
  const fechaLimite = hace90Dias.toISOString().split('T')[0];
  
  const { data: completedWorkouts, error: dataError } = await supabase
    .from('completed_workouts')
    .select('completed_date, duration_minutes, calories_burned')
    .eq('user_id', userId)
    .gte('completed_date', fechaLimite)
    .order('completed_date', { ascending: false })
    .limit(200); // Máximo 200 registros
  
  if (dataError) {
    console.error('Error al obtener datos de completados:', dataError);
    return {
      totalCompleted: 0,
      totalMinutes: 0,
      totalCalories: 0,
      streak: 0,
      avgDuration: 0,
      avgCalories: 0
    };
  }
  
  // Calcular totales
  const totalMinutes = completedWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
  
  // Calcular racha (días consecutivos)
  const streak = calculateStreak(completedWorkouts);
  
  // Promedios
  const avgDuration = totalCompleted > 0 ? Math.round(totalMinutes / totalCompleted) : 0;
  const avgCalories = totalCompleted > 0 ? Math.round(totalCalories / totalCompleted) : 0;
  
  return {
    totalCompleted: totalCompleted || 0,
    totalMinutes,
    totalCalories,
    streak,
    avgDuration,
    avgCalories,
    earlyWorkouts: 0 // TODO: implementar cuando se trackee la hora
  };
};

// Calcular racha de días consecutivos
const calculateStreak = (completedWorkouts) => {
  if (!completedWorkouts || completedWorkouts.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Obtener fechas únicas y ordenarlas
  const uniqueDates = [...new Set(completedWorkouts.map(w => w.completed_date))]
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dateStr of uniqueDates) {
    const workoutDate = new Date(dateStr + 'T00:00:00');
    const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }
  
  return streak;
};

// Obtener stats por mes
export const getMonthlyStats = async (userId, year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('completed_workouts')
    .select('completed_date, duration_minutes, calories_burned')
    .eq('user_id', userId)
    .gte('completed_date', startDate)
    .lte('completed_date', endDate);
  
  if (error) {
    console.error('Error al obtener stats mensuales:', error);
    return {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCalories: 0
    };
  }
  
  return {
    totalWorkouts: data.length,
    totalMinutes: data.reduce((sum, w) => sum + (w.duration_minutes || 0), 0),
    totalCalories: data.reduce((sum, w) => sum + (w.calories_burned || 0), 0)
  };
};

// Obtener actividad por día (para heatmap/calendar)
export const getActivityByDate = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .select('completed_date')
    .eq('user_id', userId)
    .gte('completed_date', startDate)
    .lte('completed_date', endDate);
  
  if (error) {
    console.error('Error al obtener actividad:', error);
    return {};
  }
  
  // Agrupar por fecha
  const activityMap = {};
  data.forEach(workout => {
    const date = workout.completed_date;
    activityMap[date] = (activityMap[date] || 0) + 1;
  });
  
  return activityMap;
};

// ==================== ELIMINAR ====================

// Eliminar un entrenamiento completado (por si se registró por error)
export const deleteCompletedWorkout = async (completedId) => {
  const { error } = await supabase
    .from('completed_workouts')
    .delete()
    .eq('id', completedId);
  
  if (error) {
    console.error('Error al eliminar completado:', error);
    throw error;
  }
  
  return true;
};
