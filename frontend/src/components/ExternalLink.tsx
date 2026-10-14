import type { ReactNode } from 'react';

type Props = {
  href: string | null | undefined;
  children: ReactNode;
  className?: string;
  /** Sin URL: 'hide' no renderiza nada; 'text' muestra el contenido como texto (FR-005). */
  fallback?: 'hide' | 'text';
  ariaLabel?: string;
  fvId?: string;
};

// Enlace externo: siempre en pestaña nueva y sin acceso a la página de origen (FR-064, CB-01).
export const ExternalLink = ({ href, children, className = '', fallback = 'hide', ariaLabel, fvId }: Props) => {
  if (!href) {
    return fallback === 'text' ? <span className={className}>{children}</span> : null;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      data-fv={fvId}
    >
      {children}
    </a>
  );
};
