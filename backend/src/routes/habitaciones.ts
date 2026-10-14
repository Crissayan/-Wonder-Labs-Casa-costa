import { Router } from 'express';
import { getDb } from '../db.js';
import type { Habitacion, HabitacionImagen } from '../types.js';
import { isValidSlug, sendData, sendError } from '../validate.js';

type HabitacionRow = {
  id: number;
  slug: string;
  nombre: string;
  tipo: string;
  area_m2: number;
  capacidad_max: number;
  camas_descripcion: string;
  descripcion: string;
  precio: number | null;
};

const columnas = `id, slug, nombre, tipo, area_m2, capacidad_max, camas_descripcion, descripcion, precio`;

const toHabitacion = (row: HabitacionRow, imagenes: HabitacionImagen[]): Habitacion => ({
  id: row.id,
  slug: row.slug,
  nombre: row.nombre,
  tipo: row.tipo,
  areaM2: row.area_m2,
  capacidadMax: row.capacidad_max,
  camasDescripcion: row.camas_descripcion,
  descripcion: row.descripcion,
  precio: row.precio,
  imagenes,
});

export const habitacionesRouter = Router();

habitacionesRouter.get('/habitaciones', (_req, res) => {
  const db = getDb();
  const rows = db.prepare(`SELECT ${columnas} FROM habitaciones ORDER BY orden ASC, id ASC`).all() as HabitacionRow[];
  const imagenes = db
    .prepare(
      `SELECT id, habitacion_id, url, alt
       FROM habitacion_imagenes
       ORDER BY habitacion_id ASC, orden ASC, id ASC`,
    )
    .all() as (HabitacionImagen & { habitacion_id: number })[];

  const porHabitacion = new Map<number, HabitacionImagen[]>();
  for (const { habitacion_id, id, url, alt } of imagenes) {
    const lista = porHabitacion.get(habitacion_id) ?? [];
    lista.push({ id, url, alt });
    porHabitacion.set(habitacion_id, lista);
  }
  sendData(res, rows.map((row) => toHabitacion(row, porHabitacion.get(row.id) ?? [])));
});

habitacionesRouter.get('/habitaciones/:slug', (req, res) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    sendError(res, 'INVALID_PARAM');
    return;
  }
  const db = getDb();
  const row = db.prepare(`SELECT ${columnas} FROM habitaciones WHERE slug = ?`).get(slug) as HabitacionRow | undefined;
  if (!row) {
    sendError(res, 'NOT_FOUND');
    return;
  }
  const imagenes = db
    .prepare(
      `SELECT id, url, alt
       FROM habitacion_imagenes
       WHERE habitacion_id = ?
       ORDER BY orden ASC, id ASC`,
    )
    .all(row.id) as HabitacionImagen[];
  sendData(res, toHabitacion(row, imagenes));
});
