import { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { createWorkout, updateWorkout, deleteWorkout } from '../../services/workoutService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Clock, Flame, ChevronDown, ChevronUp, X, Search, GripVertical, Youtube } from 'lucide-react';

const CATEGORIES = [
  { key: 'fuerza', label: 'Fuerza' },
  { key: 'running', label: 'Running' },
  { key: 'bicicleta', label: 'Bicicleta' },
  { key: 'natacion', label: 'Natación' },
  { key: 'otro', label: 'Otro' },
];

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

const MUSCLE_GROUPS = ['todos', 'piernas', 'pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'core', 'cardio', 'otro'];

export default function RutinasAdmin() {
  const { workouts, exercises, loading, refreshData } = useWorkouts();
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Búsqueda y filtros de ejercicios
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('todos');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    level: 'Intermedio',
    calories: 200,
    category: 'fuerza'
  });
  
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Filtrar ejercicios disponibles
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle = muscleFilter === 'todos' || ex.muscle_group === muscleFilter;
    const notSelected = !selectedExercises.find(s => s.exerciseId === ex.id);
    return matchesSearch && matchesMuscle && notSelected;
  });

  const openCreateModal = () => {
    setEditingWorkout(null);
    setFormData({
      name: '',
      description: '',
      duration: 30,
      level: 'Intermedio',
      calories: 200,
      category: 'fuerza'
    });
    setSelectedExercises([]);
    setExerciseSearch('');
    setMuscleFilter('todos');
    setShowModal(true);
  };

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      description: workout.description || '',
      duration: workout.duration,
      level: workout.level,
      calories: workout.calories,
      category: workout.category
    });
    setSelectedExercises(
      workout.exercises?.map(ex => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        reps: ex.reps || '',
        notes: ex.notes || '',
        videoUrl: ex.videoUrl || ''
      })) || []
    );
    setExerciseSearch('');
    setMuscleFilter('todos');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWorkout(null);
    setSelectedExercises([]);
  };

  const addExercise = (exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        reps: '',
        notes: '',
        videoUrl: exercise.video_url || ''
      }
    ]);
    setExerciseSearch('');
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExerciseField = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  };

  const moveExercise = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedExercises.length) return;
    
    const updated = [...selectedExercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (selectedExercises.length === 0) {
      alert('Agregá al menos un ejercicio');
      return;
    }

    setSaving(true);
    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, formData, selectedExercises);
        alert('Rutina actualizada correctamente');
      } else {
        await createWorkout(formData, selectedExercises);
        alert('Rutina creada correctamente');
      }
      await refreshData();
      closeModal();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (workout) => {
    if (!confirm(`¿Eliminar "${workout.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteWorkout(workout.id);
      alert('Rutina eliminada');
      await refreshData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Cargando rutinas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Rutinas</h1>
          <p className="text-gray-400">Gestión de rutinas ({workouts.length})</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="mr-2" />
          Nueva Rutina
        </Button>
      </div>

      {/* Lista de rutinas */}
      <div className="grid gap-4">
        {workouts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay rutinas creadas</p>
            <Button onClick={openCreateModal}>
              Crear primera rutina
            </Button>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="hover:border-pulso-rojo/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-lg truncate">{workout.name}</h3>
                    <Badge variant={workout.category}>{workout.category}</Badge>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                      {workout.level}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{workout.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-blue-400">
                      <Clock size={14} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame size={14} />
                      {workout.calories} kcal
                    </span>
                    <span className="text-gray-500">
                      {workout.exercises?.length || 0} ejercicios
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => openEditModal(workout)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(workout)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingWorkout ? 'Editar Rutina' : 'Nueva Rutina'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <Input
              label="Nombre de la rutina *"
              placeholder="Ej: Full Body Strength"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-gray-400 text-sm mb-2">Descripción</label>
              <textarea
                className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo resize-none"
                rows={2}
                placeholder="Descripción breve de la rutina..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Duración (min)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
                  value={formData.duration}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, duration: val ? parseInt(val) : '' });
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Calorías</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
                  value={formData.calories}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, calories: val ? parseInt(val) : '' });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Categoría</label>
                <select
                  className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nivel</label>
                <select
                  className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700" />

          {/* Sección de ejercicios */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Ejercicios 
              <span className="text-pulso-rojo ml-2">({selectedExercises.length})</span>
            </h3>

            {/* Buscador de ejercicios */}
            <div className="bg-pulso-negro border border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar ejercicio..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-pulso-rojo"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pulso-rojo"
                  value={muscleFilter}
                  onChange={(e) => setMuscleFilter(e.target.value)}
                >
                  {MUSCLE_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group === 'todos' ? 'Todos' : group.charAt(0).toUpperCase() + group.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de ejercicios disponibles */}
              {/* Lista de ejercicios disponibles */}
              <div className="max-h-40 overflow-y-auto">
                {filteredExercises.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {exerciseSearch ? 'No se encontraron ejercicios' : 'Todos los ejercicios agregados'}
                  </p>
                ) : (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-pulso-negro">
                      <tr className="text-xs text-gray-500 border-b border-gray-700">
                        <th className="text-left py-2 px-2 font-normal">Nombre</th>
                        <th className="text-center py-2 px-2 font-normal w-12">Video</th>
                        <th className="text-center py-2 px-2 font-normal w-24">Músculo</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExercises.map((exercise) => (
                        <tr
                          key={exercise.id}
                          className="hover:bg-gray-800 cursor-pointer transition-colors group"
                          onClick={() => addExercise(exercise)}
                        >
                          <td className="py-2 px-2 text-white text-sm">{exercise.name}</td>
                          <td className="py-2 px-2 text-center">
                            {exercise.video_url ? (
                              <Youtube size={14} className="text-red-500 inline-block" />
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center text-gray-500 text-xs">{exercise.muscle_group}</td>
                          <td className="py-2 px-2 text-center">
                            <Plus size={16} className="text-pulso-rojo opacity-0 group-hover:opacity-100 transition-opacity inline-block" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Ejercicios seleccionados */}
            {selectedExercises.length > 0 && (
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-gray-500">
                        <GripVertical size={14} />
                        <span className="text-pulso-rojo font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-white font-medium text-sm flex-1">{exercise.name}</span>
                      {exercise.videoUrl && (
                        <Youtube size={14} className="text-red-500" />
                      )}
                      <div className="flex gap-1">
                        <button 
                          type="button" 
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === selectedExercises.length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeExercise(index)}
                          className="p-1 text-red-500 hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Series x Reps (ej: 4x12)"
                        className="bg-pulso-negro border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pulso-rojo"
                        value={exercise.reps}
                        onChange={(e) => updateExerciseField(index, 'reps', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Notas (opcional)"
                        className="bg-pulso-negro border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pulso-rojo"
                        value={exercise.notes}
                        onChange={(e) => updateExerciseField(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedExercises.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-500 text-sm">Buscá y agregá ejercicios desde el panel de arriba</p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Guardando...' : editingWorkout ? 'Actualizar Rutina' : 'Crear Rutina'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}