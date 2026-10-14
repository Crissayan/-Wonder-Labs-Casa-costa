import type { Habitacion } from '@api/types';

type Props = {
  habitacion: Habitacion;
  imagenActiva: number;
  onCambiarImagen: (index: number) => void;
};

// Panel de detalle de habitación en escritorio (FR-033): miniaturas interactivas (clarificación 3),
// nombre, tipo y descripción.
export const HabitacionDetalle = ({ habitacion, imagenActiva, onCambiarImagen }: Props) => (
  <div className="flex w-[min(548px,37.6vw)] shrink-0 flex-col items-center" data-fv="habitacion-detalle">
    <div className="flex w-full gap-[3.65%]" role="group" aria-label={`Fotos de ${habitacion.nombre}`}>
      {habitacion.imagenes.map((imagen, i) => (
        <button
          key={imagen.id}
          type="button"
          onClick={() => onCambiarImagen(i)}
          aria-label={`Ver foto ${i + 1} de ${habitacion.nombre}`}
          aria-pressed={i === imagenActiva}
          className={`aspect-[170/156] flex-1 overflow-hidden rounded-img transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta ${
            i === imagenActiva ? 'ring-4 ring-cta' : 'opacity-90 hover:opacity-100'
          }`}
          data-fv={`habitacion-miniatura-${i + 1}`}
        >
          <img src={imagen.url} alt="" className="size-full object-cover" />
        </button>
      ))}
    </div>
    <h3 className="mt-[clamp(32px,5vw,70px)] text-center font-inter text-[clamp(26px,2.75vw,40px)] font-extrabold tracking-[0.04em] text-primary">
      {habitacion.nombre}
      <br />
      {habitacion.tipo}
    </h3>
    <p className="mt-[clamp(12px,1.5vw,24px)] max-w-[474px] text-center font-inter text-[clamp(16px,1.37vw,20px)] font-medium tracking-[0.04em] text-primary">
      {habitacion.descripcion}
    </p>
  </div>
);
