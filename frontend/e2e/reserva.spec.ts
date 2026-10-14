// Historia 1: elegir canal de reserva desde cualquier CTA (escenarios de aceptación 1–5).
import { expect, test } from '@playwright/test';

// Escritorio: RESERVAR del header. Mobile: el CTA "RESERVA" de la página (el del menú se prueba en US7).
const abrirDesdeHeader = async (page: import('@playwright/test').Page) => {
  const header = page.locator('[data-fv="header-reservar"]');
  if (await header.count()) {
    await header.click();
    return;
  }
  const cta = page.locator('[data-fv="cta-reservar"]').first();
  await cta.scrollIntoViewIfNeeded();
  await cta.click();
};

test.describe('Reserva por canales externos (US1)', () => {
  test('cualquier CTA abre el modal con DIRECTO y BOOKING', async ({ page }) => {
    await page.goto('/');
    await abrirDesdeHeader(page);
    const dialog = page.getByRole('dialog', { name: 'Reserva ya' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Conoce las dos formas de reservar en Casa Costa:')).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'DIRECTO' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'BOOKING' })).toBeVisible();
  });

  test('DIRECTO abre whatsapp_url y BOOKING abre booking_url en pestaña nueva', async ({ page }) => {
    const contacto = await (await page.request.get('/api/contacto')).json();
    await page.goto('/');
    await abrirDesdeHeader(page);
    const dialog = page.getByRole('dialog', { name: 'Reserva ya' });
    const directo = dialog.getByRole('link', { name: 'DIRECTO' });
    const booking = dialog.getByRole('link', { name: 'BOOKING' });
    await expect(directo).toHaveAttribute('href', contacto.data.whatsappUrl);
    await expect(booking).toHaveAttribute('href', contacto.data.bookingUrl);
    for (const link of [directo, booking]) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('un canal sin configurar no se muestra', async ({ page }) => {
    await page.route('**/api/contacto', async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      await route.fulfill({ response, json: { data: { ...body.data, bookingUrl: null } } });
    });
    await page.goto('/');
    await abrirDesdeHeader(page);
    const dialog = page.getByRole('dialog', { name: 'Reserva ya' });
    await expect(dialog.getByRole('link', { name: 'DIRECTO' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'BOOKING' })).toHaveCount(0);
    await expect(dialog.getByText(/redirigido a la página/)).toHaveCount(0);
  });

  test('al cerrar se conserva la posición de scroll', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-fv="cta-reservar"]').scrollIntoViewIfNeeded();
    const antes = await page.evaluate(() => window.scrollY);
    await page.locator('[data-fv="cta-reservar"]').click();
    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const despues = await page.evaluate(() => window.scrollY);
    expect(Math.abs(despues - antes)).toBeLessThanOrEqual(1);
  });
});
