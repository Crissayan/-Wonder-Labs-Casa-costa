import Database from 'better-sqlite3';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { closeDb } from '../src/db.js';
import { setupApi, useMissingDb } from './helpers.js';

afterAll(() => closeDb());

describe('API base', () => {
  it.each(['post', 'put', 'delete', 'patch'] as const)('%s /api/faqs → 405 con Allow: GET', async (method) => {
    const { api, dbPath } = setupApi();
    const res = await api[method]('/api/faqs');
    expect(res.status).toBe(405);
    expect(res.headers.allow).toBe('GET');
    expect(res.body).toEqual({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Esta acción no está disponible.' },
    });
    closeDb();
    const count = new Database(dbPath).prepare('SELECT COUNT(*) AS c FROM faqs').get() as { c: number };
    expect(count.c).toBe(3);
  });

  it('GET a ruta /api inexistente → 404 NOT_FOUND', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('error inesperado → 500 sin detalles técnicos', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const api = useMissingDb();
    const res = await api.get('/api/contacto');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un problema. Intenta de nuevo en unos minutos.' },
    });
    expect(JSON.stringify(res.body)).not.toMatch(/stack|SqliteError|at /);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('GET /api/contacto → 200 con las 8 claves', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/contacto');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body.data).toEqual({
      telefono: '+57 312 8686680',
      whatsappUrl: expect.stringMatching(/^https:\/\/wa\.me\/573128686680\?text=/),
      instagram: '@hotelcasacosta_',
      instagramUrl: 'https://www.instagram.com/hotelcasacosta_/',
      bookingUrl: 'https://www.booking.com/hotel/co/casa-costa.es.html',
      vueloUrl: 'https://moonflights.com.co/servicios/vuelos-ch%C3%A1rter/14',
      busUrl: 'https://www.redbus.co/pasajes-de-bus/medellin-a-necocli-ant',
      direccion: 'Calle la Arrocera, 278017, Capurganá Colombia',
    });
  });
});
