import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { MobileMenu } from './MobileMenu';
import { ReservarButton } from './ReservarButton';

export const navegacion = [
  { to: '/experiencias', label: 'EXPERIENCIAS' },
  { to: '/comodidades', label: 'COMODIDADES' },
  { to: '/como-llegar', label: 'COMO LLEGAR' },
  { to: '/faqs', label: 'FAQS' },
] as const;

// Separación de los enlaces del frame 304:37 (x = 199, 438, 698, 945 a 1456 px).
const anchosNav = ['w-[clamp(150px,16.4vw,239px)]', 'w-[clamp(160px,17.86vw,260px)]', 'w-[clamp(150px,16.96vw,247px)]', ''];

// Header global (FR-001). Escritorio: frame 304:37 (123 px). Mobile: "Barra" 278:2 (57 px).
export const Header = () => {
  const isDesktop = useIsDesktop();
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (isDesktop) {
    return (
      <header className="sticky top-0 z-40 bg-primary" data-fv="header">
        <nav className="mx-auto flex h-[118px] max-w-frame items-center px-[57px]" aria-label="Principal">
          <Link to="/" aria-label="Hotel Casa Costa, inicio" className="shrink-0">
            <img src="/img/global/logo-icono.png" alt="" width={73} height={74} className="h-[74px] w-[73px]" />
          </Link>
          <ul className="ml-[clamp(20px,4.7vw,69px)] flex flex-1 items-center">
            {navegacion.map(({ to, label }, i) => (
              <li key={to} className={anchosNav[i]}>
                <NavLink
                  to={to}
                  className="whitespace-nowrap font-inter text-[clamp(17px,1.79vw,26px)] font-light tracking-[0.04em] text-white hover:text-cta"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ReservarButton className="h-[52px] w-[190px] text-boton-lg" fvId="header-reservar" />
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-primary" data-fv="header">
      <div className="relative flex h-[57px] items-center px-[34px]">
        <Link to="/" aria-label="Hotel Casa Costa, inicio" className="flex items-center">
          <img src="/img/global/logo-icono-negativo.png" alt="" width={38} height={38} className="size-[38px]" />
          <img
            src="/img/global/logo-tipografia.png"
            alt=""
            width={93}
            height={26}
            className="absolute left-1/2 top-[16px] h-[26px] w-[93px] -translate-x-1/2"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          className="ml-auto flex h-[24px] w-[24px] items-center justify-center"
          data-fv="header-menu"
        >
          <img src="/img/global/menu.svg" alt="" width={24} height={20} />
        </button>
      </div>
      <MobileMenu abierto={menuAbierto} onClose={() => setMenuAbierto(false)} />
    </header>
  );
};
