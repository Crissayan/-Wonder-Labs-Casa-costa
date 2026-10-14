// Convierte las fotos exportadas de Figma (PNG/JPG) a WebP con un ancho máximo y borra el original.
// Uso: node scripts/optimize-images.mjs <archivo...> [--max=1920]
import sharp from 'sharp';
import { readFileSync, rmSync } from 'node:fs';

sharp.cache(false);

const args = process.argv.slice(2);
const max = Number(args.find((a) => a.startsWith('--max='))?.split('=')[1] ?? 1920);
const files = args.filter((a) => !a.startsWith('--'));

for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const info = await sharp(readFileSync(file)).resize({ width: max, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  if (out !== file) rmSync(file);
  console.log(`${out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
