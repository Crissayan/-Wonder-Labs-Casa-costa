import { afterAll, describe, expect, it } from 'vitest';
import { closeDb } from '../src/db.js';
import { setupApi } from './helpers.js';

afterAll(() => closeDb());

describe('GET /api/resenas (US4)', () => {
  it('devuelve 3 reseñas ordenadas y las calificaciones GOOGLE y BOOKING', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/resenas');
    expect(res.status).toBe(200);
    expect(res.body.data.resenas.map((r: { autor: string; titulo: string }) => [r.autor, r.titulo])).toEqual([
      ['Daniela', 'EXCELENTE'],
      ['Gabriela', 'INCREÍBLE'],
      ['Samuel', 'PERFECTO'],
    ]);
    expect(res.body.data.resenas[0]).toMatchObject({ calificacion: 5, fecha: '2025-10-10' });
    expect(res.body.data.resenas[0]).not.toHaveProperty('plataforma');
    expect(res.body.data.calificaciones).toEqual([
      { plataforma: 'GOOGLE', puntaje: 4.7, escalaMax: 5 },
      { plataforma: 'BOOKING', puntaje: 9, escalaMax: 10 },
    ]);
  });

  it('tablas vacías → 200 con listas vacías', async () => {
    const { api } = setupApi({ seed: false });
    expect((await api.get('/api/resenas')).body).toEqual({ data: { resenas: [], calificaciones: [] } });
  });
});
