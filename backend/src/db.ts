
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

let connection: Database.Database | undefined;

export const getDb = (): Database.Database => {
  if (!connection) {
    const dbPath = process.env.CASACOSTA_DB_PATH
      ? path.resolve(process.env.CASACOSTA_DB_PATH)
      : path.resolve(process.cwd(), '../db/casacosta.db');

    console.log('[SQLite] Ruta de base de datos:', dbPath);

    if (!fs.existsSync(dbPath)) {
      throw new Error(`No se encontró la base de datos SQLite: ${dbPath}`);
    }

    connection = new Database(dbPath, {
      fileMustExist: true
    });

    connection.pragma('foreign_keys = ON');
  }

  return connection;
};


export const closeDb = () => {
  connection?.close();
  connection = undefined;
};
