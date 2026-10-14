import type { Resena } from '@api/types';
import { formatEstrellas } from '../format';

type Props = {
  resena: Resena;
  variant: 'activa' | 'lateral' | 'mobile';
  onLeerMas: () => void;
};

// Avatar del toolkit: la base no guarda foto, se muestra la inicial del autor (Q-16).
export const Avatar = ({ autor, size }: { autor: string; size: number }) => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full bg-secondary-1 font-nunito font-bold text-white"
    style={{ width: size, height: size, fontSize: size * 0.45 }}
    aria-hidden="true"
  >
    {autor.charAt(0).toUpperCase()}
  </span>
);

const estilos = {
  activa: { caja: 'h-[182px] w-[242px]', avatar: 59, autor: 'text-[20px]', estrellas: 'text-[16px]', titulo: 'text-[32px] mt-[26px]', boton: 'h-[44px] w-[130px] text-[20px] -bottom-[23px]' },
  lateral: { caja: 'h-[161px] w-[213px] opacity-70', avatar: 52, autor: 'text-[16px]', estrellas: 'text-[12px]', titulo: 'text-[26px] mt-[16px]', boton: 'h-[38px] w-[129px] text-[16px] -bottom-[19px]' },
  mobile: { caja: 'h-[205px] w-[269px]', avatar: 58, autor: 'text-[20px]', estrellas: 'text-[16px]', titulo: 'text-[32px] mt-[30px]', boton: '' },
};

// Tarjeta de reseña (FR-014): sin cuerpo de texto (R-14); "LEER MÁS" en escritorio, "VER MÁS" en mobile.
export const ResenaCard = ({ resena, variant, onLeerMas }: Props) => {
  const e = estilos[variant];
  const mobile = variant === 'mobile';
  return (
    <article
      className={`relative flex flex-col rounded-bloque bg-surface px-[17px] pt-[13px] text-primary shadow-tarjeta ${e.caja} ${mobile ? 'px-[28px] pt-[20px]' : ''}`}
      data-fv={variant === 'activa' ? 'resena-activa' : variant === 'mobile' ? 'resena-mobile' : undefined}
    >
      <div className="flex items-start">
        <Avatar autor={resena.autor} size={e.avatar} />
        <div className="flex-1 pt-[8px] text-center">
          <p className={`font-inter font-bold italic tracking-[0.04em] ${e.autor}`}>{resena.autor}</p>
          <p className={`font-inter font-medium tracking-[0.04em] ${e.estrellas}`}>{formatEstrellas(resena.calificacion)}</p>
        </div>
      </div>
      <p className={`text-center font-inter font-semibold italic tracking-[0.04em] ${e.titulo}`}>{resena.titulo}</p>
      {mobile ? (
        <button
          type="button"
          onClick={onLeerMas}
          className="mx-auto mt-auto mb-[-7px] h-[27px] w-[90px] rounded-btn-m bg-cta font-inter text-[12px] font-bold tracking-[0.48px] text-primary"
          aria-label={`Ver más de la reseña de ${resena.autor}`}
        >
          VER MÁS
        </button>
      ) : (
        <button
          type="button"
          onClick={onLeerMas}
          className={`absolute left-1/2 -translate-x-1/2 rounded-pill bg-cta font-inter font-medium tracking-[0.04em] text-white transition-colors hover:bg-secondary-1 ${e.boton}`}
          aria-label={`Leer más de la reseña de ${resena.autor}`}
        >
          LEER MÁS
        </button>
      )}
    </article>
  );
};
