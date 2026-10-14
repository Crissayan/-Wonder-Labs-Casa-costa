import { useEffect, useState } from 'react';
import { apiGet } from '../api';

export type ApiState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: T };

// Carga un recurso de la API y expone los estados cargando / error / éxito de la sección (FR-065).
export const useApi = <T>(path: string | null): ApiState<T> => {
  const [state, setState] = useState<ApiState<T>>({ status: 'loading' });

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setState({ status: 'loading' });
    apiGet<T>(path, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({ status: 'error' });
      });
    return () => controller.abort();
  }, [path]);

  return state;
};
