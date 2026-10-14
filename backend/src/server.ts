import express, { type ErrorRequestHandler } from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contactoRouter } from './routes/contacto.js';
import { destinosRouter } from './routes/destinos.js';
import { faqsRouter } from './routes/faqs.js';
import { habitacionesRouter } from './routes/habitaciones.js';
import { planesRouter } from './routes/planes.js';
import { resenasRouter } from './routes/resenas.js';
import { sendError } from './validate.js';

export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');
  app.set('json spaces', 0);

  app.use('/api', (_req, res, next) => {
    res.type('application/json; charset=utf-8');
    next();
  });

  app.use('/api', contactoRouter);
  app.use('/api', planesRouter);
  app.use('/api', destinosRouter);
  app.use('/api', habitacionesRouter);
  app.use('/api', resenasRouter);
  app.use('/api', faqsRouter);

  // Catch-all de /api: GET a ruta inexistente → 404; cualquier otro método → 405.
  app.all('/api/*', (req, res) => {
    if (req.method === 'GET') {
      sendError(res, 'NOT_FOUND');
      return;
    }
    res.set('Allow', 'GET');
    sendError(res, 'METHOD_NOT_ALLOWED');
  });

  // Producción (código compilado en backend/dist o NODE_ENV=production): Express sirve el
  // frontend compilado (research D-13).
  const distDir = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
  const esProduccion = process.env.NODE_ENV === 'production' || import.meta.url.includes('/backend/dist/');
  if (esProduccion && existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => res.sendFile(`${distDir}index.html`));
  }

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error(error);
    sendError(res, 'INTERNAL_ERROR');
  };
  app.use(errorHandler);

  return app;
};

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const port = Number(process.env.PORT ?? 3001);
  createApp().listen(port, () => {
    console.log(`API de Casa Costa en http://localhost:${port}`);
  });
}
