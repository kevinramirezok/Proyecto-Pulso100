import { supabase } from '../lib/supabase';
import { getUserStats } from './progressService';

// ==================== OBTENER MEDALLAS ====================

// Obtener todas las medallas disponibles
export const getAllMedals = async () => {
  const { data, error } = await supabase
    .from('medals')
    .select('*')
    .order('requirement_value', { ascending: true });
  
  if (error) {
    console.error('Error al obtener medallas:', error);
    throw error;
  }
  
  return data;
};

// Obtener medallas desbloqueadas por un usuario
export const getUserMedals = async (userId) => {
  const { data, error } = await supabase
    .from('user_medals')
    .select(`
      *,
      medal:medals (
        id,
        name,
        description,
        icon,
        requirement_type,
        requirement_value,
        category
      )
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener medallas de usuario:', error);
    throw error;
  }
  
  return data;
};

// Verificar si un usuario tiene una medalla específica
export const hasUserMedal = async (userId, medalId) => {
  const { data, error } = await supabase
    .from('user_medals')
    .select('id')
    .eq('user_id', userId)
    .eq('medal_id', medalId)
    .maybeSingle();
  
  if (error) {
    console.error('Error al verificar medalla:', error);
    return false;
  }
  
  return data !== null;
};

// ==================== DESBLOQUEAR MEDALLAS ====================

// Desbloquear una medalla para un usuario
export const unlockMedal = async (userId, medalId) => {
  // Intentar insertar directamente
  const { data, error } = await supabase
    .from('user_medals')
    .insert({
      user_id: userId,
      medal_id: medalId,
      unlocked_at: new Date().toISOString()
    })
    .select(`
      *,
      medal:medals (
        id,
        name,
        description,
        icon,
        requirement_type,
        requirement_value,
        category
      )
    `)
    .single();
  
  if (error) {
    // Si es error de duplicado (23505), significa que ya tiene la medalla
    if (error.code === '23505') {
      return null; // No es un error real, solo ya existe
    }
    console.error('Error al desbloquear medalla:', error);
    throw error;
  }
  
  return data;
};

// ==================== VERIFICACIÓN AUTOMÁTICA ====================

// Verificar y desbloquear medallas según progreso del usuario
export const checkAndUnlockMedals = async (userId) => {
  try {
    // Obtener stats del usuario
    const stats = await getUserStats(userId);
    
    // Obtener todas las medallas
    const allMedals = await getAllMedals();
    
    // Obtener medallas ya desbloqueadas
    const userMedals = await getUserMedals(userId);
    
    const unlockedIds = new Set(userMedals.map(um => um.medal.id));
    
    const newlyUnlocked = [];
    
    // Verificar cada medalla
    for (const medal of allMedals) {
      // Si ya la tiene, skip
      if (unlockedIds.has(medal.id)) {
        continue;
      }
      
      // Verificar si cumple el requisito
      const meetsRequirement = checkMedalRequirement(medal, stats);
      
      if (meetsRequirement) {
        try {
          const unlockedMedal = await unlockMedal(userId, medal.id);
          if (unlockedMedal) {
            newlyUnlocked.push(unlockedMedal);
          }
        } catch (err) {
          console.error('Error al desbloquear medalla:', medal.name, err);
        }
      }
    }
    
    return newlyUnlocked;
  } catch (error) {
    console.error('Error en checkAndUnlockMedals:', error);
    return [];
  }
};

// Verificar si cumple el requisito de una medalla
const checkMedalRequirement = (medal, stats) => {
  switch (medal.requirement_type) {
    case 'entrenamientos_completados':
      return stats.totalCompleted >= medal.requirement_value;
    
    case 'dias_consecutivos':
      return stats.streak >= medal.requirement_value;
    
    case 'calorias_quemadas':
      return stats.totalCalories >= medal.requirement_value;
    
    case 'hora_entrenamiento':
      // TODO: implementar cuando se trackee la hora
      return stats.earlyWorkouts >= medal.requirement_value;
    
    default:
      return false;
  }
};

// Obtener progreso hacia medallas no desbloqueadas
export const getMedalsProgress = async (userId) => {
  const stats = await getUserStats(userId);
  const allMedals = await getAllMedals();
  const userMedals = await getUserMedals(userId);
  const unlockedIds = new Set(userMedals.map(um => um.medal.id));
  
  const progress = allMedals.map(medal => {
    const isUnlocked = unlockedIds.has(medal.id);
    
    let currentValue = 0;
    let percentage = 0;
    
    if (!isUnlocked) {
      switch (medal.requirement_type) {
        case 'entrenamientos_completados':
          currentValue = stats.totalCompleted;
          break;
        case 'dias_consecutivos':
          currentValue = stats.streak;
          break;
        case 'calorias_quemadas':
          currentValue = stats.totalCalories;
          break;
        case 'hora_entrenamiento':
          currentValue = stats.earlyWorkouts;
          break;
      }
      
      percentage = Math.min(100, Math.round((currentValue / medal.requirement_value) * 100));
    } else {
      percentage = 100;
    }
    
    return {
      ...medal,
      isUnlocked,
      currentValue,
      percentage
    };
  });
  
  return progress;
};
