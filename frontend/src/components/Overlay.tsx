import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from '../hooks/useOverlay';

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Clases del fondo (opacidad del frame). */
  backdropClassName?: string;
  /** Clases del contenedor que centra el contenido. */
  className?: string;
  fvId?: string;
};

// Capa modal accesible: role="dialog", cierre con fondo, Esc y botón (research D-06).
export const Overlay = ({
  open,
  onClose,
  label,
  children,
  backdropClassName = 'bg-primary/95',
  className = 'items-center justify-center',
  fvId,
}: Props) => {
  const containerRef = useOverlay(open, onClose);
  if (!open) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 flex overflow-y-auto ${className}`}>
      <div
        className={`fixed inset-0 ${backdropClassName}`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="overlay-fondo"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative z-10"
        data-fv={fvId}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

// Botón cerrar del toolkit: círculo `cta` con aspa blanca (frames "Group 28/29"; color por P-18).
export const CloseButton = ({ onClick, className = '', size = 40 }: { onClick: () => void; className?: string; size?: number }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Cerrar"
    data-fv="cerrar"
    className={`flex shrink-0 items-center justify-center rounded-full bg-cta text-white ${className}`}
    style={{ width: size, height: size }}
  >
    <X size={size * 0.7} strokeWidth={size > 50 ? 1.6 : 2} />
  </button>
);
