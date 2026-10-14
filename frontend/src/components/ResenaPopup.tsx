import type { Resena } from '@api/types';
import { formatEstrellas, formatFecha } from '../format';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { CloseButton, Overlay } from './Overlay';
import { Avatar } from './ResenaCard';

type Props = { resena: Resena | null; onClose: () => void };

// Pop-up de reseña completa (FR-015; frames 304:137, 454:1678, 454:1690 / 344:362, 369:377, 369:391).
// Sin plataforma de origen (R-16).
export const ResenaPopup = ({ resena, onClose }: Props) => {
  const isDesktop = useIsDesktop();
  return (
    <Overlay open={resena !== null} onClose={onClose} label={resena ? `Reseña de ${resena.autor}` : 'Reseña'} backdropClassName="bg-primary/20" fvId="popup-resena">
      {resena && (
        <div className="relative">
          <article
            className={
              isDesktop
                ? 'flex min-h-[385px] w-[458px] flex-col rounded-pill bg-surface px-[32px] pb-[20px] pt-[18px] text-primary shadow-tarjeta'
                : 'flex min-h-[317px] w-[269px] flex-col rounded-pill bg-surface px-[19px] pb-[24px] pt-[27px] text-primary shadow-tarjeta'
            }
            data-fv="popup-resena-tarjeta"
          >
            <header className="flex items-start gap-[8px]">
              <Avatar autor={resena.autor} size={isDesktop ? 63 : 40} />
              <div className="flex-1 pt-[6px] text-center">
                <p className="font-inter text-[16px] font-bold italic tracking-[0.04em] lg:text-[20px]">{resena.autor}</p>
                <p className="font-inter text-[14px] font-medium tracking-[0.04em] lg:text-[16px]">{formatEstrellas(resena.calificacion)}</p>
              </div>
              <time dateTime={resena.fecha} className="pt-[9px] font-inter text-[8px] font-medium tracking-[0.04em] lg:pt-[14px] lg:text-[12px]">
                {formatFecha(resena.fecha)}
              </time>
            </header>
            <h2 className="mt-[14px] text-center font-inter text-[20px] font-semibold italic tracking-[0.04em] lg:mt-[12px] lg:text-[32px]">
              {resena.titulo}
            </h2>
            <p className="mt-[10px] text-center font-inter text-parrafo font-medium tracking-[0.48px] lg:mt-[8px] lg:text-[16px] lg:tracking-[0.64px]">
              {resena.texto}
            </p>
          </article>
          <CloseButton
            onClick={onClose}
            size={isDesktop ? 67 : 40}
            className={isDesktop ? 'absolute -right-[22px] -top-[21px]' : 'absolute -right-[14px] -top-[17px]'}
          />
        </div>
      )}
    </Overlay>
  );
};
