import { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import MiniCalendario from '../../components/ui/MiniCalendario';
import { Clock, Flame, TrendingUp, Search, Play, Calendar, CheckCircle, Youtube, X, Dumbbell } from 'lucide-react';
import { useEntrenamiento } from '../../context/EntrenamientoContext';
import { useWorkouts } from '../../context/WorkoutContext';

const CATEGORIES = [
  { key: 'all', label: 'Todas' },
  { key: 'fuerza', label: 'Fuerza' },
  { key: 'running', label: 'Running' },
  { key: 'bicicleta', label: 'Bicicleta' },
  { key: 'natacion', label: 'Natación' },
  { key: 'otro', label: 'Otro' },
];

export default function Rutinas() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { scheduleWorkout, completeWorkoutToday, isWorkoutCompleted } = useSchedule();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateForSchedule, setSelectedDateForSchedule] = useState('');
  const { iniciarEntrenamiento } = useEntrenamiento();
  const [videoEjercicio, setVideoEjercicio] = useState(null);
  const { workouts, exercises, loading } = useWorkouts();

  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aCompleted = isWorkoutCompleted(a.id);
      const bCompleted = isWorkoutCompleted(b.id);
      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;
      return b.id - a.id;
    });

  // Contar rutinas por categoría
  const getCategoryCount = (key) => {
    if (key === 'all') return workouts.length;
    return workouts.filter(w => w.category === key).length;
  };

  const cerrarModal = () => {
    setSelectedWorkout(null);
    setShowDatePicker(false);
    setSelectedDateForSchedule('');
    setVideoEjercicio(null);
  };

  // Loading profesional
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header con stats */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Rutinas</h1>
          <p className="text-gray-400 text-sm">
            {workouts.length} rutinas disponibles
          </p>
        </div>
        <div className="bg-pulso-rojo/10 px-4 py-2 rounded-lg text-center">
          <p className="text-pulso-rojo text-2xl font-bold">
            {workouts.filter(w => isWorkoutCompleted(w.id)).length}
          </p>
          <p className="text-gray-400 text-xs">Completadas</p>
        </div>
      </div>

      {/* Buscador con botón limpiar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Buscar rutinas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-pulso-negroSec text-white border border-gray-700 rounded-xl focus:outline-none focus:border-pulso-rojo transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filtros con contador */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(({ key, label }) => {
          const count = getCategoryCount(key);
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
                ${selectedCategory === key
                  ? 'bg-pulso-rojo text-white'
                  : 'bg-pulso-negroSec text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600'
                }
              `}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === key ? 'bg-white/20' : 'bg-gray-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de Rutinas */}
      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <Card className="text-center py-12">
            <Dumbbell className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 mb-2">No se encontraron rutinas</p>
            {searchTerm && (
              <Button variant="secondary" size="sm" onClick={() => setSearchTerm('')}>
                Limpiar búsqueda
              </Button>
            )}
          </Card>
        ) : (
          filteredWorkouts.map((workout) => {
            const isCompleted = isWorkoutCompleted(workout.id);
            return (
              <Card 
                key={workout.id} 
                className={`
                  transition-all cursor-pointer
                  ${isCompleted 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'hover:border-pulso-rojo/50 hover:bg-pulso-rojo/5'
                  }
                `}
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">{workout.name}</h3>
                      {isCompleted && (
                        <CheckCircle className="text-green-500" size={18} />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{workout.description}</p>
                  </div>
                  <Badge variant={workout.category}>{workout.category}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Clock size={14} />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-400">
                    <Flame size={14} />
                    <span>{workout.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <TrendingUp size={14} />
                    <span>{workout.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 ml-auto">
                    <Dumbbell size={14} />
                    <span>{workout.exercises?.length || 0} ejercicios</span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Contador de resultados */}
      {searchTerm && filteredWorkouts.length > 0 && (
        <p className="text-gray-500 text-sm text-center">
          {filteredWorkouts.length} de {workouts.length} rutinas
        </p>
      )}

      {/* Modal Detalle */}
      <Modal
        isOpen={!!selectedWorkout}
        onClose={cerrarModal}
        title={selectedWorkout?.name}
      >
        {selectedWorkout && (
          <div className="space-y-5">
            {/* Header del modal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={selectedWorkout.category}>{selectedWorkout.category}</Badge>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-400 text-sm">{selectedWorkout.level}</span>
              </div>
              {isWorkoutCompleted(selectedWorkout.id) && (
                <span className="flex items-center gap-1 text-green-500 text-sm">
                  <CheckCircle size={14} />
                  Completada
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm">{selectedWorkout.description}</p>

            {/* Stats en línea */}
            <div className="flex items-center justify-around py-3 bg-pulso-negro rounded-xl">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{selectedWorkout.duration}</p>
                <p className="text-gray-500 text-xs">minutos</p>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{selectedWorkout.calories}</p>
                <p className="text-gray-500 text-xs">calorías</p>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{selectedWorkout.exercises?.length || 0}</p>
                <p className="text-gray-500 text-xs">ejercicios</p>
              </div>
            </div>

            {/* Ejercicios */}
            {!showDatePicker && (
              <div>
                <h3 className="text-white font-semibold mb-3">Ejercicios</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {selectedWorkout.exercises?.map((exercise, index) => {
                    const exerciseData = exercise.exerciseId 
                      ? exercises.find(e => e.id === exercise.exerciseId)
                      : null;
                    
                    return (
                      <div key={index} className="bg-pulso-negro rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-pulso-rojo/20 text-pulso-rojo w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{exercise.name}</p>
                            <p className="text-gray-500 text-xs">{exercise.reps}</p>
                          </div>
                          {exerciseData?.video_url && (
                            <button
                              onClick={() => setVideoEjercicio(videoEjercicio?.id === exerciseData.id ? null : exerciseData)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                videoEjercicio?.id === exerciseData.id 
                                  ? 'bg-pulso-rojo text-white' 
                                  : 'bg-pulso-rojo/10 text-pulso-rojo hover:bg-pulso-rojo/20'
                              }`}
                            >
                              <Youtube size={16} />
                            </button>
                          )}
                        </div>
                        
                        {/* Video expandido */}
                        {videoEjercicio?.id === exerciseData?.id && exerciseData?.video_url && (
                          <div className="mt-3 relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={exerciseData.video_url.replace('watch?v=', 'embed/')}
                              title={`Video de ${exercise.name}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector de fecha */}
            {showDatePicker && (
              <div className="space-y-4">
                <label className="block text-gray-400 text-sm">Seleccioná la fecha:</label>
                <MiniCalendario
                  selectedDate={selectedDateForSchedule}
                  onSelectDate={(fecha) => setSelectedDateForSchedule(fecha.toISOString())}
                />
                {selectedDateForSchedule && (
                  <p className="text-center text-white">
                    <span className="text-pulso-rojo font-bold">
                      {new Date(selectedDateForSchedule).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDatePicker(false);
                      setSelectedDateForSchedule('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!selectedDateForSchedule}
                    onClick={() => {
                      if (selectedDateForSchedule) {
                        scheduleWorkout(selectedWorkout, selectedDateForSchedule);
                        alert('✅ Entrenamiento programado!');
                        cerrarModal();
                      }
                    }}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            )}

            {/* Acciones */}
            {!showDatePicker && (
              <div className="space-y-3 pt-2">
                {isWorkoutCompleted(selectedWorkout.id) ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 text-green-500" size={28} />
                    <p className="text-green-400 font-medium">¡Ya completaste esta rutina!</p>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        cerrarModal();
                        iniciarEntrenamiento(selectedWorkout);
                      }}
                    >
                      <Play size={18} className="mr-2" />
                      Iniciar Entrenamiento
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setShowDatePicker(true)}
                      >
                        <Calendar size={16} className="mr-1" />
                        Programar
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          completeWorkoutToday(selectedWorkout);
                          alert('¡Rutina completada! 🎉');
                        }}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Completar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}