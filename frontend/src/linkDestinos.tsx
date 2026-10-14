import type { Destino } from '@api/types';
import type { ReactNode } from 'react';

const escape = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Envuelve en un enlace cada destino del catálogo mencionado en la descripción (R-21, FR-024).
// Coincidencia exacta, sensible a mayúsculas y tildes; los demás nombres quedan como texto.
export const linkDestinos = (
  descripcion: string,
  destinos: Pick<Destino, 'slug' | 'nombre'>[],
  renderLink: (destino: Pick<Destino, 'slug' | 'nombre'>, key: string) => ReactNode,
): ReactNode[] => {
  const candidatos = [...destinos].filter((d) => d.nombre).sort((a, b) => b.nombre.length - a.nombre.length);
  if (candidatos.length === 0) return [descripcion];
  const patron = new RegExp(`(${candidatos.map((d) => escape(d.nombre)).join('|')})`, 'g');
  return descripcion.split(patron).map((parte, i) => {
    const destino = candidatos.find((d) => d.nombre === parte);
    return destino ? renderLink(destino, `${destino.slug}-${i}`) : parte;
  });
};
