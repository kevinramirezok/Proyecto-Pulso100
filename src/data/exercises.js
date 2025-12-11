export const EXERCISES = [
  {
    id: 1,
    name: "Sentadillas",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio básico de piernas",
    muscleGroup: "piernas"
  },
  {
    id: 2,
    name: "Press de banca",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de pecho con barra",
    muscleGroup: "pecho"
  },
  {
    id: 3,
    name: "Peso muerto",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio compuesto para espalda y piernas",
    muscleGroup: "espalda"
  },
  {
    id: 4,
    name: "Dominadas",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de tracción para espalda",
    muscleGroup: "espalda"
  },
  {
    id: 5,
    name: "Burpees",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de cuerpo completo",
    muscleGroup: "cardio"
  },
  {
    id: 6,
    name: "Mountain climbers",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de cardio y core",
    muscleGroup: "cardio"
  },
  {
    id: 7,
    name: "Jump squats",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Sentadillas con salto",
    muscleGroup: "piernas"
  },
  {
    id: 8,
    name: "Plancha frontal",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio isométrico de core",
    muscleGroup: "core"
  },
  {
    id: 9,
    name: "Crunches",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Abdominales básicos",
    muscleGroup: "core"
  },
  {
    id: 10,
    name: "Russian twists",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de oblicuos",
    muscleGroup: "core"
  },
  {
    id: 11,
    name: "Plancha lateral",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Isométrico para oblicuos",
    muscleGroup: "core"
  },
  {
    id: 12,
    name: "Press militar",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de hombros con barra",
    muscleGroup: "hombros"
  },
  {
    id: 13,
    name: "Remo con barra",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio de espalda",
    muscleGroup: "espalda"
  },
  {
    id: 14,
    name: "Dips",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Fondos para tríceps y pecho",
    muscleGroup: "triceps"
  },
  {
    id: 15,
    name: "Curl de bíceps",
    videoUrl: "https://youtube.com/watch?v=example",
    description: "Ejercicio básico de bíceps",
    muscleGroup: "biceps"
  }
];

export const getExerciseById = (id) => EXERCISES.find(e => e.id === id);
export const getExerciseByName = (name) => EXERCISES.find(e => e.name.toLowerCase() === name.toLowerCase());
