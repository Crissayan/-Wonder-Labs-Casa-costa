import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';

let connection: Database.Database | undefined;

// Conexión perezosa: la ruta puede venir de CASACOSTA_DB_PATH (pruebas) o del archivo por defecto.
export const getDb = (): Database.Database => {
  if (!connection) {
    const dbPath =
      process.env.CASACOSTA_DB_PATH ?? fileURLToPath(new URL('../../db/casacosta.db', import.meta.url));
    connection = new Database(dbPath, { fileMustExist: true });
    connection.pragma('foreign_keys = ON');
  }
  return connection;
};

export const closeDb = () => {
  connection?.close();
  connection = undefined;
};
