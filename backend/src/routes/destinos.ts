import { Router } from 'express';
import { getDb } from '../db.js';
import type { Destino } from '../types.js';
import { sendData } from '../validate.js';

type DestinoRow = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  destacado: string | null;
  imagen_url: string | null;
};

export const destinosRouter = Router();

destinosRouter.get('/destinos', (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT id, slug, nombre, descripcion, destacado, imagen_url
       FROM destinos
       ORDER BY orden ASC, id ASC`,
    )
    .all() as DestinoRow[];
  const destinos: Destino[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    descripcion: row.descripcion,
    destacado: row.destacado,
    imagenUrl: row.imagen_url,
  }));
  sendData(res, destinos);
});
