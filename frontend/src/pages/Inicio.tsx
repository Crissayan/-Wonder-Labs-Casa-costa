import type { Resena, ResenasData } from '@api/types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CallToAction } from '../components/CallToAction';
import { Carousel } from '../components/Carousel';
import { ResenaCard } from '../components/ResenaCard';
import { ResenaPopup } from '../components/ResenaPopup';
import { SectionState } from '../components/SectionState';
import { formatPuntaje } from '../format';
import { useApi } from '../hooks/useApi';
import { circular, useCarousel } from '../hooks/useCarousel';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { mensajes } from '../messages';

const fotosComodidades: { src: string; alt: string; posicion?: string }[] = [
  { src: '/img/inicio/comodidades-1.webp', alt: 'Terraza de Casa Costa con vista al jardín' },
  { src: '/img/inicio/comodidades-2.webp', alt: 'Muelle de Capurganá al atardecer' },
  // El frame recorta esta foto desde la izquierda (ancho 168 %, desplazamiento −2,66 %).
  { src: '/img/inicio/comodidades-3.webp', alt: 'Habitación con camas listas para el descanso', posicion: '4% center' },
];

// Carrusel de reseñas en escritorio (frame 454:1712): activa al centro, laterales al 70 % y
// tarjetas de apoyo al 50 %; se navega pulsando una tarjeta lateral.
const ResenasEscritorio = ({ resenas, onLeerMas }: { resenas: Resena[]; onLeerMas: (r: Resena) => void }) => {
  const { index, next, prev } = useCarousel(resenas.length);
  const n = resenas.length;
  const apoyo = <div className="hidden h-[140px] w-[189px] shrink-0 rounded-bloque bg-surface opacity-50 shadow-tarjeta min-[1240px]:block" aria-hidden="true" />;
  const lateral = (i: number, onClick: () => void, label: string) => (
    <div className="relative shrink-0 cursor-pointer" onClick={onClick}>
      <ResenaCard resena={resenas[i]} variant="lateral" onLeerMas={() => onLeerMas(resenas[i])} />
      <button type="button" onClick={onClick} className="sr-only">
        {label}
      </button>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-[16px] pb-[24px]" aria-roledescription="carrusel" aria-label="Reseñas" data-fv="ini-resenas">
      {n >= 3 && apoyo}
      {n >= 3 && lateral(circular(index - 1, n), prev, 'Reseña anterior')}
      <ResenaCard resena={resenas[index]} variant="activa" onLeerMas={() => onLeerMas(resenas[index])} />
      {n >= 2 && lateral(circular(index + 1, n), next, 'Reseña siguiente')}
      {n >= 3 && apoyo}
    </div>
  );
};

// Inicio (frames 12:2 escritorio / 158:182 mobile).
export const Inicio = () => {
  const isDesktop = useIsDesktop();
  const resenas = useApi<ResenasData>('/resenas');
  const [abierta, setAbierta] = useState<Resena | null>(null);
  const calificaciones = resenas.status === 'success' ? resenas.data.calificaciones : [];
  const google = calificaciones.find((c) => c.plataforma === 'GOOGLE');
  const booking = calificaciones.find((c) => c.plataforma === 'BOOKING');

  return (
    <>
      {/* Hero (FR-010): título web en ambas vistas (Q-15). */}
      <section className="relative flex h-[489px] flex-col items-center overflow-hidden px-[27px] text-center text-white lg:h-[560px]" data-fv="ini-hero">
        <img src="/img/inicio/hero.webp" alt="" className="absolute inset-0 size-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/60" aria-hidden="true" />
        <h1 className="relative mt-[63px] font-nunito text-[30px] font-bold leading-[41px] sombra-titulo lg:mt-[190px] lg:text-titulo-lg lg:italic lg:leading-[87px]">
          TU ESCAPE A CAPURGANÁ
        </h1>
        <p className="relative mt-auto mb-[30px] max-w-[338px] font-inter text-[15px] tracking-[0.6px] sombra-texto lg:mb-auto lg:mt-[3px] lg:max-w-[1255px] lg:text-encabezado-lg lg:tracking-[1.44px]">
          Con Hotel Casa Costa prepárate para unas vacaciones paradisíacas que no podrás olvidar.
        </p>
      </section>

      {/* Comodidades (FR-011) */}
      <section className="px-[30px] pt-[33px] text-center lg:px-[80px] lg:pt-[49px]" aria-labelledby="ini-comodidades">
        <h2 id="ini-comodidades" className="mx-auto max-w-[314px] font-nunito text-titulo font-bold leading-none text-primary lg:max-w-none lg:text-subtitulo-lg lg:italic lg:leading-normal">
          Todas las comodidades a tu disposición
        </h2>
        <p className="mx-auto mt-[21px] max-w-[334px] font-inter text-[15px] font-medium tracking-[0.6px] text-primary lg:mt-[4px] lg:max-w-[1107px] lg:text-caption-lg lg:font-light lg:tracking-[1.04px]">
          Tu estadía en CasaCosta te asegura un escape inolvidable sin renunciar a ninguna comodidad. Disfruta de aire
          acondicionado, WiFi y planta de energía para asegurar la mejor experiencia de descanso que puedas tener.
        </p>
        <div className="mt-[47px] lg:mt-[66px]">
          {isDesktop ? (
            <div className="mx-auto flex max-w-[1186px] justify-between gap-[24px]" data-fv="ini-fotos">
              {fotosComodidades.map((foto, i) => (
                <img
                  key={foto.src}
                  src={foto.src}
                  alt={foto.alt}
                  className="aspect-[366/322] w-[min(366px,30.86%)] rounded-img object-cover"
                  style={{ objectPosition: foto.posicion }}
                  data-fv={`ini-foto-${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <Carousel
              items={fotosComodidades}
              getKey={(f) => f.src}
              label="Comodidades"
              mobileSlideClassName="w-[265px]"
              mobileTrackClassName="px-[calc(50%-132.5px)] pb-[4px]"
              fvId="ini-fotos"
              renderItem={(foto, { active }) => (
                <img
                  src={foto.src}
                  alt={foto.alt}
                  className={`h-[225px] w-[265px] rounded-img object-cover transition-[opacity,transform] ${active ? 'shadow-tarjeta' : 'scale-[0.9] opacity-50'}`}
                  style={{ objectPosition: foto.posicion }}
                />
              )}
            />
          )}
        </div>
        <Link
          to="/comodidades"
          className="mx-auto mt-[23px] flex h-[23px] w-[104px] items-center justify-center rounded-btn-m bg-cta font-inter text-[12px] font-extrabold tracking-[0.48px] text-primary lg:mt-[31px] lg:inline-block lg:h-auto lg:w-auto lg:bg-transparent lg:font-nunito lg:text-boton-lg lg:font-bold lg:italic lg:tracking-normal lg:text-cta lg:underline"
          data-fv="ini-ver-opciones"
        >
          Ver opciones
        </Link>
      </section>

      {/* Tours (FR-012) */}
      <section
        className="mt-[30px] bg-secondary-4 px-[28px] pb-[38px] pt-[30px] text-center text-white lg:mt-[62px] lg:flex lg:h-[585px] lg:items-start lg:justify-between lg:pl-[92px] lg:pr-[123px] lg:pt-[34px] lg:text-left"
        aria-labelledby="ini-tours"
        data-fv="ini-tours"
      >
        <div className="lg:mt-[53px] lg:max-w-[731px]">
          <h2 id="ini-tours" className="mx-auto max-w-[298px] font-nunito text-titulo font-bold leading-none lg:mx-0 lg:max-w-[724px] lg:text-subtitulo-lg lg:italic lg:leading-normal">
            Descubre a Capurganá por completo
          </h2>
          <div className="mt-[14px] space-y-[1em] font-inter text-[15px] font-medium tracking-[0.6px] lg:mt-[66px] lg:text-parrafo-lg lg:tracking-[0.88px]">
            <p>
              Disfruta más allá de las costas paradisíacas. Con CasaCosta podrás adentrarte en el corazón de Capurganá
              gracias a nuestros paquetes con tours.
            </p>
            <p className="hidden lg:block">
              Prepárate para vivir una experiencia en sintonía con la naturaleza, el mar y la selva como nunca antes.
            </p>
          </div>
          <Link
            to="/experiencias#tours"
            className="mt-[54px] hidden font-nunito text-boton-lg font-bold italic text-cta underline lg:inline-block"
            data-fv="ini-conoce-mas"
          >
            Conoce más
          </Link>
        </div>
        <img
          src="/img/inicio/tours.webp"
          alt="Visitante en el muelle de Capurganá"
          loading="lazy"
          className="mx-auto mt-[53px] h-[450px] w-[339px] rounded-img object-cover shadow-tarjeta lg:mx-0 lg:mt-0 lg:h-[512px] lg:w-[416px] lg:shrink-0"
          data-fv="ini-tours-imagen"
        />
        <Link
          to="/experiencias#tours"
          className="mx-auto mt-[25px] flex h-[21px] w-[104px] items-center justify-center rounded-btn-m bg-cta font-inter text-[12px] font-extrabold tracking-[0.48px] text-primary lg:hidden"
        >
          Conoce más
        </Link>
      </section>

      {/* Reseñas y calificaciones (FR-013 a FR-015) */}
      <section className="pb-[48px] pt-[32px] text-center lg:pb-[75px] lg:pt-[62px]" aria-labelledby="ini-resenas">
        <h2 id="ini-resenas" className="font-nunito text-titulo font-bold text-primary lg:text-subtitulo-lg">
          Nuestras Reseñas
        </h2>
        {resenas.status !== 'success' ? (
          <SectionState status={resenas.status} className="mx-auto mt-[24px] max-w-[860px] px-[30px]" />
        ) : (
          <>
            {(google || booking) && (
              <div className="mt-[16px] flex items-end justify-center gap-[17px] text-primary lg:mt-[30px] lg:gap-[2px]" data-fv="ini-calificaciones">
                {google && (
                  <div className="flex w-[186px] flex-col items-center lg:w-[251px]">
                    <span className="font-inter text-[50px] font-extrabold leading-[61px] tracking-[2px] lg:text-[96px] lg:leading-[100px] lg:tracking-[3.84px]">{formatPuntaje(google.puntaje)}</span>
                    <span className="font-inter text-[22px] font-medium tracking-[0.88px] lg:text-[32px] lg:tracking-[1.28px]">GOOGLE</span>
                  </div>
                )}
                {google && booking && <img src="/img/inicio/estrella.svg" alt="" className="mb-[42px] h-[56px] w-[53px] shrink-0 lg:mb-[9px] lg:h-[87px] lg:w-[88px]" />}
                {booking && (
                  <div className="flex w-[186px] flex-col items-center lg:w-[251px]">
                    <span className="font-inter text-[50px] font-extrabold leading-[61px] tracking-[2px] lg:text-[96px] lg:leading-[100px] lg:tracking-[3.84px]">{formatPuntaje(booking.puntaje)}</span>
                    <span className="font-inter text-[22px] font-medium tracking-[0.88px] lg:text-[32px] lg:tracking-[1.28px]">BOOKING</span>
                  </div>
                )}
              </div>
            )}
            <div className="mt-[16px] lg:mt-[52px]">
              {resenas.data.resenas.length === 0 ? (
                <SectionState status="empty" emptyMessage={mensajes.sinResenas} className="mx-auto max-w-[860px] px-[30px]" />
              ) : isDesktop ? (
                <ResenasEscritorio resenas={resenas.data.resenas} onLeerMas={setAbierta} />
              ) : (
                <Carousel
                  items={resenas.data.resenas}
                  getKey={(r) => r.id}
                  label="Reseñas"
                  mobileSlideClassName="w-[269px]"
                  mobileTrackClassName="px-[calc(50%-134.5px)] pb-[14px] pt-[2px]"
                  fvId="ini-resenas"
                  renderItem={(resena) => <ResenaCard resena={resena} variant="mobile" onLeerMas={() => setAbierta(resena)} />}
                />
              )}
            </div>
          </>
        )}
      </section>

      <CallToAction />
      <ResenaPopup resena={abierta} onClose={() => setAbierta(null)} />
    </>
  );
};
