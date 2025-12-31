import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import * as progressService from '../services/progressService';
import * as medalService from '../services/medalService';

export const useProgress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalMinutes: 0,
    totalCalories: 0,
    streak: 0,
    avgDuration: 0,
    avgCalories: 0,
  });
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [medals, setMedals] = useState([]);
  const [medalsProgress, setMedalsProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProgress = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Fase 1: Cargar lo crítico primero (stats y medals desbloqueadas)
      const [statsData, medalsData] = await Promise.all([
        progressService.getUserStats(user.id),
        medalService.getUserMedals(user.id),
      ]);

      setStats(statsData);
      setMedals(medalsData);
      setLoading(false); // Mostrar UI básica ya

      // Fase 2: Cargar datos secundarios en background (sin bloquear UI)
      Promise.all([
        progressService.getCompletedWorkouts(user.id, 30),
        medalService.getMedalsProgress(user.id),
      ]).then(([completedData, progressData]) => {
        setCompletedWorkouts(completedData);
        setMedalsProgress(progressData);
      }).catch(err => {
        console.error('Error cargando datos secundarios:', err);
      });

    } catch (err) {
      console.error('Error cargando progreso:', err);
      setError('Error al cargar progreso');
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    
    if (user?.id && isMounted) {
      loadProgress();
    } else {
      resetProgress();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.id, loadProgress]);

  const resetProgress = useCallback(() => {
    setStats({
      totalCompleted: 0,
      totalMinutes: 0,
      totalCalories: 0,
      streak: 0,
      avgDuration: 0,
      avgCalories: 0,
    });
    setCompletedWorkouts([]);
    setMedals([]);
    setMedalsProgress([]);
  }, []);

  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  // Memoizar valores calculados
  const totalMedals = useMemo(() => medals.length, [medals.length]);
  const medalCompletionRate = useMemo(() => {
    if (medalsProgress.length === 0) return 0;
    return Math.round((medals.length / medalsProgress.length) * 100);
  }, [medals.length, medalsProgress.length]);

  return {
    stats,
    completedWorkouts,
    medals,
    medalsProgress,
    loading,
    error,
    refreshProgress,
    // Valores calculados optimizados
    totalMedals,
    medalCompletionRate,
  };
};
