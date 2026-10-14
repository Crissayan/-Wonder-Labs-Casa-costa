import type { Faq } from '@api/types';
import { Acordeon } from '../components/Acordeon';
import { SectionState } from '../components/SectionState';
import { useApi } from '../hooks/useApi';
import { useContacto } from '../hooks/useContacto';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { mensajes } from '../messages';

// FAQs (frames 31:2 escritorio / 167:1620 mobile).
export const Faqs = () => {
  const isDesktop = useIsDesktop();
  const faqs = useApi<Faq[]>('/faqs');
  const { contacto } = useContacto();

  const contenido = () => {
    if (faqs.status !== 'success') return <SectionState status={faqs.status} />;
    if (faqs.data.length === 0) {
      return (
        <SectionState
          status="empty"
          emptyMessage={`${mensajes.sinFaqs}${contacto.whatsappUrl ? ` ${mensajes.sinFaqsWhatsapp}` : ''}`}
        />
      );
    }
    if (!isDesktop) {
      return (
        <div className="flex flex-col gap-[10px]">
          {faqs.data.map((faq) => (
            <Acordeon key={faq.id} pregunta={faq.pregunta} respuesta={faq.respuesta} />
          ))}
        </div>
      );
    }
    // Escritorio: dos columnas, reparto alterno por orden (Q-14).
    const columnas = [faqs.data.filter((_, i) => i % 2 === 0), faqs.data.filter((_, i) => i % 2 === 1)];
    return (
      <div className="flex items-start gap-[16px]">
        {columnas.map((columna, c) => (
          <div key={c} className="flex w-[min(599px,50%)] flex-col gap-[20px]">
            {columna.map((faq) => (
              <Acordeon key={faq.id} pregunta={faq.pregunta} respuesta={faq.respuesta} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        className="relative flex flex-col items-center gap-[9px] overflow-hidden px-[20px] py-[35px] text-center text-white lg:h-[470px] lg:gap-[21px] lg:px-[107px] lg:pt-[102px]"
        data-fv="faq-banner"
      >
        <img src="/img/faqs/banner.webp" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-primary/50 lg:bg-primary/70" aria-hidden="true" />
        <h1 className="relative font-nunito text-titulo font-bold sombra-titulo lg:text-titulo-lg lg:leading-[87px] lg:tracking-[2.56px]">
          ¿QUÉ PREGUNTAS TIENES?
        </h1>
        <p className="relative max-w-[1241px] font-inter text-[15px] font-medium tracking-[0.6px] lg:font-nunito lg:text-encabezado-lg lg:tracking-[1.44px]">
          Sabemos que antes de viajar surgen muchas dudas, por eso reunimos aquí todo lo que necesitas saber para planear tu
          visita sin complicaciones.
        </p>
      </section>
      <section className="mx-auto max-w-frame px-[27px] py-[20px] lg:px-[122px] lg:py-[64px]" aria-label="Preguntas frecuentes">
        {contenido()}
      </section>
    </>
  );
};
