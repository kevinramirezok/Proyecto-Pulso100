// ==================== CRUD EJERCICIOS ====================

// Crear ejercicio
export const createExercise = async (exercise) => {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      name: exercise.name,
      description: exercise.description,
      video_url: exercise.videoUrl,
      muscle_group: exercise.muscleGroup
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error al crear ejercicio:', error);
    throw error;
  }
  return data;
};

// Actualizar ejercicio
export const updateExercise = async (id, exercise) => {
  const { data, error } = await supabase
    .from('exercises')
    .update({
      name: exercise.name,
      description: exercise.description,
      video_url: exercise.videoUrl,
      muscle_group: exercise.muscleGroup
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error al actualizar ejercicio:', error);
    throw error;
  }
  return data;
};

// Eliminar ejercicio
export const deleteExercise = async (id) => {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error al eliminar ejercicio:', error);
    throw error;
  }
  return true;
};

// ==================== CRUD RUTINAS ====================

// Crear rutina
export const createWorkout = async (workout, exercisesList) => {
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      name: workout.name,
      description: workout.description,
      duration: workout.duration,
      level: workout.level,
      calories: workout.calories,
      category: workout.category
    })
    .select()
    .single();
  
  if (workoutError) {
    console.error('Error al crear rutina:', workoutError);
    throw workoutError;
  }

  if (exercisesList && exercisesList.length > 0) {
    const workoutExercises = exercisesList.map((ex, index) => ({
      workout_id: workoutData.id,
      exercise_id: ex.exerciseId,
      reps: ex.reps,
      notes: ex.notes,
      order_index: index + 1
    }));

    const { error: relError } = await supabase
      .from('workout_exercises')
      .insert(workoutExercises);

    if (relError) {
      console.error('Error al crear ejercicios de rutina:', relError);
      throw relError;
    }
  }

  return workoutData;
};

// Actualizar rutina
export const updateWorkout = async (id, workout, exercisesList) => {
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .update({
      name: workout.name,
      description: workout.description,
      duration: workout.duration,
      level: workout.level,
      calories: workout.calories,
      category: workout.category
    })
    .eq('id', id)
    .select()
    .single();
  
  if (workoutError) {
    console.error('Error al actualizar rutina:', workoutError);
    throw workoutError;
  }

  await supabase
    .from('workout_exercises')
    .delete()
    .eq('workout_id', id);

  if (exercisesList && exercisesList.length > 0) {
    const workoutExercises = exercisesList.map((ex, index) => ({
      workout_id: id,
      exercise_id: ex.exerciseId,
      reps: ex.reps,
      notes: ex.notes,
      order_index: index + 1
    }));

    const { error: relError } = await supabase
      .from('workout_exercises')
      .insert(workoutExercises);

    if (relError) {
      console.error('Error al actualizar ejercicios de rutina:', relError);
      throw relError;
    }
  }

  return workoutData;
};

// Eliminar rutina
export const deleteWorkout = async (id) => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error al eliminar rutina:', error);
    throw error;
  }
  return true;
};
import { supabase } from '../lib/supabase';

// Obtener todos los ejercicios
export const getExercises = async () => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error al obtener ejercicios:', error);
    return [];
  }
  return data;
};

// Obtener todas las rutinas con sus ejercicios
export const getWorkouts = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        id,
        reps,
        notes,
        order_index,
        exercise:exercises (*)
      )
    `)
    .order('id');
  
  if (error) {
    console.error('Error al obtener rutinas:', error);
    return [];
  }
  
  // Transformar datos al formato que usa la app
  return data.map(workout => ({
    ...workout,
    exercises: workout.workout_exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map(we => ({
        exerciseId: we.exercise.id,
        name: we.exercise.name,
        reps: we.reps,
        notes: we.notes,
        videoUrl: we.exercise.video_url
      }))
  }));
};

// Obtener una rutina por ID
export const getWorkoutById = async (id) => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        id,
        reps,
        notes,
        order_index,
        exercise:exercises (*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error al obtener rutina:', error);
    return null;
  }
  
  return {
    ...data,
    exercises: data.workout_exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map(we => ({
        exerciseId: we.exercise.id,
        name: we.exercise.name,
        reps: we.reps,
        notes: we.notes,
        videoUrl: we.exercise.video_url
      }))
  };
};
