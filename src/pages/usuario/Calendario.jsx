// src/pages/usuario/Calendario.jsx
import { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { WORKOUTS, CATEGORIES } from '../../data/mockWorkouts';
import CalendarioCustom from '../../components/calendar/CalendarioCustom';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { CheckCircle, Trash2, Clock, Plus, Dumbbell, ArrowLeft, Flame, Filter } from 'lucide-react';

export default function Calendario() {
  const { scheduledWorkouts, scheduleWorkout, completeScheduledWorkout, deleteScheduledWorkout } = useSchedule();
  
  // Estados del modal principal (día seleccionado)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  
  // Estado del modal de detalle de entrenamiento
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // Estado para agregar entrenamiento
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleDayClick = (fecha, workouts) => {
    setSelectedDate(fecha);
    setSelectedWorkouts(workouts);
    setShowAddWorkout(false);
    setFilterCategory('all');
  };

  const formatearFecha = (fecha) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const handleAgregarEntrenamiento = (rutina) => {
    console.log('=== AGREGANDO ENTRENAMIENTO ===');
    console.log('Rutina:', rutina);
    console.log('Fecha seleccionada:', selectedDate);
    if (!selectedDate) {
      console.log('ERROR: No hay fecha seleccionada');
      return;
    }
    
    scheduleWorkout(rutina, selectedDate.toISOString());
    console.log('Entrenamiento programado!');
    // Actualizar la lista de workouts del día
    const nuevoWorkout = {
      id: Date.now(),
      workoutId: rutina.id,
      workoutName: rutina.name,
      workoutCategory: rutina.category,
      workoutDuration: rutina.duration,
      scheduledDate: selectedDate.toISOString(),
      status: 'pending',
    };
    
    setSelectedWorkouts(prev => [...prev, nuevoWorkout]);
    setShowAddWorkout(false);
  };

  const cerrarModalPrincipal = () => {
    setSelectedDate(null);
    setSelectedWorkouts([]);
    setShowAddWorkout(false);
    setFilterCategory('all');
  };

  // Filtrar rutinas por categoría
  const rutinasFiltradas = filterCategory === 'all' 
    ? WORKOUTS 
    : WORKOUTS.filter(w => w.category === filterCategory);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Calendario</h1>
        <p className="text-gray-400">Organizá tus entrenamientos</p>
      </div>

      {/* Leyenda */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="bicicleta">Bicicleta</Badge>
        <Badge variant="running">Running</Badge>
        <Badge variant="fuerza">Fuerza</Badge>
        <Badge variant="natacion">Natación</Badge>
        <Badge variant="otro">Otro</Badge>
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
        {/* Vista: Seleccionar rutina para agregar */}
        {showAddWorkout ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowAddWorkout(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
            
            <h4 className="text-white font-bold text-lg">Elegí una rutina:</h4>
            
            {/* Filtro por categoría */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFilterCategory(cat.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === cat.key
                      ? 'bg-pulso-rojo text-white'
                      : 'bg-pulso-negro text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {rutinasFiltradas.map((rutina) => (
                <div
                  key={rutina.id}
                  onClick={() => {
                    console.log('Click en rutina:', rutina.name);
                    handleAgregarEntrenamiento(rutina);
                  }}
                  className="bg-pulso-negro p-4 rounded-xl cursor-pointer hover:border hover:border-pulso-rojo/50 transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="text-white font-semibold">{rutina.name}</h5>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">{rutina.description}</p>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {rutina.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={14} className="text-orange-500" />
                          {rutina.calories} kcal
                        </span>
                      </div>
                    </div>
                    <Badge variant={rutina.category}>{rutina.category}</Badge>
                  </div>
                </div>
              ))}
              
              {rutinasFiltradas.length === 0 && (
                <p className="text-gray-500 text-center py-8">No hay rutinas en esta categoría</p>
              )}
            </div>
          </div>
        ) : (
          /* Vista: Lista de entrenamientos del día */
          <>
            {selectedWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-6">No hay entrenamientos programados</p>
                <Button 
                  variant="primary" 
                  className="mx-auto"
                  onClick={() => setShowAddWorkout(true)}
                >
                  <Plus size={20} className="mr-2" />
                  Agregar Entrenamiento
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => {
                      console.log('Click en workout:', workout.workoutName);
                      setSelectedWorkout(workout);
                    }}
                    className="bg-pulso-negro border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-pulso-rojo/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{workout.workoutName}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock size={14} />
                          <span>{workout.workoutDuration} min</span>
                        </div>
                      </div>
                      <Badge variant={workout.workoutCategory}>{workout.workoutCategory}</Badge>
                    </div>

                    <div className={`text-sm font-semibold ${
                      workout.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {workout.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
                    </div>
                  </div>
                ))}
                
                {/* Botón para agregar más */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setShowAddWorkout(true)}
                >
                  <Plus size={18} className="mr-2" />
                  Agregar otro entrenamiento
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
        title={selectedWorkout?.workoutName}
      >
        {selectedWorkout && (
          <div className="space-y-6">
            <Badge variant={selectedWorkout.workoutCategory}>
              {selectedWorkout.workoutCategory}
            </Badge>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pulso-negro rounded-lg p-4">
                <Clock className="text-blue-400 mb-2" size={20} />
                <p className="text-gray-400 text-xs mb-1">Duración</p>
                <p className="text-white font-bold">{selectedWorkout.workoutDuration} min</p>
              </div>
              
              <div className="bg-pulso-negro rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Estado</p>
                <p className={`font-bold ${
                  selectedWorkout.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {selectedWorkout.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
                </p>
              </div>
            </div>

            {selectedWorkout.status === 'pending' ? (
              <div className="space-y-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    completeScheduledWorkout(selectedWorkout.id);
                    setSelectedWorkouts(prev => 
                      prev.map(w => w.id === selectedWorkout.id 
                        ? { ...w, status: 'completed' } 
                        : w
                      )
                    );
                    setSelectedWorkout(null);
                  }}
                >
                  <CheckCircle size={20} className="mr-2" />
                  Marcar como Completado
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    if (confirm('¿Eliminar este entrenamiento programado?')) {
                      deleteScheduledWorkout(selectedWorkout.id);
                      setSelectedWorkouts(prev => 
                        prev.filter(w => w.id !== selectedWorkout.id)
                      );
                      setSelectedWorkout(null);
                    }
                  }}
                >
                  <Trash2 size={18} className="mr-2" />
                  Eliminar
                </Button>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                <p className="text-green-500 font-semibold">¡Entrenamiento completado!</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}