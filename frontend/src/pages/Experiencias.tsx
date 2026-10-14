import type { Destino, Plan } from '@api/types';
import { useState } from 'react';
import { Banner } from '../components/Banner';
import { Carousel } from '../components/Carousel';
import { PlanCard } from '../components/PlanCard';
import { PlanPopup } from '../components/PlanPopup';
import { SectionState } from '../components/SectionState';
import { useApi } from '../hooks/useApi';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { mensajes } from '../messages';

const incluye = [
  { label: 'Transporte', icono: '/img/iconos/transporte.svg', clases: 'h-[61px] w-[59px] lg:h-[103px] lg:w-[103px]' },
  { label: 'Comida', icono: '/img/iconos/comida.png', clases: 'size-[44px] lg:size-[99px]' },
  { label: 'Tours', icono: '/img/iconos/tours.png', clases: 'h-[64px] w-[62px] lg:h-[157px] lg:w-[152px]' },
];

type CarruselPlanesProps = {
  state: ReturnType<typeof useApi<Plan[]>>;
  label: string;
  vacio: string;
  onOpen: (slug: string) => void;
  fvId: string;
  desktopClassName?: string;
};

const CarruselPlanes = ({ state, label, vacio, onOpen, fvId, desktopClassName }: CarruselPlanesProps) => {
  const isDesktop = useIsDesktop();
  if (state.status !== 'success') return <SectionState status={state.status} className="mx-auto w-full max-w-[860px]" />;
  if (state.data.length === 0) return <SectionState status="empty" emptyMessage={vacio} className="mx-auto w-full max-w-[860px]" />;
  return (
    <Carousel
      items={state.data}
      getKey={(plan) => plan.slug}
      label={label}
      fvId={fvId}
      desktopClassName={desktopClassName}
      arrowSize={isDesktop ? 108 : 40}
      overlayArrows={{ left: 'left-[max(8px,calc(50%-685px))]', right: 'right-[max(8px,calc(50%-685px))]' }}
      mobileSlideClassName="w-[212px]"
      mobileTrackClassName="px-[calc(50%-106px)] pb-[4px]"
      renderItem={(plan, { active, position }) =>
        isDesktop ? (
          <PlanCard plan={plan} variant={position === 'active' ? 'activa' : 'lateral'} onOpen={active ? () => onOpen(plan.slug) : undefined} />
        ) : (
          <div className={`flex h-[254px] items-center justify-center transition-[opacity,transform] ${active ? '' : 'scale-[0.87] opacity-50'}`}>
            <PlanCard plan={plan} variant="mobile" onOpen={active ? () => onOpen(plan.slug) : undefined} />
          </div>
        )
      }
    />
  );
};

const encabezado = 'font-nunito text-titulo font-bold tracking-[1.12px] text-primary lg:text-titulo-lg lg:tracking-[2.56px]';
const subencabezado = 'font-inter text-parrafo tracking-[0.48px] text-primary lg:text-subtitulo-lg lg:tracking-[1.92px]';

// Experiencias (frames 14:39 escritorio / 167:162 mobile): planes, promociones y Tours.
export const Experiencias = () => {
  const planes = useApi<Plan[]>('/planes?categoria=plan');
  const promociones = useApi<Plan[]>('/planes?categoria=promocion');
  const destinos = useApi<Destino[]>('/destinos');
  const [abierto, setAbierto] = useState<string | null>(null);
  const listaDestinos = destinos.status === 'success' ? destinos.data : [];

  return (
    <>
      <Banner titulo="EXPERIENCIAS" imagen="/img/experiencias/banner.webp" fvId="exp-banner">
        En Hotel Casa Costa tenemos una gran variedad de experiencias para que disfrutes al máximo de tus vacaciones en
        Capurganá. Explora nuestra oferta de planes especialmente diseñados para ti.
      </Banner>

      <section className="px-[30px] pt-[24px] text-center lg:px-[80px] lg:pt-[47px]" aria-labelledby="planes-titulo">
        <h2 id="planes-titulo" className={`${encabezado} lg:leading-[76px]`}>PLANES</h2>
        <p className={`mt-[4px] font-medium lg:mt-[20px] lg:font-normal ${subencabezado}`}>Todos nuestros planes incluyen:</p>
        <ul className="mx-auto mt-[14px] flex max-w-[262px] items-end justify-between lg:mt-[29px] lg:max-w-[700px]" data-fv="exp-incluye">
          {incluye.map(({ label, icono, clases }) => (
            <li key={label} className="flex flex-col items-center gap-[5px] lg:gap-0">
              <img src={icono} alt="" className={`object-contain ${clases}`} />
              <span className="font-inter text-[12px] tracking-[0.48px] text-primary lg:text-caption-lg lg:tracking-[1.04px]">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-[53px] lg:mt-[68px]">
        <CarruselPlanes state={planes} label="Planes" vacio={mensajes.sinPlanes} onOpen={setAbierto} fvId="exp-carrusel-planes" desktopClassName="-translate-x-[5px]" />
      </div>
      <p className="mt-[13px] px-[20px] text-center font-inter text-[12px] font-light italic tracking-[0.48px] text-primary lg:mt-[38px] lg:text-caption-lg lg:tracking-[1.04px]">
        Contamos con acomodación de 1 a 8 personas
      </p>

      <section className="mt-[17px] text-center lg:mt-[88px]" aria-labelledby="promociones-titulo">
        <h2 id="promociones-titulo" className={`${encabezado} lg:leading-[76px]`}>PROMOCIONES</h2>
        <p className={`mt-[14px] lg:mt-[21px] ${subencabezado}`}>Disfruta de estos increíbles precios</p>
        <div className="mt-[10px] lg:mt-[0px]">
          <CarruselPlanes state={promociones} label="Promociones" vacio={mensajes.sinPromociones} onOpen={setAbierto} fvId="exp-carrusel-promos" />
        </div>
      </section>

      <section id="tours" className="mt-[39px] scroll-mt-[57px] lg:mt-[45px] lg:scroll-mt-[123px]" aria-labelledby="tours-titulo">
        <div className="relative flex h-[162px] flex-col items-center overflow-hidden bg-primary px-[27px] pt-[35px] text-center text-white lg:h-[323px] lg:pt-[63px]" data-fv="exp-banner-tours">
          <img src="/img/experiencias/banner-tours.webp" alt="" className="absolute inset-0 size-full object-cover opacity-50" />
          <h2 id="tours-titulo" className="relative font-nunito text-titulo font-bold leading-[29px] sombra-titulo lg:text-titulo-lg lg:leading-[76px] lg:tracking-[2.56px]">
            TOURS
          </h2>
          <p className="relative mt-[17px] max-w-[338px] font-inter text-[15px] font-medium tracking-[0.6px] lg:mt-[25px] lg:max-w-[1028px] lg:font-nunito lg:text-encabezado-lg lg:tracking-[1.44px]">
            Estos son los lugares turísticos de los que podrás disfrutar durante tu estancia en Casa Costa.
          </p>
        </div>

        <div className="mx-auto max-w-frame px-[30px] pb-[52px] pt-[24px] lg:px-[80px] lg:pb-[101px] lg:pt-[108px]">
          {destinos.status !== 'success' ? (
            <SectionState status={destinos.status} />
          ) : listaDestinos.length === 0 ? (
            <SectionState status="empty" emptyMessage={mensajes.sinDestinos} />
          ) : (
            <ul className="flex flex-col gap-[50px] lg:gap-[87px]">
              {listaDestinos.map((destino) => (
                <li
                  key={destino.slug}
                  id={`destino-${destino.slug}`}
                  className="flex scroll-mt-[70px] flex-col items-center lg:scroll-mt-[140px] lg:flex-row lg:items-start lg:gap-[41px]"
                  data-fv={`exp-destino-${destino.slug}`}
                >
                  {destino.imagenUrl && (
                    <img
                      src={destino.imagenUrl}
                      alt={destino.nombre}
                      loading="lazy"
                      className="h-[188px] w-[281px] shrink-0 rounded-img object-cover shadow-tarjeta lg:h-[332px] lg:w-[496px]"
                      data-fv={`exp-destino-${destino.slug}-imagen`}
                    />
                  )}
                  <div className="mt-[20px] w-full max-w-[324px] lg:mt-0 lg:max-w-[756px]">
                    <h3 className="text-center font-nunito text-titulo font-bold tracking-[-0.28px] text-primary lg:text-left lg:text-subtitulo-lg lg:tracking-[0.48px]">
                      {destino.nombre}
                    </h3>
                    <p className="mt-[7px] font-inter text-parrafo font-medium tracking-[-0.24px] text-primary lg:mt-[7px] lg:text-parrafo-lg lg:tracking-[-0.44px]">
                      {destino.descripcion}
                    </p>
                    {destino.destacado && (
                      <p className="mt-[10px] font-inter text-parrafo font-medium italic tracking-[-0.24px] text-cta lg:mt-[26px] lg:max-w-[597px] lg:text-caption-lg lg:tracking-[-0.52px]">
                        {destino.destacado}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <PlanPopup slug={abierto} destinos={listaDestinos} onClose={() => setAbierto(null)} />
    </>
  );
};
