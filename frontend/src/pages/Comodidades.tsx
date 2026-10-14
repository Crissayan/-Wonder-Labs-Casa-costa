import type { Habitacion } from '@api/types';
import { Snowflake, Wifi } from 'lucide-react';
import { useState } from 'react';
import { Banner } from '../components/Banner';
import { Carousel } from '../components/Carousel';
import { HabitacionCard } from '../components/HabitacionCard';
import { HabitacionDetalle } from '../components/HabitacionDetalle';
import { SectionState } from '../components/SectionState';
import { useApi } from '../hooks/useApi';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { mensajes } from '../messages';

const alimentacion = [
  { src: '/img/comodidades/alimentacion-1.webp', alt: 'Desayuno servido en Casa Costa' },
  { src: '/img/comodidades/alimentacion-2.webp', alt: 'Comida típica preparada en el hotel' },
  { src: '/img/comodidades/alimentacion-3.webp', alt: 'Plato con ingredientes frescos y locales' },
];

const iconoClases = 'h-[49px] w-[49px] text-primary lg:h-[127px] lg:w-[130px]';
const dotacion = [
  { label: 'Aire acondicionado', icono: <Snowflake className={iconoClases} strokeWidth={1.5} aria-hidden="true" /> },
  { label: 'Baño privado', icono: <img src="/img/comodidades/bano.svg" alt="" className={iconoClases} /> },
  { label: 'WiFi', icono: <Wifi className={iconoClases} strokeWidth={1.5} aria-hidden="true" /> },
];

// Una diapositiva del carrusel: la imagen activa vuelve a la primera al cambiar de habitación,
// porque cada habitación monta su propio estado.
const HabitacionSlide = ({ habitacion }: { habitacion: Habitacion }) => {
  const isDesktop = useIsDesktop();
  const [imagenActiva, setImagenActiva] = useState(0);
  if (!isDesktop) {
    return <HabitacionCard habitacion={habitacion} variant="mobile" imagenActiva={imagenActiva} onCambiarImagen={setImagenActiva} />;
  }
  return (
    <div className="flex translate-x-[min(10px,0.7vw)] items-start gap-[clamp(32px,5.15vw,75px)]">
      <HabitacionCard habitacion={habitacion} variant="escritorio" imagenActiva={imagenActiva} onCambiarImagen={setImagenActiva} />
      <HabitacionDetalle habitacion={habitacion} imagenActiva={imagenActiva} onCambiarImagen={setImagenActiva} />
    </div>
  );
};

// Comodidades (frames 27:16 escritorio / 167:1017 mobile): habitaciones y alimentación.
export const Comodidades = () => {
  const isDesktop = useIsDesktop();
  const habitaciones = useApi<Habitacion[]>('/habitaciones');

  return (
    <>
      <Banner titulo="COMODIDADES" imagen="/img/comodidades/banner.webp" capaClassName="bg-primary/65" fvId="com-banner" textoClassName="lg:text-[28px] lg:tracking-[1.12px]">
        Descansa en habitaciones pensadas para tu comodidad. Todas cuentan con aire acondicionado, baño privado y WiFi, y
        gracias a nuestra planta de energía nada interrumpirá tu descanso. Elige entre cuatro habitaciones y un apartamento
        para grupos de hasta 8 personas, y empieza cada día con desayuno continental incluido.
      </Banner>

      <section className="px-[25px] pt-[19px] text-center lg:px-[80px] lg:pt-[32px]" aria-labelledby="habitaciones-titulo">
        <h2
          id="habitaciones-titulo"
          className="font-nunito text-titulo font-bold tracking-[1.12px] text-primary lg:text-titulo-lg lg:leading-[76px] lg:tracking-[2.56px]"
        >
          HABITACIONES
        </h2>
        <p className="mt-[8px] font-inter text-[15px] font-medium italic tracking-[0.6px] text-primary lg:mt-[11px] lg:text-[40px] lg:font-normal lg:not-italic lg:tracking-[1.6px]">
          Todas nuestras habitaciones cuentan con:
        </p>
        <ul className="mx-auto mt-[19px] flex max-w-[290px] justify-between lg:mt-[35px] lg:max-w-[702px]" data-fv="com-dotacion">
          {dotacion.map(({ label, icono }) => (
            <li key={label} className="flex w-[100px] flex-col items-center gap-[10px] lg:w-[234px] lg:gap-[28px]">
              {icono}
              <span className="whitespace-nowrap font-inter text-parrafo font-medium tracking-[-0.24px] text-primary lg:text-subtitulo lg:font-normal lg:tracking-[0.96px]">
                {label}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-[18px] hidden font-inter text-subtitulo font-light italic tracking-[0.96px] text-primary lg:mt-[57px] lg:block">
          Anímate a conocer más de nuestras habitaciones
        </p>
      </section>

      <div className="mt-[30px] lg:mt-[54px]" aria-live="polite">
        {habitaciones.status !== 'success' ? (
          <SectionState status={habitaciones.status} className="mx-auto max-w-[860px] px-[30px]" />
        ) : habitaciones.data.length === 0 ? (
          <SectionState status="empty" emptyMessage={mensajes.sinHabitaciones} className="mx-auto max-w-[860px] px-[30px]" />
        ) : (
          <Carousel
            items={habitaciones.data}
            getKey={(h) => h.slug}
            label="Habitaciones"
            desktopMode="single"
            arrowSize={isDesktop ? 108 : 40}
            overlayArrows={{ left: 'left-[max(4px,calc(50%-694px))]', right: 'right-[max(4px,calc(50%-706px))]' }}
            desktopClassName="pb-[10px]"
            mobileSlideClassName="w-[329px]"
            mobileTrackClassName="px-[calc(50%-164.5px)] pb-[8px]"
            fvId="com-carrusel"
            renderItem={(habitacion) => <HabitacionSlide habitacion={habitacion} />}
          />
        )}
      </div>

      <section
        className="mt-[28px] bg-white pb-[33px] pt-[0px] text-center text-primary lg:mt-[52px] lg:bg-secondary-4 lg:pb-[98px] lg:pt-[43px] lg:text-white"
        aria-labelledby="alimentacion-titulo"
        data-fv="com-alimentacion"
      >
        <h2
          id="alimentacion-titulo"
          className="font-nunito text-titulo font-bold tracking-[1.12px] lg:text-titulo-lg lg:leading-[76px] lg:tracking-[2.56px]"
        >
          ALIMENTACIÓN
        </h2>
        <p className="mx-auto mt-[13px] max-w-[342px] px-[4px] font-inter text-parrafo font-medium tracking-[0.48px] lg:mt-[9px] lg:max-w-[1289px] lg:text-encabezado-lg lg:tracking-[1.44px]">
          En Casa Costa podrás disfrutar cada día de comidas típicas preparadas con ingredientes frescos y locales para que
          pases el día con energía y buen ánimo.
        </p>
        <div className="mt-[18px] lg:mt-[42px]">
          <Carousel
            items={alimentacion}
            getKey={(foto) => foto.src}
            label="Alimentación"
            arrowSize={isDesktop ? 77 : 32}
            overlayArrows={{ left: 'left-[max(8px,calc(50%-546px))] text-white bg-transparent', right: 'right-[max(8px,calc(50%-536px))] text-white bg-transparent' }}
            mobileSlideClassName="w-[253px]"
            mobileTrackClassName="px-[calc(50%-126.5px)] pb-[4px]"
            fvId="com-carrusel-alimentacion"
            renderItem={(foto, { position, active }) => (
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className={`rounded-img object-cover shadow-tarjeta ${
                  isDesktop
                    ? position === 'active'
                      ? 'h-[504px] w-[min(419px,28.8vw)]'
                      : 'h-[418px] w-[min(335px,23vw)]'
                    : `h-[303px] w-[253px] transition-[opacity,transform] ${active ? '' : 'scale-[0.89] opacity-50'}`
                }`}
              />
            )}
          />
        </div>
      </section>
    </>
  );
};
