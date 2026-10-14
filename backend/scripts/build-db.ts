// Recrea db/casacosta.db desde db/schema.sql y db/seed.sql (research D-09).
// Si alguna restricción CHECK, UNIQUE o FOREIGN KEY falla, borra la base y termina con error.
import Database from 'better-sqlite3';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dbDir = new URL('../../db/', import.meta.url);
const dbPath = process.env.CASACOSTA_DB_PATH ?? fileURLToPath(new URL('casacosta.db', dbDir));
const schemaPath = fileURLToPath(new URL('schema.sql', dbDir));
const seedPath = fileURLToPath(new URL('seed.sql', dbDir));

const removeDb = () => {
  for (const suffix of ['', '-wal', '-shm', '-journal']) {
    if (existsSync(dbPath + suffix)) rmSync(dbPath + suffix);
  }
};

const withSeed = !process.argv.includes('--schema-only');

removeDb();
const db = new Database(dbPath);
try {
  db.pragma('foreign_keys = ON');
  const schema = readFileSync(schemaPath, 'utf8');
  const seed = withSeed ? readFileSync(seedPath, 'utf8') : '';
  db.transaction(() => {
    db.exec(schema);
    if (seed) db.exec(seed);
  })();
  const violations = db.pragma('foreign_key_check') as unknown[];
  if (violations.length > 0) {
    throw new Error(`Violaciones de FOREIGN KEY: ${JSON.stringify(violations)}`);
  }
  db.close();
  console.log(`Base construida en ${dbPath}`);
} catch (error) {
  db.close();
  removeDb();
  console.error('No se pudo construir la base de datos:', error instanceof Error ? error.message : error);
  process.exit(1);
}
