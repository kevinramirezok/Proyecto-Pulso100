export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label,
  icon,
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
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full ${icon ? 'pl-10 pr-4' : 'px-4'} py-3 
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
    </div>
  );
}