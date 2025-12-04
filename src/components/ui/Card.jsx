export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-pulso-negroSec 
      border border-gray-800 
      rounded-xl 
      shadow-lg 
      p-6 
      ${className}
    `}>
      {children}
    </div>
  );
}