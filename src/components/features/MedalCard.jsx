export default function MedalCard({ medal, unlocked, progress = 0, compact = false }) {
  return (
    <div
      className={`
        relative 
        ${compact ? 'p-2 rounded-lg' : 'p-4 rounded-xl'}
        border-2 transition-all
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/50' 
          : 'bg-pulso-negro/50 border-gray-800'
        }
        ${compact ? 'min-w-[90px] max-w-[120px] w-full' : ''}
        ${!unlocked && 'opacity-60'}
      `}
    >
      <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
        <div className={`${compact ? 'text-2xl' : 'text-3xl'} ${!unlocked && 'grayscale'}`}>
          {medal.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold truncate ${unlocked ? 'text-white' : 'text-gray-500'} ${compact ? 'text-xs' : ''}`}>
            {medal.name}
          </h4>
          {!compact && (
            <p className={`text-xs ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
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
  );
}
