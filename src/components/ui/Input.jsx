export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 
          bg-pulso-negroSec 
          text-white 
          border border-gray-700 
          rounded-lg 
          focus:outline-none 
          focus:border-pulso-rojo 
          focus:ring-2 
          focus:ring-pulso-rojo/20 
          transition-all
          placeholder:text-gray-500
          ${className}
        `}
        {...props}
      />
    </div>
  );
}