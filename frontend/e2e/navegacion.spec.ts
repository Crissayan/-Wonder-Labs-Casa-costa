// Historia 7: navegar y ver datos de contacto (escenarios 1–4) + rutas.
import { expect, test } from '@playwright/test';

const rutas = ['/', '/experiencias', '/comodidades', '/como-llegar', '/faqs'];

test.describe('Navegación y contacto (US7)', () => {
  test('menú mobile: navega, se cierra y RESERVAR abre el modal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Solo mobile');
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    const menu = page.getByRole('dialog', { name: 'Menú' });
    for (const label of ['Inicio', 'Experiencias', 'Comodidades', 'Como llegar', 'FAQS']) {
      await expect(menu.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole('link', { name: 'Experiencias' }).click();
    await expect(page).toHaveURL(/\/experiencias$/);
    await expect(page.getByRole('dialog', { name: 'Menú' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page.getByRole('dialog', { name: 'Menú' }).getByRole('button', { name: 'RESERVAR' }).click();
    await expect(page.getByRole('dialog', { name: 'Reserva ya' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Menú' })).toHaveCount(0);
  });

  test('header de escritorio lleva a cada página', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Solo escritorio');
    await page.goto('/');
    for (const [label, ruta] of [['EXPERIENCIAS', '/experiencias'], ['COMODIDADES', '/comodidades'], ['COMO LLEGAR', '/como-llegar'], ['FAQS', '/faqs']]) {
      await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${ruta}$`));
    }
    await page.getByRole('link', { name: 'Hotel Casa Costa, inicio' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  for (const ruta of rutas) {
    test(`footer y WhatsApp visibles en ${ruta}`, async ({ page }) => {
      const { data: contacto } = await (await page.request.get('/api/contacto')).json();
      await page.goto(ruta);
      const footer = page.locator('footer');
      await expect(footer.getByText('@hotelcasacosta_')).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Instagram @hotelcasacosta_' })).toHaveAttribute('href', contacto.instagramUrl);
      await expect(footer.getByRole('link', { name: `WhatsApp ${contacto.telefono}` })).toHaveAttribute('href', contacto.whatsappUrl);
      await expect(footer.getByText(contacto.direccion).locator('xpath=ancestor::a')).toHaveCount(0);
      const whatsapp = page.getByRole('link', { name: 'Escríbenos por WhatsApp' });
      await expect(whatsapp).toBeVisible();
      await expect(whatsapp).toHaveAttribute('href', contacto.whatsappUrl);
      await expect(whatsapp).toHaveAttribute('target', '_blank');
    });
  }

  test('una ruta desconocida redirige a Inicio', async ({ page }) => {
    await page.goto('/no-existe');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'TU ESCAPE A CAPURGANÁ' })).toBeVisible();
  });
});
