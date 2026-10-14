import { Router } from 'express';
import { getDb } from '../db.js';
import type { CategoriaPlan, Plan } from '../types.js';
import { isValidCategoria, isValidSlug, sendData, sendError } from '../validate.js';

type PlanRow = {
  id: number;
  slug: string;
  nombre: string;
  categoria: CategoriaPlan;
  descripcion: string;
  texto_ideal: string | null;
  duracion_dias: number;
  precio_normal: number;
  precio_temporada_baja: number | null;
  imagen_url: string | null;
};

const columnas = `id, slug, nombre, categoria, descripcion, texto_ideal,
                  duracion_dias, precio_normal, precio_temporada_baja, imagen_url`;

const toPlan = (row: PlanRow): Plan => ({
  id: row.id,
  slug: row.slug,
  nombre: row.nombre,
  categoria: row.categoria,
  descripcion: row.descripcion,
  textoIdeal: row.texto_ideal,
  duracionDias: row.duracion_dias,
  precioNormal: row.precio_normal,
  precioTemporadaBaja: row.precio_temporada_baja,
  imagenUrl: row.imagen_url,
});

export const planesRouter = Router();

planesRouter.get('/planes', (req, res) => {
  const { categoria } = req.query;
  if (categoria !== undefined && !isValidCategoria(categoria)) {
    sendError(res, 'INVALID_PARAM');
    return;
  }
  const db = getDb();
  const rows = (
    categoria
      ? db
          .prepare(`SELECT ${columnas} FROM planes WHERE activo = 1 AND categoria = @categoria ORDER BY orden ASC, id ASC`)
          .all({ categoria })
      : db.prepare(`SELECT ${columnas} FROM planes WHERE activo = 1 ORDER BY orden ASC, id ASC`).all()
  ) as PlanRow[];
  sendData(res, rows.map(toPlan));
});

planesRouter.get('/planes/:slug', (req, res) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    sendError(res, 'INVALID_PARAM');
    return;
  }
  const row = getDb()
    .prepare(`SELECT ${columnas} FROM planes WHERE slug = ? AND activo = 1`)
    .get(slug) as PlanRow | undefined;
  if (!row) {
    sendError(res, 'NOT_FOUND');
    return;
  }
  sendData(res, toPlan(row));
});
