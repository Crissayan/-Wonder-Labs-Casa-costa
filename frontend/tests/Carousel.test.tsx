import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Carousel } from '../src/components/Carousel';
import { mockViewport } from './matchMedia';

const items = ['Uno', 'Dos', 'Tres', 'Cuatro'];
const renderCarousel = (list: string[], desktopMode: 'peek' | 'single' = 'single') =>
  render(
    <Carousel
      items={list}
      getKey={(i) => i}
      label="pruebas"
      desktopMode={desktopMode}
      renderItem={(item, { active }) => <span data-active={active}>{item}</span>}
    />,
  );

describe('Carousel', () => {
  it('en escritorio avanza y retrocede de forma circular', async () => {
    mockViewport(true);
    renderCarousel(items);
    expect(screen.getByText('Uno')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Anterior: pruebas' }));
    expect(screen.getByText('Cuatro')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente: pruebas' }));
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente: pruebas' }));
    expect(screen.getByText('Dos')).toBeInTheDocument();
  });

  it('en modo peek muestra anterior, activo y siguiente', () => {
    mockViewport(true);
    renderCarousel(items, 'peek');
    expect(screen.getByText('Cuatro')).toHaveAttribute('data-active', 'false');
    expect(screen.getByText('Uno')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText('Dos')).toHaveAttribute('data-active', 'false');
  });

  it('oculta flechas e indicadores con un solo elemento (CB-12)', () => {
    mockViewport(true);
    renderCarousel(['Solo']);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    mockViewport(false);
    renderCarousel(['Solo']);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('en mobile muestra todos los elementos deslizables con indicador de puntos', () => {
    mockViewport(false);
    renderCarousel(items);
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'Ir al elemento 1 de 4' })).toHaveAttribute('aria-selected', 'true');
  });
});
