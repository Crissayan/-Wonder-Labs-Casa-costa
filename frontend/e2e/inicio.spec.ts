// Historia 4: reseñas y calificaciones (escenarios 1–3) y robustez (escenario 2).
import { expect, test } from '@playwright/test';

test.describe('Reseñas y calificaciones (US4)', () => {
  test('muestra 4.7 GOOGLE y 9.0 BOOKING', async ({ page }) => {
    await page.goto('/');
    const bloque = page.locator('[data-fv="ini-calificaciones"]');
    await expect(bloque.getByText('4.7')).toBeVisible();
    await expect(bloque.getByText('GOOGLE')).toBeVisible();
    await expect(bloque.getByText('9.0')).toBeVisible();
    await expect(bloque.getByText('BOOKING')).toBeVisible();
  });

  test('la reseña de Daniela se lee completa en el pop-up', async ({ page }, testInfo) => {
    await page.goto('/');
    const boton = testInfo.project.name === 'desktop' ? 'Leer más de la reseña de Daniela' : 'Ver más de la reseña de Daniela';
    await page.getByRole('button', { name: boton }).click();
    const dialog = page.getByRole('dialog', { name: 'Reseña de Daniela' });
    await expect(dialog.getByText('EXCELENTE', { exact: true })).toBeVisible();
    await expect(dialog.getByText('5 ESTRELLAS')).toBeVisible();
    await expect(dialog.getByText('10/10/2025')).toBeVisible();
    await expect(dialog.getByText(/Definitivamente un lugar para recomendar\./)).toBeVisible();
    await expect(dialog.getByText(/google|booking/i)).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('si falla la carga de reseñas, el resto de la página sigue visible', async ({ page }) => {
    await page.route('**/api/resenas', (route) =>
      route.fulfill({ status: 500, json: { error: { code: 'INTERNAL_ERROR', message: 'x' } } }),
    );
    await page.goto('/');
    await expect(page.getByText('No pudimos cargar esta información. Intenta de nuevo en unos minutos.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TU ESCAPE A CAPURGANÁ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CASACOSTA TE ESPERA' })).toBeVisible();
    await expect(page.getByText(/INTERNAL_ERROR|stack|Error:/)).toHaveCount(0);
  });

  test('los botones de Inicio llevan a Comodidades y a Tours', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Ver opciones' }).click();
    await expect(page).toHaveURL(/\/comodidades$/);
    await page.goto('/');
    await page.getByRole('link', { name: 'Conoce más' }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/experiencias#tours$/);
    await expect(page.locator('#tours')).toBeInViewport();
    void testInfo;
  });
});
