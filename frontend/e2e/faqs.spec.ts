// Historia 6: resolver dudas frecuentes (escenarios 1–3) y robustez (escenario 3).
import { expect, test } from '@playwright/test';

test.describe('Preguntas frecuentes (US6)', () => {
  test('una pregunta se despliega y se pliega', async ({ page }) => {
    await page.goto('/faqs');
    const boton = page.getByRole('button', { name: '¿En Capurganá hay aeropuerto?' });
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await boton.click();
    await expect(boton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText(/Puedes llegar en vuelo directo desde el aeropuerto Olaya Herrera/)).toBeVisible();
    await boton.click();
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByText(/Puedes llegar en vuelo directo/)).toBeHidden();
  });

  test('no aparece contenido de prueba ni la pregunta de mascotas', async ({ page }) => {
    await page.goto('/faqs');
    await expect(page.getByRole('button', { name: '¿Qué hay en Bahía Aguacate?' })).toBeVisible();
    for (const texto of ['¿El profe es el CEO?', '¿Cuántos buñuelos trae el desayuno?', '¿Qué hacer en Capurganá con 2mil?', '¿Puedo llevar a mi mascota?']) {
      await expect(page.getByText(texto)).toHaveCount(0);
    }
  });

  test('sin FAQs muestra un estado vacío amigable', async ({ page }) => {
    await page.route('**/api/faqs', (route) => route.fulfill({ status: 200, json: { data: [] } }));
    await page.goto('/faqs');
    await expect(page.getByText(/Pronto publicaremos las preguntas frecuentes\./)).toBeVisible();
  });
});
