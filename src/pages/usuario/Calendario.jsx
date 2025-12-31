import { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { useWorkouts } from '../../context/WorkoutContext';
import CalendarioCustom from '../../components/calendar/CalendarioCustom';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { CheckCircle, Trash2, Clock, Plus, Dumbbell, ArrowLeft, Flame, X, Search, Play } from 'lucide-react';
import { useEntrenamiento } from '../../context/EntrenamientoContext';
import { formatearFechaLocal } from '../../utils/dateUtils';

const CATEGORIES = [
  { key: 'all', label: 'Todas' },
  { key: 'fuerza', label: 'Fuerza' },
  { key: 'running', label: 'Running' },
  { key: 'bicicleta', label: 'Bicicleta' },
  { key: 'natacion', label: 'Natación' },
  { key: 'otro', label: 'Otro' },
];

export default function Calendario() {
  const { scheduledWorkouts, scheduleWorkout, completeScheduledWorkout, deleteScheduledWorkout } = useSchedule();
  const { workouts, loading } = useWorkouts();
  const { iniciarEntrenamiento } = useEntrenamiento();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats del mes actual
  const hoy = new Date();
  const entrenamientosMes = scheduledWorkouts.filter(w => {
    const fecha = new Date(w.scheduled_date);
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
  });
  const completadosMes = entrenamientosMes.filter(w => w.status === 'completado').length;

  const handleDayClick = (fecha, workoutsDelDia) => {
    setSelectedDate(fecha);
    setSelectedWorkouts(workoutsDelDia);
    setShowAddWorkout(false);
    setFilterCategory('all');
    setSearchTerm('');
  };

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleAgregarEntrenamiento = async (rutina) => {
    if (!selectedDate) return;
    
    const fechaStr = formatearFechaLocal(selectedDate);
    
    try {
      await scheduleWorkout(rutina, fechaStr);
      setShowAddWorkout(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error agendando:', error);
    }
  };

  const cerrarModalPrincipal = () => {
    setSelectedDate(null);
    setSelectedWorkouts([]);
    setShowAddWorkout(false);
    setFilterCategory('all');
    setSearchTerm('');
  };

  // Filtrar rutinas
  const rutinasFiltradas = workouts.filter(w => {
    const matchesCategory = filterCategory === 'all' || w.category === filterCategory;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Loading profesional
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header con stats */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Calendario</h1>
          <p className="text-gray-400 text-sm">Organizá tus entrenamientos</p>
        </div>
        <div className="bg-green-500/10 px-4 py-2 rounded-xl text-center">
          <p className="text-green-500 text-2xl font-bold">{completadosMes}</p>
          <p className="text-gray-400 text-xs">Este mes</p>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Dumbbell className="text-blue-500" size={18} />
              </div>
              <div>
                <p className="text-white font-bold">{entrenamientosMes.length}</p>
                <p className="text-gray-500 text-xs">Programados</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <CheckCircle className="text-green-500" size={18} />
              </div>
              <div>
                <p className="text-white font-bold">{completadosMes}</p>
                <p className="text-gray-500 text-xs">Completados</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendario */}
      <CalendarioCustom
        scheduledWorkouts={scheduledWorkouts}
        onDayClick={handleDayClick}
      />

      {/* Modal del día seleccionado */}
      <Modal
        isOpen={!!selectedDate}
        onClose={cerrarModalPrincipal}
        title={selectedDate ? formatearFecha(selectedDate) : ''}
      >
        {showAddWorkout ? (
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowAddWorkout(false);
                setSearchTerm('');
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
            
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Buscar rutina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-pulso-negro border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-pulso-rojo"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFilterCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    filterCategory === cat.key
                      ? 'bg-pulso-rojo text-white'
                      : 'bg-pulso-negro text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* Lista de rutinas */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rutinasFiltradas.length === 0 ? (
                <p className="text-gray-500 text-center py-6 text-sm">No se encontraron rutinas</p>
              ) : (
                rutinasFiltradas.map((rutina) => (
                  <div
                    key={rutina.id}
                    onClick={() => handleAgregarEntrenamiento(rutina)}
                    className="bg-pulso-negro p-3 rounded-xl cursor-pointer hover:border hover:border-pulso-rojo/50 border border-transparent transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{rutina.name}</p>
                        <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {rutina.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Dumbbell size={12} />
                            {rutina.exercises?.length || 0}
                          </span>
                        </div>
                      </div>
                      <Badge variant={rutina.category}>{rutina.category}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {selectedWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm mb-4">Sin entrenamientos programados</p>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddWorkout(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Agregar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => setSelectedWorkout(workout)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      workout.status === 'completed'
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-pulso-negro border-gray-800 hover:border-pulso-rojo/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">{workout.workout?.name || 'Entrenamiento'}</p>
                          {workout.status === 'completado' && (
                            <CheckCircle className="text-green-500" size={14} />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {workout.workout?.duration || 0} min • {workout.status === 'completado' ? 'Completado' : 'Pendiente'}
                        </p>
                      </div>
                      <Badge variant={workout.workout?.category || 'otro'}>{workout.workout?.category || 'otro'}</Badge>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  size="sm"
                  onClick={() => setShowAddWorkout(true)}
                >
                  <Plus size={14} className="mr-1" />
                  Agregar otro
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Modal detalle de entrenamiento */}
      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        title={selectedWorkout?.workout?.name || 'Entrenamiento'}
      >
        {selectedWorkout && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={selectedWorkout.workout?.category || 'otro'}>{selectedWorkout.workout?.category || 'otro'}</Badge>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selectedWorkout.status === 'completado' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {selectedWorkout.status === 'completado' ? 'Completado' : 'Pendiente'}
              </span>
            </div>

            <div className="flex items-center justify-around py-3 bg-pulso-negro rounded-xl">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{selectedWorkout.workout?.duration || 0}</p>
                <p className="text-gray-500 text-xs">minutos</p>
              </div>
            </div>

            {selectedWorkout.status === 'pendiente' ? (
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    const rutinaCompleta = workouts.find(w => w.id === selectedWorkout.workout_id) || selectedWorkout.workout;
                    if (rutinaCompleta) {
                      setSelectedWorkout(null);
                      cerrarModalPrincipal();
                      iniciarEntrenamiento(rutinaCompleta, selectedWorkout.id);
                    }
                  }}
                >
                  <Play size={16} className="mr-1" />
                  Iniciar Entrenamiento
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await completeScheduledWorkout(selectedWorkout.id);
                        // Cerrar modal y actualizar vista
                        setSelectedWorkout(null);
                        cerrarModalPrincipal();
                      } catch (error) {
                        console.error('Error completando workout:', error);
                        alert('Error al completar el entrenamiento');
                      }
                    }}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Completar
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (confirm('¿Eliminar este entrenamiento?')) {
                        try {
                          await deleteScheduledWorkout(selectedWorkout.id);
                          setSelectedWorkout(null);
                          cerrarModalPrincipal();
                        } catch (error) {
                          console.error('Error eliminando:', error);
                        }
                      }
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                <p className="text-green-400 text-sm font-medium">¡Entrenamiento completado!</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}