import { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { createExercise, updateExercise, deleteExercise } from '../../services/workoutService';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Youtube, Dumbbell, Search, Loader2, AlertCircle } from 'lucide-react';

const MUSCLE_GROUPS = [
  'piernas', 'pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'core', 'cardio', 'otro'
];

export default function Ejercicios() {
  const { exercises, loading, refreshData } = useWorkouts();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: '',
    muscleGroup: 'otro'
  });
  // Estados para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('todos');

  const openCreateModal = () => {
    setEditingExercise(null);
    setFormData({ name: '', description: '', videoUrl: '', muscleGroup: 'otro' });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      description: exercise.description || '',
      videoUrl: exercise.video_url || '',
      muscleGroup: exercise.muscle_group || 'otro'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExercise(null);
    setFormData({ name: '', description: '', videoUrl: '', muscleGroup: 'otro' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (formData.videoUrl && !formData.videoUrl.includes('youtube.com') && !formData.videoUrl.includes('youtu.be')) {
      errors.videoUrl = 'Debe ser una URL válida de YouTube';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores del formulario');
      return;
    }

    setSaving(true);
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, formData);
        toast.success('✅ Ejercicio actualizado correctamente');
      } else {
        await createExercise(formData);
        toast.success('✅ Ejercicio creado correctamente');
      }
      await refreshData();
      closeModal();
    } catch (error) {
      toast.error('❌ Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!exerciseToDelete) return;

    setDeletingId(exerciseToDelete.id);
    try {
      await deleteExercise(exerciseToDelete.id);
      toast.success('✅ Ejercicio eliminado correctamente');
      await refreshData();
      setShowDeleteModal(false);
      setExerciseToDelete(null);
    } catch (error) {
      toast.error('❌ Error al eliminar: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtrado de ejercicios y stats
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = filterMuscle === 'todos' || ex.muscle_group === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  const stats = {
    total: exercises.length,
    withVideo: exercises.filter(e => e.video_url).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Ejercicios</h1>
          <p className="text-gray-400">Biblioteca de ejercicios</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="mr-2" />
          Nuevo Ejercicio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm">Total ejercicios</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">{stats.withVideo}</p>
            <p className="text-gray-400 text-sm">Con video</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-500">{stats.total - stats.withVideo}</p>
            <p className="text-gray-400 text-sm">Sin video</p>
          </div>
        </Card>
      </div>

      {/* Buscador y filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            className="w-full bg-pulso-negroSec border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pulso-rojo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-pulso-negroSec border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pulso-rojo"
          value={filterMuscle}
          onChange={(e) => setFilterMuscle(e.target.value)}
        >
          <option value="todos">Todos los músculos</option>
          {MUSCLE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de ejercicios */}
      <Card className="overflow-hidden p-0">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-gray-400 mb-4">
              {searchTerm || filterMuscle !== 'todos' 
                ? 'No se encontraron ejercicios con esos filtros' 
                : 'No hay ejercicios creados'}
            </p>
            {!searchTerm && filterMuscle === 'todos' && (
              <Button onClick={openCreateModal}>
                Crear primer ejercicio
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-sm text-gray-400">
                <th className="py-3 px-4 font-medium">Nombre</th>
                <th className="py-3 px-4 font-medium text-center w-20">Video</th>
                <th className="py-3 px-4 font-medium w-32">Músculo</th>
                <th className="py-3 px-4 font-medium w-28 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredExercises.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{exercise.name}</p>
                      <p className="text-gray-500 text-sm truncate max-w-xs">
                        {exercise.description || 'Sin descripción'}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {exercise.video_url ? (
                      <Youtube size={18} className="text-red-500 inline-block" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded capitalize">
                      {exercise.muscle_group || 'otro'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => openEditModal(exercise)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => confirmDelete(exercise)}
                        disabled={deletingId === exercise.id}
                        className="transition-all duration-200 hover:scale-105 hover:border-red-500"
                      >
                        {deletingId === exercise.id ? (
                          <Loader2 size={14} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={14} className="text-red-500" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Contador de resultados */}
      {(searchTerm || filterMuscle !== 'todos') && filteredExercises.length > 0 && (
        <p className="text-gray-500 text-sm text-center">
          Mostrando {filteredExercises.length} de {exercises.length} ejercicios
        </p>
      )}

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Sentadillas"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
              className={`w-full bg-pulso-negro border rounded-lg p-3 text-white focus:outline-none transition-colors duration-200 ${
                formErrors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:border-pulso-rojo'
              }`}
            />
            {formErrors.name && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{formErrors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Descripción</label>
            <textarea
              className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo transition-colors duration-200"
              rows={3}
              placeholder="Descripción del ejercicio..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">URL Video YouTube</label>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={(e) => {
                setFormData({ ...formData, videoUrl: e.target.value });
                if (formErrors.videoUrl) setFormErrors({ ...formErrors, videoUrl: null });
              }}
              className={`w-full bg-pulso-negro border rounded-lg p-3 text-white focus:outline-none transition-colors duration-200 ${
                formErrors.videoUrl 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:border-pulso-rojo'
              }`}
            />
            {formErrors.videoUrl && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{formErrors.videoUrl}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Grupo Muscular</label>
            <select
              className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo transition-colors duration-200"
              value={formData.muscleGroup}
              onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
            >
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 transition-all duration-200 hover:scale-105" 
              onClick={closeModal}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 transition-all duration-200 hover:scale-105" 
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </span>
              ) : (
                editingExercise ? 'Actualizar' : 'Crear'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setExerciseToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-white font-medium mb-1">
                ¿Estás seguro de eliminar este ejercicio?
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">"{exerciseToDelete?.name}"</span> será eliminado permanentemente. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 transition-all duration-200 hover:scale-105" 
              onClick={() => {
                setShowDeleteModal(false);
                setExerciseToDelete(null);
              }}
              disabled={deletingId !== null}
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="flex-1 bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-105"
            >
              {deletingId !== null ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
