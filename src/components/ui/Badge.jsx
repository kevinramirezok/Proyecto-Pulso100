const VARIANTS = {
  bicicleta: 'bg-blue-500 text-white',
  running: 'bg-green-500 text-white',
  fuerza: 'bg-pulso-rojo text-white',
  natacion: 'bg-cyan-500 text-white',
  otro: 'bg-gray-500 text-white',
};

export default function Badge({ children, variant = 'otro', className = '' }) {
  return (
    <span className={`
      inline-flex items-center
      px-3 py-1 
      rounded-full 
      text-xs font-bold 
      ${VARIANTS[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
}