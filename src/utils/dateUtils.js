/**
 * Formatea una fecha a string YYYY-MM-DD en hora local
 * (sin problemas de timezone UTC)
 */
export const formatearFechaLocal = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD (hora local)
 */
export const obtenerHoyLocal = () => {
  return formatearFechaLocal(new Date());
};
