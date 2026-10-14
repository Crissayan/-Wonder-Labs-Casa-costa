import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReserva } from '../hooks/useReserva';
import { Overlay } from './Overlay';

type Props = { abierto: boolean; onClose: () => void };

const opciones = [
  { to: '/', label: 'Inicio' },
  { to: '/experiencias', label: 'Experiencias' },
  { to: '/comodidades', label: 'Comodidades' },
  { to: '/como-llegar', label: 'Como llegar' },
  { to: '/faqs', label: 'FAQS' },
];

// Menú mobile (FR-002; frame 270:32): panel derecho de 225 px sobre fondo oscurecido.
export const MobileMenu = ({ abierto, onClose }: Props) => {
  const { abrirReserva } = useReserva();
  return (
    <Overlay open={abierto} onClose={onClose} label="Menú" backdropClassName="bg-primary/20" className="justify-end" fvId="menu-mobile">
      <nav
        className="flex min-h-screen w-[225px] flex-col items-end bg-primary pr-[20px] pt-[59px] shadow-lateral"
        aria-label="Menú principal"
        data-fv="menu-panel"
      >
        <button type="button" onClick={onClose} aria-label="Cerrar menú" className="text-white">
          <X size={22} strokeWidth={2} />
        </button>
        <ul className="mt-[30px] flex flex-col items-end gap-[24px]">
          {opciones.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} onClick={onClose} className="font-inter text-encabezado font-medium text-white">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            onClose();
            abrirReserva();
          }}
          className="mt-[26px] h-[33px] w-[121px] rounded-btn-m bg-cta font-inter text-encabezado font-bold italic text-primary"
          data-fv="menu-reservar"
        >
          RESERVAR
        </button>
      </nav>
    </Overlay>
  );
};
