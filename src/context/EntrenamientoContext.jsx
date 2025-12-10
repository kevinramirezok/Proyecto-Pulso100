import { createContext, useContext, useState } from 'react';

const EntrenamientoContext = createContext();

export const EntrenamientoProvider = ({ children }) => {
  const [entrenamientoActivo, setEntrenamientoActivo] = useState(null);
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState(null);

  const iniciarEntrenamiento = (workout, scheduleId = null) => {
    setEntrenamientoActivo(workout);
    setScheduledWorkoutId(scheduleId);
  };

  const detenerEntrenamiento = () => {
    setEntrenamientoActivo(null);
    setScheduledWorkoutId(null);
  };

  return (
    <EntrenamientoContext.Provider value={{
      entrenamientoActivo,
      scheduledWorkoutId,
      iniciarEntrenamiento,
      detenerEntrenamiento,
    }}>
      {children}
    </EntrenamientoContext.Provider>
  );
};

export const useEntrenamiento = () => {
  const context = useContext(EntrenamientoContext);
  if (!context) throw new Error('useEntrenamiento debe usarse dentro de EntrenamientoProvider');
  return context;
};