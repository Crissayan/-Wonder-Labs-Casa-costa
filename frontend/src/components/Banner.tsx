import type { ReactNode } from 'react';

type Props = {
  titulo: string;
  children?: ReactNode;
  imagen?: string;
  /** Opacidad de la capa `primary` sobre la imagen (frames: 50 % escritorio, 65 % mobile). */
  capaClassName?: string;
  id?: string;
  fvId?: string;
  /** Clases del texto (p. ej. tamaño menor para textos largos, FV-02). */
  textoClassName?: string;
};

// Banner de página: 1456×402 en escritorio y 393×172 en mobile (FR-068; p. ej. 304:108 / 167:489).
export const Banner = ({
  titulo,
  children,
  imagen,
  capaClassName = 'bg-primary/65 lg:bg-primary/50',
  id,
  fvId,
  textoClassName = 'lg:text-encabezado-lg',
}: Props) => (
  <section
    id={id}
    data-fv={fvId}
    className="relative flex min-h-[172px] flex-col items-center overflow-hidden bg-primary px-[27px] pb-[4px] pt-[18px] text-center text-white lg:min-h-[402px] lg:px-[88px] lg:pb-[24px] lg:pt-[77px]"
  >
    {imagen && <img src={imagen} alt="" className="absolute inset-0 size-full object-cover" />}
    <div className={`absolute inset-0 ${capaClassName}`} aria-hidden="true" />
    <div className="relative mx-auto max-w-[1281px]">
      <h1 className="font-nunito text-titulo font-bold leading-[29px] sombra-titulo lg:text-titulo-lg lg:font-extrabold lg:leading-[76px] lg:tracking-[2.56px]">
        {titulo}
      </h1>
      {children && (
        <div className={`mt-[9px] font-inter text-[15px] font-medium tracking-[0.6px] lg:mt-[21px] lg:tracking-[1.44px] ${textoClassName}`}>
          {children}
        </div>
      )}
    </div>
  </section>
);
