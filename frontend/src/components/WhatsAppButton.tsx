import { useContacto } from '../hooks/useContacto';
import { ExternalLink } from './ExternalLink';

// Botón flotante de WhatsApp (FR-006): círculo de 63 px (mobile) / 85 px (escritorio).
export const WhatsAppButton = () => {
  const { contacto } = useContacto();
  return (
    <ExternalLink
      href={contacto.whatsappUrl}
      ariaLabel="Escríbenos por WhatsApp"
      className="fixed bottom-[37px] right-[31px] z-30 flex size-[63px] items-center justify-center rounded-full bg-white shadow-tarjeta transition-transform hover:scale-105 lg:bottom-[54px] lg:right-[66px] lg:size-[85px]"
      fvId="whatsapp"
    >
      {/* El logo viene volteado en Figma (rotación 180° + espejo horizontal): se corrige aquí. */}
      <img src="/img/global/whatsapp-logo.svg" alt="" className="h-[40px] w-[40px] -scale-y-100 lg:h-[54px] lg:w-[54px]" />
    </ExternalLink>
  );
};
