import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { circular, useCarousel } from '../hooks/useCarousel';
import { useIsDesktop } from '../hooks/useIsDesktop';

type RenderInfo = { active: boolean; position: 'prev' | 'active' | 'next' };

type Props<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, info: RenderInfo) => ReactNode;
  label: string;
  /** Escritorio: 'peek' muestra anterior/activo/siguiente (laterales al 50 %); 'single' solo el activo. */
  desktopMode?: 'peek' | 'single';
  /** Clases del contenedor de flechas + elementos en escritorio. */
  desktopClassName?: string;
  /** Tamaño de los íconos de flecha en escritorio (px). */
  arrowSize?: number;
  /** Mostrar indicador de puntos en escritorio. */
  desktopDots?: boolean;
  /** Ancho de cada diapositiva en mobile (clase Tailwind). */
  mobileSlideClassName?: string;
  /** Clases extra de la pista deslizable en mobile (p. ej. padding para centrar). */
  mobileTrackClassName?: string;
  /** Escritorio: flechas superpuestas en posición absoluta (clases de cada flecha). */
  overlayArrows?: { left: string; right: string };
  onIndexChange?: (index: number) => void;
  fvId?: string;
};

// Indicador del toolkit: cápsula `surface` con puntos de 10 px (activo `primary`).
const Dots = ({ count, index, onSelect, label }: { count: number; index: number; onSelect: (i: number) => void; label: string }) => (
  <div className="mt-[13px] flex justify-center">
    <div
      className="flex h-[21px] items-center gap-[6px] rounded-pill bg-surface px-[15px]"
      role="tablist"
      aria-label={`Elegir elemento de ${label}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Ir al elemento ${i + 1} de ${count}`}
          onClick={() => onSelect(i)}
          className={`size-[10px] rounded-full transition-colors ${i === index ? 'bg-primary' : 'bg-primary/40'}`}
        />
      ))}
    </div>
  </div>
);

// Carrusel común (research D-05): flechas en escritorio, deslizamiento con scroll-snap en mobile.
export function Carousel<T>({
  items,
  getKey,
  renderItem,
  label,
  desktopMode = 'peek',
  desktopClassName = '',
  arrowSize = 64,
  desktopDots = false,
  mobileSlideClassName = 'w-full',
  mobileTrackClassName = '',
  overlayArrows,
  onIndexChange,
  fvId,
}: Props<T>) {
  const isDesktop = useIsDesktop();
  const { index, goTo, next, prev } = useCarousel(items.length);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = items.length;
  const navigable = count > 1;

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  // Mobile: sincroniza el índice con la diapositiva visible.
  useEffect(() => {
    if (isDesktop || !trackRef.current || typeof IntersectionObserver === 'undefined') return;
    const track = trackRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            goTo(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    track.querySelectorAll('[data-index]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop, count, goTo]);

  const scrollToSlide = (i: number) => {
    const slide = trackRef.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (slide && trackRef.current) {
      trackRef.current.scrollTo({ left: slide.offsetLeft - trackRef.current.offsetLeft, behavior: 'smooth' });
    }
    goTo(i);
  };

  if (count === 0) return null;

  if (!isDesktop) {
    return (
      <div aria-roledescription="carrusel" aria-label={label} data-fv={fvId}>
        <div
          ref={trackRef}
          className={`scrollbar-none flex snap-x snap-mandatory gap-[10px] overflow-x-auto ${mobileTrackClassName}`}
        >
          {items.map((item, i) => (
            <div
              key={getKey(item)}
              data-index={i}
              className={`shrink-0 snap-center ${mobileSlideClassName}`}
              aria-hidden={i !== index}
            >
              {renderItem(item, { active: i === index, position: 'active' })}
            </div>
          ))}
        </div>
        {navigable && <Dots count={count} index={index} onSelect={scrollToSlide} label={label} />}
      </div>
    );
  }

  const visible =
    desktopMode === 'peek' && count >= 3
      ? ([
          [circular(index - 1, count), 'prev'],
          [index, 'active'],
          [circular(index + 1, count), 'next'],
        ] as const)
      : desktopMode === 'peek' && count === 2
        ? ([
            [index, 'active'],
            [circular(index + 1, count), 'next'],
          ] as const)
        : ([[index, 'active']] as const);

  const arrowLeft = navigable && (
    <button
      type="button"
      onClick={prev}
      aria-label={`Anterior: ${label}`}
      className={`z-10 shrink-0 rounded-full text-primary ${overlayArrows ? `absolute top-1/2 -translate-y-1/2 ${overlayArrows.left.includes('bg-') ? '' : 'bg-white'} ${overlayArrows.left}` : ''}`}
      data-fv={fvId ? `${fvId}-anterior` : undefined}
    >
      <CircleArrowLeft size={arrowSize} strokeWidth={1.5} />
    </button>
  );
  const arrowRight = navigable && (
    <button
      type="button"
      onClick={next}
      aria-label={`Siguiente: ${label}`}
      className={`z-10 shrink-0 rounded-full text-primary ${overlayArrows ? `absolute top-1/2 -translate-y-1/2 ${overlayArrows.right.includes('bg-') ? '' : 'bg-white'} ${overlayArrows.right}` : ''}`}
      data-fv={fvId ? `${fvId}-siguiente` : undefined}
    >
      <CircleArrowRight size={arrowSize} strokeWidth={1.5} />
    </button>
  );

  return (
    <div aria-roledescription="carrusel" aria-label={label} data-fv={fvId}>
      <div className={`relative flex items-center justify-center ${desktopClassName}`}>
        {arrowLeft}
        {visible.map(([i, position]) => (
          <div
            key={`${getKey(items[i])}-${position}`}
            className={`transition-opacity ${position === 'active' ? '' : 'opacity-50'}`}
            aria-hidden={position !== 'active'}
          >
            {renderItem(items[i], { active: position === 'active', position })}
          </div>
        ))}
        {arrowRight}
      </div>
      {navigable && desktopDots && <Dots count={count} index={index} onSelect={goTo} label={label} />}
    </div>
  );
}
