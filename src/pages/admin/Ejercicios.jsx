import { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { createExercise, updateExercise, deleteExercise } from '../../services/workoutService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Youtube, Dumbbell, Search } from 'lucide-react';

const MUSCLE_GROUPS = [
  'piernas', 'pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'core', 'cardio', 'otro'
];

export default function Ejercicios() {
  const { exercises, loading, refreshData } = useWorkouts();
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [saving, setSaving] = useState(false);
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExercise(null);
    setFormData({ name: '', description: '', videoUrl: '', muscleGroup: 'otro' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, formData);
        alert('Ejercicio actualizado correctamente');
      } else {
        await createExercise(formData);
        alert('Ejercicio creado correctamente');
      }
      await refreshData();
      closeModal();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exercise) => {
    if (!confirm(`¿Eliminar "${exercise.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteExercise(exercise.id);
      alert('Ejercicio eliminado');
      await refreshData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
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
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(exercise)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(exercise)}>
                        <Trash2 size={14} className="text-red-500" />
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

      {/* Modal Crear/Editar - DEJAR IGUAL, NO MODIFICAR */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre *"
            placeholder="Ej: Sentadillas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-gray-400 text-sm mb-2">Descripción</label>
            <textarea
              className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
              rows={3}
              placeholder="Descripción del ejercicio..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Input
            label="URL Video YouTube"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          />

          <div>
            <label className="block text-gray-400 text-sm mb-2">Grupo Muscular</label>
            <select
              className="w-full bg-pulso-negro border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pulso-rojo"
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
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Guardando...' : editingExercise ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
