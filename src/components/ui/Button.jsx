export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'bg-pulso-rojo hover:bg-red-600 text-white',
    secondary: 'bg-pulso-azul hover:bg-pulso-azulClaro text-white',
    outline: 'border-2 border-pulso-rojo text-pulso-rojo hover:bg-pulso-rojo hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`
        rounded-lg font-semibold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-pulso-rojo focus:ring-offset-2 focus:ring-offset-pulso-negro
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}