export default function MedalCard({ medal, unlocked, compact = false }) {
  return (
    <div
      className={`
        relative 
        ${compact ? 'p-2 rounded-lg' : 'p-4 rounded-xl'}
        border-2 transition-all
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/50' 
          : 'bg-pulso-negro/50 border-gray-800 opacity-50'
        }
        ${compact ? 'min-w-[90px] max-w-[120px] w-full' : ''}
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
        </div>
        {unlocked && (
          <div className={`${compact ? 'text-green-400' : 'text-green-500'}`}>
            ✓
          </div>
        )}
      </div>
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
          <span className={`${compact ? 'text-lg' : 'text-2xl'}`}>🔒</span>
        </div>
      )}
    </div>
  );
}
