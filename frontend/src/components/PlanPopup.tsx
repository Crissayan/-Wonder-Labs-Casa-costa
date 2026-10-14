import type { Destino, Plan } from '@api/types';
import { formatPrecio } from '../format';
import { useApi } from '../hooks/useApi';
import { useContacto } from '../hooks/useContacto';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { useReserva } from '../hooks/useReserva';
import { linkDestinos } from '../linkDestinos';
import { mensajes } from '../messages';
import { CloseButton, Overlay } from './Overlay';
import { SectionState } from './SectionState';

type Props = {
  slug: string | null;
  destinos: Destino[];
  onClose: () => void;
};

// Pop-up de plan/promoción (FR-023; frames 199:383 y 514:* escritorio, 369:* y 384:* mobile).
export const PlanPopup = ({ slug, destinos, onClose }: Props) => {
  const isDesktop = useIsDesktop();
  const { abrirReserva } = useReserva();
  const { contacto } = useContacto();
  const state = useApi<Plan>(slug ? `/planes/${slug}` : null);

  // Cierra el pop-up y desplaza la página al bloque del destino en Tours (FR-024).
  const irADestino = (destinoSlug: string) => {
    onClose();
    window.setTimeout(() => {
      document.getElementById(`destino-${destinoSlug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#destino-${destinoSlug}`);
    }, 50);
  };

  // RESERVAR cierra el pop-up antes de abrir el modal: nunca dos capas (CB-15).
  const reservar = () => {
    onClose();
    abrirReserva();
  };

  const renderDescripcion = (plan: Plan) =>
    linkDestinos(plan.descripcion, destinos, (destino, key) => (
      <a
        key={key}
        href={`#destino-${destino.slug}`}
        onClick={(event) => {
          event.preventDefault();
          irADestino(destino.slug);
        }}
        className="font-bold underline"
      >
        {destino.nombre}
      </a>
    ));

  const noDisponible = (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center font-inter text-encabezado font-medium" role="alert">
      <p>{mensajes.planNoDisponible}</p>
      {contacto.whatsappUrl && <p className="mt-2">{mensajes.planNoDisponibleWhatsapp}</p>}
    </div>
  );

  const contenido = () => {
    if (state.status === 'loading') return <SectionState status="loading" className="m-8 flex-1" />;
    if (state.status === 'error') return noDisponible;
    const plan = state.data;

    if (isDesktop) {
      return (
        <div className="flex gap-[clamp(24px,3vw,43px)] pl-[72px] pr-[48px]">
          {plan.imagenUrl && (
            <img
              src={plan.imagenUrl}
              alt={plan.nombre}
              className="h-[507px] w-[422px] shrink-0 rounded-img object-cover shadow-tarjeta"
              data-fv="popup-plan-imagen"
            />
          )}
          <div className="flex flex-1 flex-col items-center text-center">
            <h2 className="font-inter text-subtitulo-lg font-extrabold">{plan.nombre}</h2>
            <p className="mt-[14px] max-w-[623px] font-inter text-subtitulo font-medium italic">{renderDescripcion(plan)}</p>
            {plan.textoIdeal && <p className="mt-[28px] max-w-[623px] font-inter text-subtitulo font-medium">{plan.textoIdeal}</p>}
            {plan.precioTemporadaBaja !== null ? (
              <div className="mt-[24px] flex flex-col items-center">
                <span className="flex h-[67px] w-[276px] items-center justify-center rounded-bloque bg-cta font-inter text-subtitulo-lg font-semibold text-primary">
                  {formatPrecio(plan.precioTemporadaBaja)}
                </span>
                <span className="mt-[4px] font-inter text-[16px] font-semibold">Precio normal {formatPrecio(plan.precioNormal)}</span>
              </div>
            ) : (
              <span className="mt-[40px] font-inter text-subtitulo-lg font-semibold">{formatPrecio(plan.precioNormal)}</span>
            )}
            <button
              type="button"
              onClick={reservar}
              className="mt-[12px] h-[51px] w-[190px] rounded-btn bg-cta font-inter text-boton-lg font-bold italic text-primary transition-colors hover:bg-white"
            >
              RESERVAR
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col">
        {plan.imagenUrl && (
          <img src={plan.imagenUrl} alt={plan.nombre} className="h-[380px] w-full object-cover shadow-tarjeta" data-fv="popup-plan-imagen" />
        )}
        <div className="flex flex-1 flex-col px-[27px] pb-[16px] pt-[6px]">
          <h2 className="text-center font-inter text-subtitulo font-bold">{plan.nombre}</h2>
          <p className="mt-[6px] font-inter text-parrafo font-medium">{renderDescripcion(plan)}</p>
          {plan.textoIdeal && <p className="mt-[8px] font-inter text-parrafo font-medium">{plan.textoIdeal}</p>}
          <div className="mt-auto flex items-end justify-between pt-[8px]">
            <div className="flex flex-col items-center">
              {plan.precioTemporadaBaja !== null ? (
                <>
                  <span className="rounded-bloque bg-cta px-[8px] font-inter text-subtitulo font-bold">{formatPrecio(plan.precioTemporadaBaja)}</span>
                  <span className="font-inter text-[8px] font-medium">Precio normal {formatPrecio(plan.precioNormal)}</span>
                </>
              ) : (
                <span className="font-inter text-subtitulo font-bold">{formatPrecio(plan.precioNormal)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={reservar}
              className="h-[35px] w-[152px] rounded-btn-m bg-cta font-inter text-subtitulo font-extrabold tracking-[0.96px] text-primary"
            >
              RESERVAR
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Overlay
      open={slug !== null}
      onClose={onClose}
      label={state.status === 'success' ? state.data.nombre : 'Detalle del plan'}
      backdropClassName={isDesktop ? 'bg-white/95' : 'bg-primary/20'}
      className="items-start justify-center py-[86px] lg:items-center"
      fvId="popup-plan"
    >
      <div className="relative">
        <div
          className={
            isDesktop
              ? 'flex min-h-[615px] w-[1318px] max-w-[calc(100vw-80px)] flex-col justify-center overflow-hidden rounded-pill bg-primary py-[51px] text-white'
              : 'flex min-h-[606px] w-[346px] flex-col overflow-hidden rounded-pill bg-surface text-primary shadow-tarjeta'
          }
          data-fv="popup-plan-tarjeta"
        >
          {contenido()}
        </div>
        <CloseButton
          onClick={onClose}
          size={isDesktop ? 66 : 40}
          className={isDesktop ? 'absolute -right-[33px] -top-[33px]' : 'absolute -right-[14px] -top-[14px]'}
        />
      </div>
    </Overlay>
  );
};
