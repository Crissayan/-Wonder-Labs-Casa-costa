import { Router } from 'express';
import { getDb } from '../db.js';
import type { Faq } from '../types.js';
import { sendData } from '../validate.js';

export const faqsRouter = Router();

faqsRouter.get('/faqs', (_req, res) => {
  const faqs = getDb()
    .prepare(
      `SELECT id, pregunta, respuesta
       FROM faqs
       ORDER BY orden ASC, id ASC`,
    )
    .all() as Faq[];
  sendData(res, faqs);
});
