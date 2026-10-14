// Historia 3: conocer las habitaciones (escenarios de aceptación 1–3 + galería).
import { expect, test } from '@playwright/test';

test.describe('Habitaciones (US3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comodidades');
    await page.waitForLoadState('networkidle');
  });

  test('escritorio: la flecha derecha muestra la Habitación #2', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Solo escritorio');
    const carrusel = page.locator('[aria-label="Habitaciones"]');
    await expect(carrusel.getByRole('heading', { name: 'Habitación #1', exact: true })).toBeVisible();
    await carrusel.getByRole('button', { name: 'Siguiente: Habitaciones' }).click();
    const tarjeta = page.locator('[data-fv="habitacion-tarjeta"]');
    await expect(tarjeta.getByText('Habitación #2')).toBeVisible();
    await expect(tarjeta.getByText('1 cama individual y 2 literas')).toBeVisible();
    await expect(tarjeta.getByText('Hasta 4 personas')).toBeVisible();
  });

  test('la tarjeta de la Habitación #3 muestra camas y capacidad, sin precio', async ({ page }, testInfo) => {
    const carrusel = page.locator('[aria-label="Habitaciones"]');
    if (testInfo.project.name === 'desktop') {
      for (let i = 0; i < 2; i++) await carrusel.getByRole('button', { name: 'Siguiente: Habitaciones' }).click();
    } else {
      await carrusel.getByRole('tab', { name: 'Ir al elemento 3 de 5' }).click();
    }
    const tarjeta = carrusel.locator('article', { hasText: 'Habitación #3' });
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta.getByText(/1 cama doble y 1 litera/)).toBeVisible();
    await expect(tarjeta.getByText(/Hasta 3 personas/)).toBeVisible();
    await expect(page.getByText(/precio/i)).toHaveCount(0);
  });

  test('mobile: deslizar muestra la siguiente habitación', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Solo mobile');
    const pista = page.locator('[aria-label="Habitaciones"] > div').first();
    await pista.evaluate((el) => el.scrollBy({ left: 339, behavior: 'instant' as ScrollBehavior }));
    await expect(page.getByRole('tab', { name: 'Ir al elemento 2 de 5' })).toHaveAttribute('aria-selected', 'true');
  });

  test('escritorio: una miniatura cambia la imagen y se reinicia al cambiar de habitación', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Solo escritorio');
    const imagen = page.locator('[data-fv="habitacion-imagen"]');
    await expect(imagen).toHaveAttribute('src', /habitacion-1-1\.webp$/);
    await page.getByRole('button', { name: 'Ver foto 2 de Habitación #1' }).click();
    await expect(imagen).toHaveAttribute('src', /habitacion-1-2\.webp$/);
    await expect(page.getByRole('button', { name: 'Ver foto 2 de Habitación #1' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Siguiente: Habitaciones' }).click();
    await expect(imagen).toHaveAttribute('src', /habitacion-2-1\.webp$/);
  });
});
