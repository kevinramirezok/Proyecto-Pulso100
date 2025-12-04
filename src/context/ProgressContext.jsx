import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [completedWorkouts, setCompletedWorkouts] = useState(() => {
    const saved = localStorage.getItem('pulso-completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pulso-completed', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  const completeWorkout = (workoutId) => {
    const newCompletion = {
      workoutId,
      completedAt: new Date().toISOString(),
    };
    setCompletedWorkouts([...completedWorkouts, newCompletion]);
  };

  const isWorkoutCompleted = (workoutId) => {
    return completedWorkouts.some(c => c.workoutId === workoutId);
  };

  const getTotalCompleted = () => {
    return completedWorkouts.length;
  };

  const getWeekCompleted = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return completedWorkouts.filter(c => new Date(c.completedAt) >= oneWeekAgo).length;
  };

  return (
    <ProgressContext.Provider value={{
      completedWorkouts,
      completeWorkout,
      isWorkoutCompleted,
      getTotalCompleted,
      getWeekCompleted,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress debe usarse dentro de ProgressProvider');
  return context;
};