// Historia 2: planes y promociones con precio y detalle (escenarios de aceptación 1–7).
import { expect, test, type Page } from '@playwright/test';

const abrirPlan = async (page: Page, nombre: string) => {
  // Avanza el carrusel hasta que el plan buscado sea la tarjeta activa y la abre.
  const carrusel = page.getByRole('region', { name: 'Planes' }).or(page.locator('[aria-label="Planes"]'));
  for (let i = 0; i < 5; i++) {
    const activa = carrusel.getByRole('button', { name: `Ver detalle de ${nombre}` });
    if (await activa.isVisible().catch(() => false)) {
      await activa.click();
      return page.getByRole('dialog', { name: nombre });
    }
    const siguiente = carrusel.getByRole('button', { name: 'Siguiente: Planes' });
    if (await siguiente.count()) await siguiente.click();
    else await carrusel.getByRole('tab').nth(i + 1).click();
    await page.waitForTimeout(400);
  }
  throw new Error(`No se encontró el plan ${nombre}`);
};

test.describe('Planes y promociones (US2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForLoadState('networkidle');
  });

  test('lista 3 planes y 2 promociones sin prefijo "Tour"', async ({ page }) => {
    await expect(page.locator('[aria-label="Planes"] [aria-label^="Ver detalle"]').first()).toBeVisible();
    const planes = await page.request.get('/api/planes?categoria=plan');
    expect((await planes.json()).data).toHaveLength(3);
    const promos = page.locator('[aria-label="Promociones"]');
    await expect(promos.getByText('Capurganá a tu Ritmo')).toBeVisible();
    await expect(page.getByText(/Tour Capurganá/)).toHaveCount(0);
  });

  test('pop-up de un plan sin temporada baja', async ({ page }) => {
    const dialog = await abrirPlan(page, 'Plan Conoce Capurganá');
    await expect(dialog.getByText('Ideal para quienes quieren una primera experiencia completa, cómoda y al mejor precio.')).toBeVisible();
    await expect(dialog.getByText('$600.000', { exact: true })).toBeVisible();
    await expect(dialog.getByText(/Precio normal/)).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'RESERVAR' })).toBeVisible();
  });

  test('pop-up de un plan con temporada baja', async ({ page }) => {
    const dialog = await abrirPlan(page, 'Plan Capurganá Intrépida');
    await expect(dialog.getByText('$980.000', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Precio normal $1.100.000')).toBeVisible();
  });

  test('RESERVAR cierra el pop-up y abre el modal de reserva', async ({ page }) => {
    const dialog = await abrirPlan(page, 'Plan Conoce Capurganá');
    await dialog.getByRole('button', { name: 'RESERVAR' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(page.getByRole('dialog', { name: 'Reserva ya' })).toBeVisible();
  });

  test('un destino enlazado lleva a su bloque en Tours', async ({ page }) => {
    const dialog = await abrirPlan(page, 'Plan Conoce Capurganá');
    await dialog.getByRole('link', { name: 'Bahía Sapzurro' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('#destino-bahia-sapzurro')).toBeInViewport();
  });

  test('los destinos sin registro se muestran como texto plano', async ({ page }) => {
    const dialog = await abrirPlan(page, 'Plan Capurganá Intrépida');
    await expect(dialog.getByText(/Bahía Aguacate y Reserva Natural El Cielo/)).toBeVisible();
    await expect(dialog.getByRole('link')).toHaveCount(0);
  });

  test('un plan retirado muestra el mensaje amigable', async ({ page }) => {
    await page.route('**/api/planes/plan-conoce-capurgana', (route) =>
      route.fulfill({ status: 404, json: { error: { code: 'NOT_FOUND', message: 'No encontramos lo que buscas.' } } }),
    );
    const carrusel = page.locator('[aria-label="Planes"]');
    await carrusel.getByRole('button', { name: 'Ver detalle de Plan Conoce Capurganá' }).click();
    await expect(page.getByText('Este plan ya no está disponible.')).toBeVisible();
    await expect(page.getByText('Escríbenos por WhatsApp y te ayudamos a encontrar otro.')).toBeVisible();
  });
});
