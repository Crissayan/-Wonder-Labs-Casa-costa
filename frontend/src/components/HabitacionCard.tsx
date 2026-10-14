import type { Habitacion } from '@api/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { circular } from '../hooks/useCarousel';

type Props = {
  habitacion: Habitacion;
  variant: 'escritorio' | 'mobile';
  imagenActiva: number;
  onCambiarImagen: (index: number) => void;
};

const personas = (n: number) => `Hasta ${n} ${n === 1 ? 'persona' : 'personas'}`;

// Tarjeta de habitación (FR-032): escritorio 580×580 (frame 454:895), mobile 329×316 (551:3055).
// Sin precio (R-22). La etiqueta "Hasta N personas" de la primera foto viene incrustada en la imagen de Figma.
export const HabitacionCard = ({ habitacion, variant, imagenActiva, onCambiarImagen }: Props) => {
  const { imagenes } = habitacion;
  const imagen = imagenes[imagenActiva] ?? imagenes[0];
  const varias = imagenes.length > 1;

  if (variant === 'escritorio') {
    return (
      <article
        className="flex aspect-square w-[min(580px,39.8vw)] shrink-0 flex-col rounded-bloque bg-surface px-[clamp(18px,1.83vw,27px)] pt-[clamp(20px,2.13vw,31px)] shadow-elevada"
        data-fv="habitacion-tarjeta"
      >
        {imagen ? (
          <img
            src={imagen.url}
            alt={imagen.alt}
            className="aspect-[526/331] w-full rounded-img object-cover"
            data-fv="habitacion-imagen"
          />
        ) : (
          <div className="aspect-[526/331] w-full rounded-img bg-white/60" aria-hidden="true" />
        )}
        <h3 className="mt-[clamp(8px,1.03vw,15px)] font-inter text-[clamp(26px,2.75vw,40px)] font-extrabold tracking-[0.04em] text-primary">{habitacion.nombre}</h3>
        <p className="mt-[clamp(10px,1.3vw,19px)] font-inter text-[clamp(20px,2.2vw,32px)] font-medium tracking-[0.04em] text-primary">{habitacion.camasDescripcion}</p>
        <p className="font-inter text-[clamp(20px,2.2vw,32px)] font-medium tracking-[0.04em] text-primary">{personas(habitacion.capacidadMax)}</p>
      </article>
    );
  }

  return (
    <article className="h-[316px] w-[329px] rounded-bloque bg-surface px-[10px] pt-[10px] shadow-tarjeta" data-fv="habitacion-tarjeta-mobile">
      <div className="relative h-[192px] w-[309px] overflow-hidden rounded-img bg-white/60" data-fv="habitacion-imagen-mobile">
        {imagen && <img src={imagen.url} alt={imagen.alt} className="size-full object-cover" />}
        {varias && (
          <>
            <button
              type="button"
              onClick={() => onCambiarImagen(circular(imagenActiva - 1, imagenes.length))}
              aria-label={`Foto anterior de ${habitacion.nombre}`}
              className="absolute left-0 top-[96px] text-white sombra-icono"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => onCambiarImagen(circular(imagenActiva + 1, imagenes.length))}
              aria-label={`Foto siguiente de ${habitacion.nombre}`}
              className="absolute right-0 top-[96px] text-white sombra-icono"
            >
              <ArrowRight size={24} />
            </button>
            <div className="absolute bottom-[6px] left-1/2 flex -translate-x-1/2 gap-[4px]" aria-hidden="true">
              {imagenes.map((img, i) => (
                <span key={img.id} className={`size-[6px] rounded-full ${i === imagenActiva ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <h3 className="mt-[15px] px-[9px] font-inter text-[18px] font-extrabold tracking-[0.72px] text-primary">{habitacion.nombre}</h3>
      <p className="px-[9px] font-inter text-parrafo font-medium tracking-[0.48px] text-primary">
        {habitacion.camasDescripcion}. {personas(habitacion.capacidadMax)}.
      </p>
    </article>
  );
};
