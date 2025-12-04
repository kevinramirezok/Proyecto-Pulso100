import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { WORKOUTS, CATEGORIES } from '../../data/mockWorkouts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Clock, Flame, TrendingUp, Search, Play, Calendar, CheckCircle } from 'lucide-react';

export default function Rutinas() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const { completeWorkout, isWorkoutCompleted } = useProgress();

    const filteredWorkouts = WORKOUTS.filter(workout => {
        const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
        const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Rutinas</h1>
                <p className="text-gray-400">Explorá y elegí tu próximo entrenamiento</p>
            </div>

            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar rutinas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-pulso-negroSec text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pulso-rojo"
                />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${selectedCategory === key
                                ? 'bg-pulso-rojo text-white'
                                : 'bg-pulso-negroSec text-gray-400 hover:text-white border border-gray-700'
                            }
            `}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Lista de Rutinas */}
            <div className="space-y-4">
                {filteredWorkouts.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-400">No se encontraron rutinas</p>
                    </Card>
                ) : (
                    filteredWorkouts.map((workout) => (
                        <Card key={workout.id} className="hover:border-pulso-rojo/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">{workout.name}</h3>
                                    <p className="text-gray-400 text-sm">{workout.description}</p>
                                </div>
                                <Badge variant={workout.category}>{workout.category}</Badge>
                            </div>

                            <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{workout.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Flame size={16} />
                                    <span>{workout.calories} kcal</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp size={16} />
                                    <span>{workout.level}</span>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedWorkout(workout)}
                            >
                                Ver Detalle
                            </Button>
                        </Card>
                    ))
                )}
            </div>

            {/* Modal Detalle */}
            <Modal
                isOpen={!!selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
                title={selectedWorkout?.name}
            >
                {selectedWorkout && (
                    <div className="space-y-6">
                        {/* Info Principal */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={selectedWorkout.category}>{selectedWorkout.category}</Badge>
                            <span className="text-gray-400 text-sm">{selectedWorkout.level}</span>
                        </div>

                        <p className="text-gray-300">{selectedWorkout.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-pulso-negro rounded-lg p-4 text-center">
                                <Clock className="mx-auto mb-2 text-blue-500" size={24} />
                                <p className="text-white font-bold">{selectedWorkout.duration} min</p>
                                <p className="text-gray-400 text-xs">Duración</p>
                            </div>
                            <div className="bg-pulso-negro rounded-lg p-4 text-center">
                                <Flame className="mx-auto mb-2 text-orange-500" size={24} />
                                <p className="text-white font-bold">{selectedWorkout.calories} kcal</p>
                                <p className="text-gray-400 text-xs">Calorías</p>
                            </div>
                            <div className="bg-pulso-negro rounded-lg p-4 text-center">
                                <TrendingUp className="mx-auto mb-2 text-green-500" size={24} />
                                <p className="text-white font-bold">{selectedWorkout.level}</p>
                                <p className="text-gray-400 text-xs">Nivel</p>
                            </div>
                        </div>

                        {/* Ejercicios */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Ejercicios</h3>
                            <div className="space-y-3">
                                {selectedWorkout.exercises.map((exercise, index) => (
                                    <div key={index} className="bg-pulso-negro rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-pulso-rojo/10 text-pulso-rojo rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold mb-1">{exercise.name}</h4>
                                                <p className="text-gray-400 text-sm mb-1">{exercise.reps}</p>
                                                <p className="text-gray-500 text-xs">{exercise.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="space-y-3">
                            {isWorkoutCompleted(selectedWorkout.id) ? (
                                <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 text-center">
                                    <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                                    <p className="text-green-500 font-semibold">¡Rutina Completada!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="secondary" size="md" className="w-full flex items-center justify-center">
                                        <Calendar size={18} className="mr-1" />
                                        <span className="text-sm">Programar</span>
                                    </Button>
                                    <Button variant="outline" size="md" className="w-full flex items-center justify-center">
                                        <Play size={18} className="mr-1" />
                                        <span className="text-sm">Iniciar</span>
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="w-full col-span-2 flex items-center justify-center"
                                        onClick={() => {
                                            completeWorkout(selectedWorkout.id);
                                            alert('¡Rutina completada! 🎉');
                                        }}
                                    >
                                        <CheckCircle size={18} className="mr-1" />
                                        <span className="text-sm">Marcar como Completada</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}