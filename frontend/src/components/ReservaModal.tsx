import { useContacto } from '../hooks/useContacto';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { useReserva } from '../hooks/useReserva';
import { mensajes } from '../messages';
import { ExternalLink } from './ExternalLink';
import { CloseButton, Overlay } from './Overlay';

const canalBoton =
  'flex items-center justify-center rounded-btn-m bg-cta font-inter font-bold italic text-primary transition-colors hover:bg-white lg:rounded-btn';

// Modal "RESERVA YA" (FR-004; frames 459:550 escritorio / 505:854 mobile).
export const ReservaModal = () => {
  const { abierta, cerrarReserva } = useReserva();
  const { contacto } = useContacto();
  const isDesktop = useIsDesktop();
  const canales = [
    {
      id: 'directo',
      texto: 'Entrarás en contacto con asesores de Casa Costa',
      boton: 'DIRECTO',
      href: contacto.whatsappUrl,
    },
    {
      id: 'booking',
      texto: 'Serás redirigido a la página de Casa Costa en Booking',
      boton: 'BOOKING',
      href: contacto.bookingUrl,
    },
  ].filter((canal) => Boolean(canal.href));

  return (
    <Overlay
      open={abierta}
      onClose={cerrarReserva}
      label="Reserva ya"
      backdropClassName="bg-primary/20"
      fvId="modal-reserva"
    >
      <div
        className={
          isDesktop
            ? 'relative flex min-h-[336px] w-[973px] max-w-[calc(100vw-48px)] flex-col items-center rounded-pill bg-surface pb-[43px] pt-[33px] shadow-tarjeta'
            : 'relative flex min-h-[529px] w-[327px] flex-col items-center rounded-pill bg-surface px-[42px] pb-[52px] pt-[49px] shadow-tarjeta'
        }
        data-fv="modal-reserva-tarjeta"
      >
        <CloseButton
          onClick={cerrarReserva}
          size={isDesktop ? 66 : 32}
          className={isDesktop ? 'absolute -right-[33px] -top-[33px]' : 'absolute -right-[16px] -top-[16px]'}
        />
        <h2 className="font-nunito text-[32px] font-black h-[55px] leading-[55px] tracking-[1.28px] text-primary lg:h-[62px] lg:text-subtitulo-lg lg:leading-[62px] lg:tracking-[1.92px]">
          RESERVA YA
        </h2>
        <p className="h-[33px] w-[213px] text-center font-inter text-[16px] font-light italic tracking-[0.64px] text-primary lg:w-auto lg:text-subtitulo lg:tracking-[0.96px]">
          Conoce las dos formas de reservar en Casa Costa:
        </p>
        {canales.length === 0 ? (
          <p className="mt-[40px] text-center font-inter text-encabezado font-medium text-primary" role="alert">
            {mensajes.sinCanales}
          </p>
        ) : (
          <div className="mt-[52px] flex w-full flex-col items-center gap-[52px] lg:mt-[23px] lg:flex-row lg:items-start lg:justify-start lg:gap-[3px] lg:pl-[51px]">
            {canales.map((canal) => (
              <div key={canal.id} className="flex w-[243px] flex-col items-center lg:w-[436px]" data-fv={`modal-canal-${canal.id}`}>
                <p className="h-[68px] text-center font-inter text-encabezado font-medium tracking-[0.8px] text-primary lg:text-[28px] lg:tracking-[1.12px]">
                  {canal.texto}
                </p>
                <ExternalLink
                  href={canal.href}
                  className={`${canalBoton} mt-[16px] h-[32px] w-[151px] text-encabezado lg:mt-[23px] lg:h-[51px] lg:w-[278px] lg:text-boton-lg`}
                  fvId={`modal-boton-${canal.id}`}
                >
                  {canal.boton}
                </ExternalLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </Overlay>
  );
};
