// Historia 5: saber cómo llegar (escenarios 1–3 y CB-01).
import { expect, test } from '@playwright/test';

test.describe('Cómo llegar (US5)', () => {
  test('los botones abren vuelo, bus y WhatsApp en pestaña nueva', async ({ page }, testInfo) => {
    const { data: contacto } = await (await page.request.get('/api/contacto')).json();
    await page.goto('/como-llegar');
    const vuelo = page.getByRole('link', { name: testInfo.project.name === 'desktop' ? 'COMPRA AHORA' : 'Agenda tu vuelo' });
    const bus = page.getByRole('link', { name: 'Consulta tiquetes' });
    const lancha = page.getByRole('link', { name: 'VER MÁS' });
    await expect(vuelo).toHaveAttribute('href', contacto.vueloUrl);
    await expect(bus).toHaveAttribute('href', contacto.busUrl);
    await expect(lancha).toHaveAttribute('href', contacto.whatsappUrl);
    for (const link of [vuelo, bus, lancha]) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('sin vuelo_url ni bus_url sus botones no aparecen (CB-01)', async ({ page }) => {
    await page.route('**/api/contacto', async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      await route.fulfill({ response, json: { data: { ...body.data, vueloUrl: null, busUrl: null } } });
    });
    await page.goto('/como-llegar');
    await expect(page.getByRole('link', { name: 'VER MÁS' })).toBeVisible();
    await expect(page.getByRole('link', { name: /COMPRA AHORA|Agenda tu vuelo/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Consulta tiquetes' })).toHaveCount(0);
  });

  test('muestra los rótulos de opción y el banner de reserva en ambas vistas', async ({ page }) => {
    await page.goto('/como-llegar');
    await expect(page.getByText('Opción 1:')).toBeVisible();
    await expect(page.getByText('Opción 2:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CASACOSTA TE ESPERA' })).toBeVisible();
  });
});
