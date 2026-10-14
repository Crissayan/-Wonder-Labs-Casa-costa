import Database from 'better-sqlite3';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import { closeDb } from '../src/db.js';
import { createApp } from '../src/server.js';

const dbDir = new URL('../../db/', import.meta.url);

// Crea una base temporal (esquema + seed, o solo esquema) y devuelve un agente de Supertest.
export const setupApi = (options: { seed?: boolean } = {}) => {
  const { seed = true } = options;
  const dbPath = join(mkdtempSync(join(tmpdir(), 'casacosta-')), 'test.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.exec(readFileSync(fileURLToPath(new URL('schema.sql', dbDir)), 'utf8'));
  if (seed) db.exec(readFileSync(fileURLToPath(new URL('seed.sql', dbDir)), 'utf8'));
  db.close();

  closeDb();
  process.env.CASACOSTA_DB_PATH = dbPath;
  return { api: request(createApp()), dbPath };
};

export const useMissingDb = () => {
  closeDb();
  process.env.CASACOSTA_DB_PATH = join(tmpdir(), 'casacosta-no-existe.db');
  return request(createApp());
};
