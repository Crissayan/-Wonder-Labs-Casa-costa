import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { linkDestinos } from '../src/linkDestinos';

const destinos = [
  { slug: 'playa-la-miel', nombre: 'Playa La Miel en Panamá' },
  { slug: 'bahia-sapzurro', nombre: 'Bahía Sapzurro' },
  { slug: 'cabo-tiburon', nombre: 'Cabo Tiburón' },
];
const conoce =
  '3 días inolvidables en Capurganá con transporte ida y regreso desde Necoclí, desayunos y cenas en el hotel, y tours espectaculares como Playa La Miel en Panamá, Bahía Sapzurro y Cabo Tiburón.';
const intrepida =
  '4 días inolvidables… como Playa Soledad, Bahía Aguacate y Reserva Natural El Cielo.';

const pintar = (texto: string, lista = destinos) =>
  render(<p>{linkDestinos(texto, lista, (d, key) => <a key={key} href={`#destino-${d.slug}`}>{d.nombre}</a>)}</p>);

describe('linkDestinos (FR-024, R-21)', () => {
  it('enlaza los tres destinos existentes de "Plan Conoce Capurganá"', () => {
    pintar(conoce);
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '#destino-playa-la-miel',
      '#destino-bahia-sapzurro',
      '#destino-cabo-tiburon',
    ]);
  });

  it('deja como texto los destinos que no existen', () => {
    pintar(intrepida);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText(/Bahía Aguacate y Reserva Natural El Cielo/)).toBeInTheDocument();
  });

  it('es sensible a mayúsculas y tildes', () => {
    pintar('Visita cabo tiburon y Cabo Tiburón.');
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('sin destinos no genera enlaces', () => {
    pintar(conoce, []);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
