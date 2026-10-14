import type { Contacto } from '@api/types';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ContactoProvider } from '../src/hooks/useContacto';
import { ReservaProvider } from '../src/hooks/useReserva';

export const contactoSemilla: Contacto = {
  telefono: '+57 312 8686680',
  whatsappUrl: 'https://wa.me/573128686680?text=hola',
  instagram: '@hotelcasacosta_',
  instagramUrl: 'https://www.instagram.com/hotelcasacosta_/',
  bookingUrl: 'https://www.booking.com/hotel/co/casa-costa.es.html',
  vueloUrl: null,
  busUrl: null,
  direccion: 'Calle la Arrocera, 278017, Capurganá Colombia',
};

// Simula la API: cada ruta devuelve { data } o un estado de error.
export const mockApi = (routes: Record<string, unknown | { status: number }>) => {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input).replace(/^\/api/, '');
    const entry = routes[url];
    if (entry && typeof entry === 'object' && 'status' in (entry as object)) {
      const { status } = entry as { status: number };
      return new Response(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'x' } }), { status });
    }
    if (entry === undefined) {
      return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'x' } }), { status: 404 });
    }
    return new Response(JSON.stringify({ data: entry }), { status: 200 });
  }) as typeof fetch;
};

export const renderWithProviders = (ui: ReactNode, { route = '/' } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <ContactoProvider>
        <ReservaProvider>{ui}</ReservaProvider>
      </ContactoProvider>
    </MemoryRouter>,
  );
