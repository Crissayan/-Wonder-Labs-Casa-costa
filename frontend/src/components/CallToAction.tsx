import { ReservarButton } from './ReservarButton';

// Banner "CASACOSTA TE ESPERA" (frames 424:307 / 523:1347) con CTA de reserva.
export const CallToAction = ({ label = 'RESERVA' }: { label?: 'RESERVA' | 'RESERVAR' }) => (
  <section
    className="relative flex h-[509px] flex-col items-center overflow-hidden px-[39px] pt-[108px] text-center text-white lg:h-[511px] lg:px-[99px] lg:pt-[106px]"
    data-fv="cta"
  >
    <img src="/img/inicio/cta-fondo.webp" alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-primary/50" aria-hidden="true" />
    <div className="relative flex max-w-[1259px] flex-col items-center">
      <h2 className="max-w-[287px] font-nunito text-titulo font-black leading-[38px] tracking-[1.12px] lg:max-w-none lg:text-titulo-lg lg:leading-normal lg:tracking-[2.56px]">
        CASACOSTA TE ESPERA
      </h2>
      <p className="mt-[48px] max-w-[315px] font-inter text-parrafo font-medium tracking-[0.48px] lg:mt-[17px] lg:max-w-none lg:text-encabezado-lg lg:tracking-[1.44px]">
        Tu escape paradisíaco a Capurganá nunca había estado tan cerca. Haz clic en “Reserva ahora” para reservar
        desde Booking o directamente con nosotros a través de WhatsApp
      </p>
      <ReservarButton
        label={label}
        className="mt-[71px] h-[51px] w-[190px] text-boton-lg lg:mt-[64px]"
        fvId="cta-reservar"
      />
    </div>
  </section>
);
