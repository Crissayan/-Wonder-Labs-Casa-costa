import type { Response } from 'express';
import type { ApiError, ApiErrorCode, CategoriaPlan } from './types.js';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (slug: string): boolean => slug.length <= 100 && SLUG_PATTERN.test(slug);

export const isValidCategoria = (value: unknown): value is CategoriaPlan =>
  value === 'plan' || value === 'promocion';

const errors: Record<ApiErrorCode, { status: number; message: string }> = {
  INVALID_PARAM: { status: 400, message: 'El parámetro enviado no es válido.' },
  NOT_FOUND: { status: 404, message: 'No encontramos lo que buscas.' },
  METHOD_NOT_ALLOWED: { status: 405, message: 'Esta acción no está disponible.' },
  INTERNAL_ERROR: { status: 500, message: 'Ocurrió un problema. Intenta de nuevo en unos minutos.' },
};

export const sendData = <T>(res: Response, data: T) => {
  res.status(200).json({ data });
};

export const sendError = (res: Response, code: ApiErrorCode) => {
  const { status, message } = errors[code];
  const body: ApiError = { error: { code, message } };
  res.status(status).json(body);
};
