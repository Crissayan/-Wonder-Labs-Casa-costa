import Database from 'better-sqlite3';
import { afterAll, describe, expect, it } from 'vitest';
import { closeDb } from '../src/db.js';
import { setupApi } from './helpers.js';

afterAll(() => closeDb());

describe('GET /api/planes y /api/destinos (US2)', () => {
  it('lista 3 planes activos ordenados', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/planes?categoria=plan');
    expect(res.status).toBe(200);
    expect(res.body.data.map((p: { slug: string }) => p.slug)).toEqual([
      'plan-conoce-capurgana',
      'plan-explora-capurgana',
      'plan-capurgana-intrepida',
    ]);
  });

  it('lista 2 promociones sin prefijo "Tour"', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/planes?categoria=promocion');
    expect(res.body.data.map((p: { nombre: string }) => p.nombre)).toEqual(['Capurganá a tu Ritmo', 'Capurganá Express']);
  });

  it('sin categoría devuelve ambas categorías (Q-18)', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/planes');
    expect(res.body.data).toHaveLength(5);
  });

  it('categoría inválida → 400 INVALID_PARAM', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/planes?categoria=tour');
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({ code: 'INVALID_PARAM', message: 'El parámetro enviado no es válido.' });
  });

  it('detalle con precios en camelCase', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/planes/plan-capurgana-intrepida');
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      nombre: 'Plan Capurganá Intrépida',
      precioNormal: 1100000,
      precioTemporadaBaja: 980000,
      duracionDias: 4,
      textoIdeal: expect.stringContaining('Ideal para quienes aman la aventura'),
    });
  });

  it('plan inexistente o inactivo → 404', async () => {
    const { api, dbPath } = setupApi();
    expect((await api.get('/api/planes/no-existe')).status).toBe(404);
    closeDb();
    new Database(dbPath).prepare("UPDATE planes SET activo = 0 WHERE slug = 'capurgana-express'").run();
    const res = await api.get('/api/planes/capurgana-express');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect((await api.get('/api/planes?categoria=promocion')).body.data).toHaveLength(1);
  });

  it.each(['..%2F..%2Fetc', 'Plan-Mayus', 'con%20espacio', 'a'.repeat(101)])('slug inválido %s → 400', async (slug) => {
    const { api } = setupApi();
    expect((await api.get(`/api/planes/${slug}`)).status).toBe(400);
  });

  it('tabla vacía → 200 con lista vacía', async () => {
    const { api } = setupApi({ seed: false });
    const res = await api.get('/api/planes?categoria=plan');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });

  it('destinos ordenados', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/destinos');
    expect(res.body.data.map((d: { nombre: string }) => d.nombre)).toEqual([
      'Playa La Miel en Panamá',
      'Bahía Sapzurro',
      'Cabo Tiburón',
    ]);
    expect(res.body.data[0]).toHaveProperty('imagenUrl', '/img/destinos/playa-la-miel.webp');
  });
});
