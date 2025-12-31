import { useState } from 'react';
import Modal from '../ui/Modal';
import { X, Trophy, Target, Flame, CheckCircle } from 'lucide-react';

export default function MedalCard({ medal, unlocked, progress = 0, compact = false }) {
  const [showModal, setShowModal] = useState(false);

  // Formatear el requisito para mostrarlo en el modal
  const getRequirementText = () => {
    switch (medal.requirement_type) {
      case 'entrenamientos_completados':
        return `Completá ${medal.requirement_value} ${medal.requirement_value === 1 ? 'entrenamiento' : 'entrenamientos'}`;
      case 'dias_consecutivos':
        return `Entrená ${medal.requirement_value} ${medal.requirement_value === 1 ? 'día consecutivo' : 'días consecutivos'}`;
      case 'calorias_quemadas':
        return `Quemá ${medal.requirement_value} calorías en total`;
      case 'hora_entrenamiento':
        return `Entrená antes de las 7 AM, ${medal.requirement_value} ${medal.requirement_value === 1 ? 'vez' : 'veces'}`;
      default:
        return medal.description;
    }
  };

  const getProgressText = () => {
    if (unlocked) return 'Desbloqueada';
    if (!medal.currentValue && medal.currentValue !== 0) return 'Sin progreso';
    return `${medal.currentValue || 0} / ${medal.requirement_value}`;
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`
          relative cursor-pointer
          ${compact ? 'p-2 rounded-lg' : 'p-4 rounded-xl'}
          border-2 transition-all
          ${unlocked 
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/50 hover:border-yellow-500/70' 
            : 'bg-pulso-negro/50 border-gray-800 hover:border-gray-700'
          }
          ${compact ? 'min-w-[90px] max-w-[120px] w-full' : ''}
          ${!unlocked && 'opacity-60 hover:opacity-80'}
        `}
      >
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
          <div className={`${compact ? 'text-2xl' : 'text-3xl'} ${!unlocked && 'grayscale'}`}>
            {medal.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold ${unlocked ? 'text-white' : 'text-gray-500'} ${compact ? 'text-[11px] leading-tight' : 'text-sm'}`}>
              {medal.name}
            </h4>
            {!compact && (
              <p className={`text-xs mt-0.5 ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                {medal.description}
              </p>
            )}
            {!unlocked && progress > 0 && (
              <div className="mt-1">
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full bg-gradient-to-r from-pulso-rojo to-orange-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{progress}%</p>
              </div>
            )}
          </div>
          {unlocked && (
            <div className={`${compact ? 'text-green-400' : 'text-green-500'}`}>
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Modal con información de la medalla */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-pulso-negro border-2 border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`text-5xl ${!unlocked && 'grayscale'}`}>
                {medal.icon}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {medal.name}
                </h3>
                <p className="text-sm text-gray-500">{medal.category || 'Logro'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm">
              {medal.description}
            </p>
          </div>

          {/* Requisito */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-pulso-rojo" />
              <h4 className="text-white font-semibold text-sm">Requisito</h4>
            </div>
            <p className="text-gray-300 text-sm">
              {getRequirementText()}
            </p>
          </div>

          {/* Progreso */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {unlocked ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <Trophy size={16} className="text-gray-500" />
                )}
                <h4 className="text-white font-semibold text-sm">Progreso</h4>
              </div>
              <span className={`text-sm font-bold ${unlocked ? 'text-green-500' : 'text-gray-400'}`}>
                {getProgressText()}
              </span>
            </div>
            {!unlocked && progress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-pulso-rojo to-orange-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {unlocked && medal.unlocked_at && (
              <p className="text-xs text-gray-500 mt-2">
                Desbloqueada el {new Date(medal.unlocked_at).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
