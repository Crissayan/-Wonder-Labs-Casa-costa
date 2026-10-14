import { Router } from 'express';
import { getDb } from '../db.js';
import { sendData } from '../validate.js';
import type { Contacto } from '../types.js';

// Claves de configuración que consume la interfaz (R-03, R-20).
const claves: Record<string, keyof Contacto> = {
  telefono: 'telefono',
  whatsapp_url: 'whatsappUrl',
  instagram: 'instagram',
  instagram_url: 'instagramUrl',
  booking_url: 'bookingUrl',
  vuelo_url: 'vueloUrl',
  bus_url: 'busUrl',
  direccion: 'direccion',
};

export const contactoRouter = Router();

contactoRouter.get('/contacto', (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT clave, valor
       FROM configuracion
       WHERE clave IN ('telefono', 'whatsapp_url', 'instagram', 'instagram_url', 'booking_url',
                       'vuelo_url', 'bus_url', 'direccion')`,
    )
    .all() as { clave: string; valor: string }[];

  const contacto: Contacto = {
    telefono: null,
    whatsappUrl: null,
    instagram: null,
    instagramUrl: null,
    bookingUrl: null,
    vueloUrl: null,
    busUrl: null,
    direccion: null,
  };
  for (const { clave, valor } of rows) {
    contacto[claves[clave]] = valor;
  }
  sendData(res, contacto);
});
