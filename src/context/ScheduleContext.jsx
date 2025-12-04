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

  return (
    <ScheduleContext.Provider
      value={{
        scheduledWorkouts,
        scheduleWorkout,
        completeScheduledWorkout,
        deleteScheduledWorkout,
        getWorkoutsForDate,
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