// Verificación visual automática (FR-070, contracts/visual-verification.md).
// Por cada archivo de cajas esperadas: abre la ruta en su ancho, lleva la página al estado
// indicado, comprueba las fuentes reales y compara cada [data-fv] con Figma (±2 px).
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type Box = { x: number; y: number; width: number; height: number };
type Expected = {
  frame: string;
  path: string;
  viewport: { width: number; height?: number };
  state: string;
  actions?: { click?: string; scrollTo?: string; waitFor?: string }[];
  /** Coordenadas relativas a este elemento (por defecto, al documento). */
  origin?: string;
  boxes: Record<string, Box & { compare?: (keyof Box)[] }>;
};

const TOLERANCIA = 2;
const expectedDir = fileURLToPath(new URL('./expected/', import.meta.url));
const outputDir = fileURLToPath(new URL('./output/', import.meta.url));
mkdirSync(outputDir, { recursive: true });

const files = readdirSync(expectedDir).filter((f) => f.endsWith('.json'));

const measure = (page: Page, id: string, origin?: string) =>
  page.evaluate(
    ([fvId, originSel]) => {
      const el = document.querySelector(`[data-fv="${fvId}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const o = originSel ? document.querySelector(originSel)?.getBoundingClientRect() : null;
      const ox = o ? o.left : -window.scrollX;
      const oy = o ? o.top : -window.scrollY;
      return { x: Math.round(r.left - ox), y: Math.round(r.top - oy), width: Math.round(r.width), height: Math.round(r.height) };
    },
    [id, origin ?? ''] as const,
  );

for (const file of files) {
  const spec = JSON.parse(readFileSync(`${expectedDir}${file}`, 'utf8')) as Expected;

  test(`${file} · ${spec.state} (frame ${spec.frame}) @visual`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== (spec.viewport.width >= 1024 ? 'desktop' : 'mobile'),
      'Se ejecuta solo en el proyecto de su ancho',
    );
    await page.setViewportSize({ width: spec.viewport.width, height: spec.viewport.height ?? 900 });
    await page.goto(spec.path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    // document.fonts.load devuelve las @font-face reales que coinciden; vacío = fuente de respaldo.
    const fonts = await page.evaluate(async () => ({
      nunito: (await document.fonts.load('700 1em Nunito')).length > 0,
      inter: (await document.fonts.load('400 1em Inter')).length > 0,
    }));
    expect(fonts, 'Nunito e Inter deben cargarse realmente (FV-06)').toEqual({ nunito: true, inter: true });

    for (const action of spec.actions ?? []) {
      if (action.scrollTo) await page.locator(action.scrollTo).first().scrollIntoViewIfNeeded();
      if (action.click) await page.locator(action.click).first().click();
      if (action.waitFor) await page.locator(action.waitFor).first().waitFor();
    }
    await page.waitForTimeout(300);

    const fallos: string[] = [];
    for (const [id, esperado] of Object.entries(spec.boxes)) {
      const real = await measure(page, id, spec.origin);
      if (!real) {
        fallos.push(`${id}: no existe en la página`);
        continue;
      }
      for (const key of esperado.compare ?? (['x', 'y', 'width', 'height'] as const)) {
        const diff = Math.abs(real[key] - esperado[key]);
        if (diff > TOLERANCIA) fallos.push(`${id}.${key}: esperado ${esperado[key]}, real ${real[key]} (Δ ${diff})`);
      }
    }

    await page.screenshot({ path: `${outputDir}${file.replace('.json', '')}.png`, fullPage: true });
    expect(fallos, `Mediciones fuera de tolerancia ±${TOLERANCIA} px`).toEqual([]);
  });
}

// FV-03: sin scroll horizontal entre 393 y 1456 px.
const rutas = ['/', '/experiencias', '/comodidades', '/como-llegar', '/faqs'];
for (const ruta of rutas) {
  test(`sin scroll horizontal en ${ruta} @visual`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Recorre todos los anchos una sola vez');
    for (const width of [393, 768, 1024, 1280, 1456]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(ruta);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${ruta} a ${width} px`).toBeLessThanOrEqual(0);
    }
  });
}
