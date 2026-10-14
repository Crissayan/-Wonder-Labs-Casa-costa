import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReservaModal } from '../src/components/ReservaModal';
import { ReservarButton } from '../src/components/ReservarButton';
import { mockViewport } from './matchMedia';
import { contactoSemilla, mockApi, renderWithProviders } from './renderWithProviders';

const abrir = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'RESERVAR' }));
  return screen.findByRole('dialog', { name: 'Reserva ya' });
};

const montar = () =>
  renderWithProviders(
    <>
      <ReservarButton />
      <ReservaModal />
    </>,
  );

describe('ReservaModal (FR-004)', () => {
  it('muestra ambos canales con enlaces externos seguros', async () => {
    mockViewport(true);
    mockApi({ '/contacto': contactoSemilla });
    montar();
    const dialog = await abrir();
    const directo = await within(dialog).findByRole('link', { name: 'DIRECTO' });
    const booking = within(dialog).getByRole('link', { name: 'BOOKING' });
    expect(directo).toHaveAttribute('href', contactoSemilla.whatsappUrl);
    expect(booking).toHaveAttribute('href', contactoSemilla.bookingUrl);
    for (const link of [directo, booking]) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(within(dialog).getByText('Entrarás en contacto con asesores de Casa Costa')).toBeInTheDocument();
  });

  it('oculta BOOKING y su texto si booking_url no está configurada', async () => {
    mockViewport(false);
    mockApi({ '/contacto': { ...contactoSemilla, bookingUrl: null } });
    montar();
    const dialog = await abrir();
    await within(dialog).findByRole('link', { name: 'DIRECTO' });
    expect(within(dialog).queryByRole('link', { name: 'BOOKING' })).not.toBeInTheDocument();
    expect(within(dialog).queryByText(/redirigido a la página/)).not.toBeInTheDocument();
  });

  it('sin canales muestra el mensaje amigable', async () => {
    mockViewport(true);
    mockApi({ '/contacto': { ...contactoSemilla, bookingUrl: null, whatsappUrl: null } });
    montar();
    const dialog = await abrir();
    expect(
      await within(dialog).findByText(
        'En este momento no podemos mostrar las opciones de reserva. Intenta de nuevo más tarde.',
      ),
    ).toBeInTheDocument();
  });

  it('se cierra con el botón, con Esc y con clic en el fondo', async () => {
    mockViewport(true);
    mockApi({ '/contacto': contactoSemilla });
    montar();
    await abrir();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await abrir();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await abrir();
    await userEvent.click(screen.getByTestId('overlay-fondo'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
