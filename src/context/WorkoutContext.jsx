import { createContext, useContext, useState, useEffect } from 'react';
import { getWorkouts, getExercises } from '../services/workoutService';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [workoutsData, exercisesData] = await Promise.all([
          getWorkouts(),
          getExercises()
        ]);
        
        if (isMounted) {
          setWorkouts(workoutsData);
          setExercises(exercisesData);
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        if (isMounted) {
          setError('Error al cargar los datos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Recargar datos (útil después de crear/editar)
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [workoutsData, exercisesData] = await Promise.all([
        getWorkouts(),
        getExercises()
      ]);
      
      setWorkouts(workoutsData);
      setExercises(exercisesData);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      exercises,
      loading,
      error,
      refreshData
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts debe usarse dentro de WorkoutProvider');
  }
  return context;
};
