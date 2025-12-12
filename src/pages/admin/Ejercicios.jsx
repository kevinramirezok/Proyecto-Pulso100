import { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { createExercise, updateExercise, deleteExercise } from '../../services/workoutService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Youtube, Dumbbell } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ejercicios</h1>
          <p className="text-gray-400">Biblioteca de ejercicios ({exercises.length})</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="mr-2" />
          Nuevo
        </Button>
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-3">
        {exercises.length === 0 ? (
          <Card className="text-center py-12">
            <Dumbbell className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-gray-400">No hay ejercicios creados</p>
            <Button className="mt-4" onClick={openCreateModal}>
              Crear primer ejercicio
            </Button>
          </Card>
        ) : (
          exercises.map((exercise) => (
            <Card key={exercise.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{exercise.name}</h3>
                  {exercise.video_url && (
                    <Youtube size={16} className="text-red-500" />
                  )}
                </div>
                <p className="text-gray-400 text-sm">{exercise.description || 'Sin descripción'}</p>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
                  {exercise.muscle_group || 'otro'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEditModal(exercise)}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(exercise)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Crear/Editar */}
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
