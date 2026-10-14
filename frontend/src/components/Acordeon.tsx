import { useId, useState } from 'react';

type Props = { pregunta: string; respuesta: string };

// Acordeón del toolkit (frame 458:423, Closed / Open): botón con aria-expanded y aria-controls (FR-051).
export const Acordeon = ({ pregunta, respuesta }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-[16px] rounded-bloque bg-surface p-[12px] lg:p-[20px]" data-fv="acordeon">
      <h3>
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={`${id}-respuesta`}
          onClick={() => setAbierto((v) => !v)}
          className="flex w-full items-center gap-[12px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta lg:gap-[40px]"
        >
          <span className="flex-1 font-nunito text-encabezado font-bold text-primary lg:text-boton-lg">{pregunta}</span>
          <img
            src="/img/faqs/chevron.svg"
            alt=""
            className={`h-[14px] w-[31px] shrink-0 transition-transform ${abierto ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div id={`${id}-respuesta`} role="region" aria-label={pregunta} hidden={!abierto}>
        <hr className="border-t-[3px] border-primary/30" />
        <p className="mt-[16px] font-nunito text-parrafo font-medium text-primary lg:text-encabezado">{respuesta}</p>
      </div>
    </div>
  );
};
