import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user?.id) {
      loadProgress();
    } else {
      resetProgress();
    }
  }, [user?.id]);

  const loadProgress = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Cargar stats y medals en paralelo (lo más crítico primero)
      const [statsData, medalsData] = await Promise.all([
        progressService.getUserStats(user.id),
        medalService.getUserMedals(user.id),
      ]);

      setStats(statsData);
      setMedals(medalsData);

      // Cargar datos secundarios después (lazy)
      const [completedData, progressData] = await Promise.all([
        progressService.getCompletedWorkouts(user.id, 30), // Solo últimos 30 para gráficos
        medalService.getMedalsProgress(user.id),
      ]);

      setCompletedWorkouts(completedData);
      setMedalsProgress(progressData);
    } catch (err) {
      console.error('Error cargando progreso:', err);
      setError('Error al cargar progreso');
    } finally {
      setLoading(false);
    }
  };

  const resetProgress = () => {
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
  };

  const refreshProgress = async () => {
    await loadProgress();
  };

  return {
    stats,
    completedWorkouts,
    medals,
    medalsProgress,
    loading,
    error,
    refreshProgress,
  };
};
