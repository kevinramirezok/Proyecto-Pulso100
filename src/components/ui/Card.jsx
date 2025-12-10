export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-pulso-negroSec border border-gray-800 rounded-xl shadow-lg p-6 ${className}`}
      style={{ padding: '1.5rem' }}
    >
      {children}
      <style>{`
        @media (max-width: 400px) {
          .bg-pulso-negroSec.rounded-xl.shadow-lg {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}