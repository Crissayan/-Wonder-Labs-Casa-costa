// Formatos de presentación (FR-060 a FR-063).
const miles = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

export const formatPrecio = (valor: number): string => `$${miles.format(valor)}`;

// YYYY-MM-DD → DD/MM/YYYY partiendo el texto, sin Date (evita desfases por zona horaria).
export const formatFecha = (iso: string): string => {
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
};

export const formatPuntaje = (puntaje: number): string => puntaje.toFixed(1);

export const formatEstrellas = (n: number): string => (n === 1 ? '1 ESTRELLA' : `${n} ESTRELLAS`);

export const formatDuracion = (dias: number): string => {
  const noches = dias - 1;
  return `${noches} ${noches === 1 ? 'Noche' : 'Noches'} · ${dias} ${dias === 1 ? 'Día' : 'Días'}`;
};
