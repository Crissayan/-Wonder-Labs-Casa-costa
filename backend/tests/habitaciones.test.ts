import { afterAll, describe, expect, it } from 'vitest';
import { closeDb } from '../src/db.js';
import { setupApi } from './helpers.js';

afterAll(() => closeDb());

describe('GET /api/habitaciones (US3)', () => {
  it('lista 5 habitaciones ordenadas, con 3 imágenes y sin precio', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/habitaciones');
    expect(res.status).toBe(200);
    expect(res.body.data.map((h: { nombre: string }) => h.nombre)).toEqual([
      'Habitación #1',
      'Habitación #2',
      'Habitación #3',
      'Habitación #4',
      'Apartamento',
    ]);
    for (const habitacion of res.body.data) {
      expect(habitacion.precio).toBeNull();
      expect(habitacion.imagenes).toHaveLength(3);
      expect(habitacion.imagenes[0].url).toMatch(/-1\.webp$/);
    }
  });

  it('detalle de la Habitación #3', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/habitaciones/habitacion-3');
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      camasDescripcion: '1 cama doble y 1 litera',
      capacidadMax: 3,
      areaM2: 11,
      tipo: 'Habitación triple con baño privado',
    });
    expect(res.body.data.imagenes).toHaveLength(3);
  });

  it('slug inexistente → 404 y slug inválido → 400', async () => {
    const { api } = setupApi();
    expect((await api.get('/api/habitaciones/habitacion-9')).status).toBe(404);
    expect((await api.get('/api/habitaciones/Habitacion_1')).status).toBe(400);
  });

  it('tabla vacía → 200 con lista vacía', async () => {
    const { api } = setupApi({ seed: false });
    expect((await api.get('/api/habitaciones')).body).toEqual({ data: [] });
  });
});
