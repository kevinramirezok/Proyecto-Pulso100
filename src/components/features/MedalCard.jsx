export default function MedalCard({ medal, unlocked }) {
  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/50' 
          : 'bg-pulso-negro/50 border-gray-800 opacity-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`text-3xl ${!unlocked && 'grayscale'}`}>
          {medal.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
            {medal.name}
          </h4>
          <p className={`text-xs ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {medal.description}
          </p>
        </div>
        {unlocked && (
          <div className="text-green-500">
            ✓
          </div>
        )}
      </div>
      
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
}
