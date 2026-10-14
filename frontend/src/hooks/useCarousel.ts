import { useCallback, useState } from 'react';

// Índice activo circular, sin avance automático (research D-05, Q-21).
export const useCarousel = (count: number, initial = 0) => {
  const [index, setIndex] = useState(initial);
  const safeIndex = count > 0 ? ((index % count) + count) % count : 0;

  const goTo = useCallback((i: number) => setIndex(i), []);
  const next = useCallback(() => setIndex((i) => (count > 0 ? (i + 1) % count : 0)), [count]);
  const prev = useCallback(() => setIndex((i) => (count > 0 ? (i - 1 + count) % count : 0)), [count]);

  return { index: safeIndex, goTo, next, prev };
};

export const circular = (i: number, count: number) => ((i % count) + count) % count;
