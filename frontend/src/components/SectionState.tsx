import type { ReactNode } from 'react';
import { mensajes } from '../messages';

type Props = {
  status: 'loading' | 'error' | 'empty';
  emptyMessage?: ReactNode;
  className?: string;
};

// Estados de una sección con datos: cargando (skeleton), vacío y error (FR-065, Principio VI).
export const SectionState = ({ status, emptyMessage, className = '' }: Props) => {
  if (status === 'loading') {
    return (
      <div className={`flex flex-col gap-4 ${className}`} role="status" aria-label="Cargando">
        <div className="h-40 w-full animate-pulse rounded-bloque bg-surface" />
        <div className="h-6 w-2/3 animate-pulse rounded-bloque bg-surface" />
      </div>
    );
  }
  return (
    <p
      className={`rounded-bloque bg-surface px-6 py-8 text-center font-inter text-parrafo text-primary lg:text-parrafo-lg ${className}`}
      role={status === 'error' ? 'alert' : undefined}
    >
      {status === 'error' ? mensajes.errorSeccion : emptyMessage}
    </p>
  );
};
