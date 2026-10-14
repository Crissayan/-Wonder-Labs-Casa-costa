import { Router } from 'express';
import { getDb } from '../db.js';
import type { CalificacionPlataforma, Resena, ResenasData } from '../types.js';
import { sendData } from '../validate.js';

export const resenasRouter = Router();

resenasRouter.get('/resenas', (_req, res) => {
  const db = getDb();
  const resenas = db
    .prepare(
      `SELECT id, autor, calificacion, titulo, texto, fecha
       FROM resenas
       ORDER BY orden ASC, id ASC`,
    )
    .all() as Resena[];
  const calificaciones = (
    db
      .prepare(
        `SELECT plataforma, puntaje, escala_max
         FROM calificaciones_plataforma
         ORDER BY CASE plataforma WHEN 'GOOGLE' THEN 1 WHEN 'BOOKING' THEN 2 END`,
      )
      .all() as { plataforma: CalificacionPlataforma['plataforma']; puntaje: number; escala_max: number }[]
  ).map(({ plataforma, puntaje, escala_max }) => ({ plataforma, puntaje, escalaMax: escala_max }));
  const data: ResenasData = { resenas, calificaciones };
  sendData(res, data);
});
