import { afterAll, describe, expect, it } from 'vitest';
import { closeDb } from '../src/db.js';
import { setupApi } from './helpers.js';

afterAll(() => closeDb());

describe('GET /api/faqs (US6)', () => {
  it('devuelve las 3 FAQs de la constitución en orden', async () => {
    const { api } = setupApi();
    const res = await api.get('/api/faqs');
    expect(res.status).toBe(200);
    expect(res.body.data.map((f: { pregunta: string }) => f.pregunta)).toEqual([
      '¿En Capurganá hay aeropuerto?',
      '¿Cuál es la diferencia entre planes y tours?',
      '¿Qué hay en Bahía Aguacate?',
    ]);
    expect(res.body.data[0].respuesta).toMatch(/^Sí\. Puedes llegar en vuelo directo/);
    expect(JSON.stringify(res.body)).not.toMatch(/mascota|buñuelos|profe/);
  });

  it('tabla vacía → 200 con lista vacía', async () => {
    const { api } = setupApi({ seed: false });
    expect((await api.get('/api/faqs')).body).toEqual({ data: [] });
  });
});
