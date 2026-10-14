import type { Plan } from '@api/types';
import { Moon, Sun } from 'lucide-react';
import { formatPrecio } from '../format';

type Props = {
  plan: Plan;
  variant: 'activa' | 'lateral' | 'mobile';
  onOpen?: () => void;
};

const tamanos = {
  // Escritorio: 533×641 (activa) y 423×528 (laterales) a 1456 px; se reducen con el ancho.
  activa: 'w-[min(533px,36.6vw)] aspect-[533/641]',
  lateral: 'w-[min(423px,29.05vw)] aspect-[423/528]',
  mobile: 'w-[212px] h-[254px]',
};

// Tarjeta de plan/promoción (FR-021, clarificación 2): composición del afiche con nombre,
// duración y precios tomados de la base. Fondo `primary` mientras no haya fotos limpias
// (desviación visual temporal registrada en el spec).
export const PlanCard = ({ plan, variant, onOpen }: Props) => {
  const grande = variant !== 'mobile';
  const noches = plan.duracionDias - 1;
  const contenido = (
    <>
      <span
        className={`font-nunito font-black uppercase leading-[1.05] tracking-[0.08em] ${
          grande ? 'text-[clamp(28px,3.3vw,48px)]' : 'text-[22px]'
        }`}
      >
        {plan.nombre}
      </span>
      <span
        className={`flex overflow-hidden rounded-bloque font-inter font-medium ${
          grande ? 'mt-[24px] text-[clamp(14px,1.4vw,20px)]' : 'mt-[12px] text-[11px]'
        }`}
      >
        <span className="flex items-center gap-[6px] bg-white/15 px-[12px] py-[6px] text-white">
          <Moon size={grande ? 18 : 11} aria-hidden="true" /> {noches} {noches === 1 ? 'Noche' : 'Noches'}
        </span>
        <span className="flex items-center gap-[6px] bg-cta px-[12px] py-[6px] font-bold text-primary">
          <Sun size={grande ? 18 : 11} aria-hidden="true" /> {plan.duracionDias} Días
        </span>
      </span>
      <span className={`mt-auto flex flex-col items-center ${grande ? 'gap-[8px]' : 'gap-[4px]'}`}>
        <span
          className={`rounded-pill bg-secondary-3 font-inter font-extrabold text-primary ${
            grande ? 'px-[28px] py-[8px] text-[clamp(26px,2.9vw,42px)]' : 'px-[16px] py-[4px] text-[20px]'
          }`}
        >
          {formatPrecio(plan.precioTemporadaBaja ?? plan.precioNormal)}
        </span>
        {plan.precioTemporadaBaja !== null && (
          <span className={`font-inter font-semibold text-white ${grande ? 'text-[clamp(12px,1.1vw,16px)]' : 'text-[9px]'}`}>
            Precio normal {formatPrecio(plan.precioNormal)}
          </span>
        )}
      </span>
    </>
  );

  const clases = `flex flex-col items-center rounded-img bg-primary text-center text-white shadow-tarjeta ${
    grande ? 'px-[6%] py-[8%]' : 'px-[14px] py-[22px]'
  } ${tamanos[variant]}`;

  if (!onOpen) {
    return <div className={clases}>{contenido}</div>;
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${clases} transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta`}
      aria-label={`Ver detalle de ${plan.nombre}`}
      data-fv={variant === 'activa' ? 'plan-card-activa' : 'plan-card-mobile'}
    >
      {contenido}
    </button>
  );
};
