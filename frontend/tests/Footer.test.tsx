import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../src/components/Footer';
import { contactoSemilla, mockApi, renderWithProviders } from './renderWithProviders';

describe('Footer (FR-005, P-21)', () => {
  it('Instagram abre instagram_url, el teléfono abre whatsapp_url y la dirección es texto', async () => {
    mockApi({ '/contacto': contactoSemilla });
    renderWithProviders(<Footer />);
    const instagram = await screen.findByRole('link', { name: 'Instagram @hotelcasacosta_' });
    expect(instagram).toHaveAttribute('href', contactoSemilla.instagramUrl);
    expect(instagram).toHaveAttribute('target', '_blank');
    expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'WhatsApp +57 312 8686680' })).toHaveAttribute('href', contactoSemilla.whatsappUrl);
    expect(screen.getByRole('link', { name: 'Booking.com' })).toHaveAttribute('href', contactoSemilla.bookingUrl);
    const direccion = screen.getByText(contactoSemilla.direccion!);
    expect(direccion.closest('a')).toBeNull();
  });

  it('sin URL, Instagram y teléfono se muestran como texto', async () => {
    mockApi({ '/contacto': { ...contactoSemilla, instagramUrl: null, whatsappUrl: null } });
    renderWithProviders(<Footer />);
    const handle = await screen.findByText('@hotelcasacosta_');
    expect(handle.closest('a')).toBeNull();
    expect(screen.getByText('+57 312 8686680').closest('a')).toBeNull();
  });

  it('oculta las filas sin dato', async () => {
    mockApi({ '/contacto': { ...contactoSemilla, bookingUrl: null, direccion: null } });
    renderWithProviders(<Footer />);
    await screen.findByText('@hotelcasacosta_');
    expect(screen.queryByText('Reservas')).not.toBeInTheDocument();
    expect(screen.queryByText('Dirección')).not.toBeInTheDocument();
  });
});
