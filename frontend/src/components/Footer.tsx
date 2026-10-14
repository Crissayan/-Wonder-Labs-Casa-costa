import { useContacto } from '../hooks/useContacto';
import { ExternalLink } from './ExternalLink';

const titulo = 'font-inter text-encabezado font-semibold tracking-[0.8px] lg:text-subtitulo lg:tracking-[0.96px]';
const dato = 'font-inter text-[17px] font-light tracking-[0.68px] lg:text-encabezado lg:tracking-[0.8px]';

// Footer de contacto (FR-005, P-21; frames 454:2856 escritorio / 523:1298 mobile).
export const Footer = () => {
  const { contacto } = useContacto();
  return (
    <footer className="bg-primary text-white" data-fv="footer">
      <div className="relative mx-auto max-w-frame px-[33px] pb-[35px] pt-[44px] lg:h-[200px] lg:px-[52px] lg:pb-0 lg:pt-[47px]">
        <hr className="absolute left-0 right-0 top-[21px] border-white lg:left-[19px] lg:right-[91px] lg:top-[19px]" aria-hidden="true" />
        <div className="flex flex-col gap-[29px] lg:flex-row lg:gap-0">
          <section aria-labelledby="footer-contacto" className="lg:w-[288px]">
            <h2 id="footer-contacto" className={titulo}>Contáctanos</h2>
            <ul className="mt-[8px] flex flex-col gap-[10px] lg:mt-[16px] lg:gap-[14px]">
              {contacto.instagram && (
                <li className="flex items-center gap-[15px] lg:gap-[22px]">
                  <img src="/img/global/instagram.svg" alt="" className="size-[25px] lg:size-[31px]" />
                  <ExternalLink href={contacto.instagramUrl} fallback="text" className={`${dato} hover:underline`} ariaLabel={`Instagram ${contacto.instagram}`}>
                    {contacto.instagram}
                  </ExternalLink>
                </li>
              )}
              {contacto.telefono && (
                <li className="flex items-center gap-[14px] lg:gap-[20px]">
                  <img src="/img/global/telefono.svg" alt="" className="size-[26px] lg:size-[33px]" />
                  <ExternalLink href={contacto.whatsappUrl} fallback="text" className={`${dato} hover:underline`} ariaLabel={`WhatsApp ${contacto.telefono}`}>
                    {contacto.telefono}
                  </ExternalLink>
                </li>
              )}
            </ul>
          </section>
          {contacto.bookingUrl && (
            <section aria-labelledby="footer-reservas" className="lg:w-[213px]">
              <h2 id="footer-reservas" className={titulo}>Reservas</h2>
              <ExternalLink href={contacto.bookingUrl} className={`${dato} mt-0 block underline lg:mt-[16px]`}>
                Booking.com
              </ExternalLink>
            </section>
          )}
          {contacto.direccion && (
            <section aria-labelledby="footer-direccion" className="max-w-[262px] lg:max-w-[267px]">
              <h2 id="footer-direccion" className={titulo}>Dirección</h2>
              <p className={`${dato} lg:mt-[16px]`}>{contacto.direccion}</p>
            </section>
          )}
        </div>
      </div>
    </footer>
  );
};
