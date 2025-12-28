import { supabase } from '../lib/supabase';

// ==================== OBTENER ENTRENAMIENTOS AGENDADOS ====================

// Obtener todos los entrenamientos agendados de un usuario
export const getScheduledWorkouts = async (userId) => {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category,
        video_url
      )
    `)
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    console.error('Error al obtener entrenamientos agendados:', error);
    throw error;
  }
  
  return data;
};

// Obtener entrenamientos agendados por rango de fechas
export const getScheduledWorkoutsByDateRange = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category,
        video_url
      )
    `)
    .eq('user_id', userId)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    console.error('Error al obtener entrenamientos por rango:', error);
    throw error;
  }
  
  return data;
};

// Obtener entrenamientos agendados de una fecha específica
export const getScheduledWorkoutsByDate = async (userId, date) => {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .select(`
      *,
      workout:workouts (
        id,
        name,
        description,
        duration,
        level,
        calories,
        category,
        video_url
      )
    `)
    .eq('user_id', userId)
    .eq('scheduled_date', date)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    console.error('Error al obtener entrenamientos de fecha:', error);
    throw error;
  }
  
  return data;
};

// ==================== CREAR/AGENDAR ====================

// Agendar un nuevo entrenamiento
export const scheduleWorkout = async (userId, workoutId, scheduledDate, status = 'pendiente') => {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      scheduled_date: scheduledDate,
      status: status
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
        category,
        video_url
      )
    `)
    .single();
  
  if (error) {
    console.error('Error al agendar entrenamiento:', error);
    throw error;
  }
  
  return data;
};

// ==================== ACTUALIZAR ====================

// Actualizar status de un entrenamiento agendado
export const updateScheduledStatus = async (scheduledId, status, completedAt = null) => {
  const updateData = { status };
  
  if (completedAt) {
    updateData.completed_at = completedAt;
  }
  
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .update(updateData)
    .eq('id', scheduledId)
    .select()
    .single();
  
  if (error) {
    console.error('Error al actualizar status:', error);
    throw error;
  }
  
  return data;
};

// Marcar como completado
export const markAsCompleted = async (scheduledId) => {
  return updateScheduledStatus(scheduledId, 'completado', new Date().toISOString());
};

// Marcar como cancelado
export const markAsCancelled = async (scheduledId) => {
  return updateScheduledStatus(scheduledId, 'cancelado');
};

// Reprogramar un entrenamiento
export const rescheduleWorkout = async (scheduledId, newDate) => {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .update({
      scheduled_date: newDate,
      status: 'pendiente',
      completed_at: null
    })
    .eq('id', scheduledId)
    .select()
    .single();
  
  if (error) {
    console.error('Error al reprogramar entrenamiento:', error);
    throw error;
  }
  
  return data;
};

// ==================== ELIMINAR ====================

// Eliminar entrenamiento agendado
export const deleteScheduledWorkout = async (scheduledId) => {
  const { error } = await supabase
    .from('scheduled_workouts')
    .delete()
    .eq('id', scheduledId);
  
  if (error) {
    console.error('Error al eliminar entrenamiento agendado:', error);
    throw error;
  }
  
  return true;
};

// ==================== ESTADÍSTICAS ====================

// Obtener count de entrenamientos pendientes
export const getPendingCount = async (userId) => {
  const { count, error } = await supabase
    .from('scheduled_workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pendiente')
    .lte('scheduled_date', new Date().toISOString().split('T')[0]);
  
  if (error) {
    console.error('Error al obtener pendientes:', error);
    return 0;
  }
  
  return count || 0;
};
