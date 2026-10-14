import type { ReactNode } from 'react';
import { Banner } from '../components/Banner';
import { CallToAction } from '../components/CallToAction';
import { ExternalLink } from '../components/ExternalLink';
import { useContacto } from '../hooks/useContacto';
import { useIsDesktop } from '../hooks/useIsDesktop';

const boton =
  'flex items-center justify-center rounded-btn-m bg-cta font-inter font-extrabold tracking-[0.04em] text-primary transition-colors hover:bg-secondary-3 lg:rounded-btn';
const botonTamano = 'h-[22px] w-[156px] text-[12px] lg:h-[49px] lg:w-[306px] lg:text-boton-lg';

const Icono = ({ src, className }: { src: string; className: string }) => <img src={src} alt="" className={`shrink-0 ${className}`} />;

const Tiempo = ({ children }: { children: ReactNode }) => (
  <p className="flex items-center gap-[10px] font-inter text-[12px] font-light italic tracking-[0.48px] text-primary lg:gap-[19px] lg:text-caption-lg lg:font-medium lg:tracking-[1.04px]">
    <Icono src="/img/como-llegar/reloj.svg" className="h-[17px] w-[14px] lg:h-[40px] lg:w-[34px]" />
    {children}
  </p>
);

const Medio = ({ icono, iconoClases, children }: { icono: string; iconoClases: string; children: ReactNode }) => (
  <p className="flex items-center gap-[12px] font-inter text-encabezado font-bold tracking-[0.8px] text-primary lg:gap-[22px] lg:text-encabezado-lg lg:italic lg:tracking-[1.44px]">
    <Icono src={icono} className={iconoClases} />
    {children}
  </p>
);

const Opcion = ({ children }: { children: ReactNode }) => (
  <p className="text-center font-inter text-[12px] font-light italic tracking-[0.48px] text-primary lg:text-[28px] lg:not-italic lg:tracking-[1.12px]">{children}</p>
);

const tarjeta = 'mx-auto overflow-hidden rounded-bloque bg-surface shadow-elevada';

// Cómo llegar (frames 27:38 escritorio / 167:1501 mobile). Enlaces desde `configuracion` (R-20).
export const ComoLlegar = () => {
  const isDesktop = useIsDesktop();
  const { contacto } = useContacto();

  return (
    <>
      <Banner titulo="¿CÓMO LLEGAR?" imagen="/img/como-llegar/banner.webp" capaClassName="bg-primary/65 lg:bg-primary/50" fvId="cl-banner">
        <p>Llegar a Casa Costa es más fácil de lo que imaginas.</p>
        <p>
          Te ayudamos a coordinar tu transporte para que tu única preocupación sea disfrutar del viaje y empezar a vivir la
          experiencia Casa Costa.
        </p>
      </Banner>

      <section className="px-[27px] pb-[33px] pt-[14px] lg:px-[80px] lg:pb-[114px] lg:pt-[83px]" aria-labelledby="cl-opciones">
        <h2 id="cl-opciones" className="text-center font-nunito text-titulo font-bold tracking-[1.12px] text-primary lg:text-titulo-lg lg:leading-[76px] lg:tracking-[2.56px]">
          TUS OPCIONES
        </h2>
        <p className="mt-[8px] text-center font-inter text-[12px] font-medium tracking-[0.48px] text-primary lg:mt-0 lg:text-[28px] lg:font-light lg:italic lg:tracking-[1.12px]">
          Para llegar a Casa Costa
        </p>

        {/* Opción 1: vía directa */}
        <div className="mt-[14px] lg:mt-[59px]">
          <Opcion>Opción 1:</Opcion>
          <article className={`${tarjeta} mt-[6px] w-full max-w-[333px] lg:mt-[25px] lg:max-w-[1261px]`} data-fv="cl-via-directa">
            <div className="flex flex-col items-center px-[15px] pb-[18px] pt-[19px] text-center lg:px-[40px] lg:pb-[45px] lg:pt-[30px]">
              <h3 className="flex items-center gap-[18px] font-inter text-subtitulo font-black tracking-[0.96px] text-primary lg:gap-[27px] lg:text-subtitulo-lg lg:tracking-[1.92px]">
                <Icono src="/img/como-llegar/avion.svg" className="h-[27px] w-[34px] lg:h-[47px] lg:w-[64px]" />
                VÍA DIRECTA
              </h3>
              <p className="mt-[10px] max-w-[303px] font-inter text-[12px] font-medium tracking-[0.48px] text-primary lg:mt-[18px] lg:max-w-[940px] lg:text-caption-lg lg:tracking-[1.04px]">
                Llega a Capurganá directamente desde el aeropuerto Olaya Herrera.
              </p>
              {isDesktop ? (
                <>
                  <div className="mt-[8px]">
                    <Tiempo>1.5 horas desde Medellín</Tiempo>
                  </div>
                  <ExternalLink href={contacto.vueloUrl} className={`${boton} ${botonTamano} mt-[22px]`} fvId="cl-boton-vuelo">
                    COMPRA AHORA
                  </ExternalLink>
                </>
              ) : (
                <>
                  <ExternalLink href={contacto.vueloUrl} className={`${boton} ${botonTamano} mt-[14px]`} fvId="cl-boton-vuelo">
                    Agenda tu vuelo
                  </ExternalLink>
                  <div className="mt-[16px]">
                    <Tiempo>1.5 horas desde Medellín</Tiempo>
                  </div>
                </>
              )}
            </div>
            <img src="/img/como-llegar/aeropuerto.webp" alt="Aeropuerto de Capurganá" loading="lazy" className="h-[159px] w-full object-cover lg:hidden" />
          </article>
        </div>

        {/* Opción 2: ruta mixta */}
        <div className="mt-[25px] lg:mt-[75px]">
          <Opcion>Opción 2:</Opcion>
          <article className={`${tarjeta} mt-[6px] w-full max-w-[339px] lg:mt-[21px] lg:max-w-[1261px]`} data-fv="cl-ruta-mixta">
            <div className="flex flex-col items-center px-[19px] pb-[36px] pt-[16px] text-center lg:px-[40px] lg:pb-[40px] lg:pt-[44px]">
              <h3 className="flex items-center gap-[14px] font-inter text-subtitulo font-bold tracking-[0.96px] text-primary lg:gap-[27px] lg:text-subtitulo-lg lg:font-black lg:tracking-[1.92px]">
                <Icono src="/img/como-llegar/ruta.svg" className="h-[39px] w-[35px] lg:h-[61px] lg:w-[55px]" />
                RUTA MIXTA
              </h3>
              <p className="mt-[10px] max-w-[297px] font-inter text-[12px] font-bold tracking-[0.48px] text-primary lg:mt-[28px] lg:max-w-[852px] lg:text-caption-lg lg:font-medium lg:tracking-[1.04px]">
                Primero debes llegar a Necoclí, para esto tienes dos opciones:
              </p>

              {isDesktop ? (
                <>
                  <div className="mt-[30px] flex w-full max-w-[760px] items-start justify-between">
                    <div className="flex flex-col items-center gap-[14px]">
                      <Medio icono="/img/como-llegar/bus.svg" iconoClases="h-[31px] w-[60px]">EN BUS</Medio>
                      <ExternalLink href={contacto.busUrl} className={`${boton} h-[49px] w-[306px] text-[24px] lg:text-[24px]`} fvId="cl-boton-bus">
                        Consulta tiquetes
                      </ExternalLink>
                    </div>
                    <Medio icono="/img/como-llegar/vehiculo.svg" iconoClases="h-[34px] w-[60px]">EN TU VEHÍCULO</Medio>
                  </div>
                  <div className="mt-[18px]">
                    <Tiempo>1.5 horas desde Medellín</Tiempo>
                  </div>
                </>
              ) : (
                <div className="mt-[22px] flex w-full flex-col items-start gap-[10px] pl-[25px]">
                  <Medio icono="/img/como-llegar/bus.svg" iconoClases="h-[22px] w-[39px]">EN BUS</Medio>
                  <div className="pl-[25px]">
                    <Tiempo>1.5 horas desde Medellín</Tiempo>
                  </div>
                  <ExternalLink href={contacto.busUrl} className={`${boton} ${botonTamano} self-center -translate-x-[12px]`} fvId="cl-boton-bus">
                    Consulta tiquetes
                  </ExternalLink>
                  <div className="mt-[8px]">
                    <Medio icono="/img/como-llegar/vehiculo.svg" iconoClases="h-[24px] w-[39px]">EN TU VEHÍCULO</Medio>
                  </div>
                  <div className="pl-[25px]">
                    <Tiempo>1.5 horas desde Medellín</Tiempo>
                  </div>
                </div>
              )}

              <p className="mt-[30px] max-w-[301px] font-inter text-[12px] font-bold tracking-[0.48px] text-primary lg:mt-[34px] lg:max-w-[903px] lg:text-caption-lg lg:font-medium lg:tracking-[1.04px]">
                Una vez en Necoclí, puedes llegar a Capurganá por vía marítima:
              </p>
              <div className="mt-[16px] flex w-full flex-col items-start gap-[10px] pl-[25px] lg:mt-[42px] lg:items-center lg:gap-[18px] lg:pl-0">
                <Medio icono="/img/como-llegar/lancha.svg" iconoClases="h-[33px] w-[33px] lg:h-[74px] lg:w-[74px]">EN LANCHA</Medio>
                <div className="pl-[25px] lg:pl-0">
                  <Tiempo>1.5 horas desde Necoclí</Tiempo>
                </div>
              </div>
              {isDesktop ? (
                <>
                  <p className="mt-[24px] max-w-[849px] font-inter text-caption-lg font-medium tracking-[1.04px] text-primary">
                    Casa Costa te ayudará a contratar la lancha, pero debes saber que solo pasa una vez al día.
                  </p>
                  <ExternalLink href={contacto.whatsappUrl} className={`${boton} ${botonTamano} mt-[23px]`} fvId="cl-boton-lancha">
                    VER MÁS
                  </ExternalLink>
                </>
              ) : (
                <>
                  <ExternalLink href={contacto.whatsappUrl} className={`${boton} ${botonTamano} mt-[18px]`} fvId="cl-boton-lancha">
                    VER MÁS
                  </ExternalLink>
                  <p className="mt-[21px] max-w-[301px] font-inter text-[12px] font-bold tracking-[0.48px] text-primary">
                    Casa Costa te ayudará a contratar la lancha, pero debes saber que solo pasa una vez al día.
                  </p>
                </>
              )}
            </div>
            <img src="/img/como-llegar/lancha-foto.webp" alt="Lancha hacia Capurganá" loading="lazy" className="h-[230px] w-full object-cover lg:hidden" />
          </article>
        </div>
      </section>

      <CallToAction label="RESERVAR" />
    </>
  );
};
