import { useEffect, useState } from 'react';

const QUERY = '(min-width: 1024px)';

// true desde el breakpoint de escritorio (lg). Permite renderizar un solo árbol por vista.
export const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(QUERY).matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(QUERY);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isDesktop;
};
