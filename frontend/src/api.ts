import type { ApiError } from '@api/types';
import { mensajes } from './messages';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiError['error']['code'] | 'NETWORK',
  ) {
    super(mensajes.errorSeccion);
  }
}

// Petición tipada a la API. Cualquier fallo se convierte en ApiRequestError con mensaje amigable.
export const apiGet = async <T>(path: string, signal?: AbortSignal): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiRequestError(0, 'NETWORK');
  }
  const body = (await response.json().catch(() => null)) as { data: T } | ApiError | null;
  if (!response.ok || !body || !('data' in body)) {
    const code = body && 'error' in body ? body.error.code : 'INTERNAL_ERROR';
    throw new ApiRequestError(response.status, code);
  }
  return body.data;
};
