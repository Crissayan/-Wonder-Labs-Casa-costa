import { useReserva } from '../hooks/useReserva';

type Props = {
  label?: 'RESERVAR' | 'RESERVA';
  className?: string;
  onBeforeOpen?: () => void;
  fvId?: string;
};

// Todo CTA de reserva abre el mismo modal (R-02, FR-003). "Variante 2" del toolkit = hover.
export const ReservarButton = ({ label = 'RESERVAR', className = '', onBeforeOpen, fvId }: Props) => {
  const { abrirReserva } = useReserva();
  return (
    <button
      type="button"
      data-fv={fvId}
      onClick={() => {
        onBeforeOpen?.();
        abrirReserva();
      }}
      className={`rounded-btn-m bg-cta font-inter font-bold italic text-primary transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta lg:rounded-btn ${className}`}
    >
      {label}
    </button>
  );
};
