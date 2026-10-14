PRAGMA foreign_keys = ON;

-- Datos de contacto y enlaces externos (clave/valor)
CREATE TABLE configuracion (
  clave  TEXT PRIMARY KEY,          -- 'whatsapp', 'whatsapp_url', 'instagram', 'booking_url',
                                    -- 'instagram_url', 'vuelo_url', 'bus_url', 'direccion',
                                    -- 'telefono'
  valor  TEXT NOT NULL
);

-- Planes y promociones (paquetes con precio)
CREATE TABLE planes (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                   TEXT    NOT NULL UNIQUE,
  nombre                 TEXT    NOT NULL,
  categoria              TEXT    NOT NULL CHECK (categoria IN ('plan', 'promocion')),
  descripcion            TEXT    NOT NULL,
  texto_ideal            TEXT,                       -- "Ideal para quienes…"
  duracion_dias          INTEGER NOT NULL CHECK (duracion_dias > 0),
  precio_normal          INTEGER NOT NULL CHECK (precio_normal > 0),
  precio_temporada_baja  INTEGER CHECK (precio_temporada_baja IS NULL
                                        OR (precio_temporada_baja > 0
                                            AND precio_temporada_baja < precio_normal)),
  imagen_url             TEXT,
  orden                  INTEGER NOT NULL DEFAULT 0,
  activo                 INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

-- Destinos turísticos (sección "Tours")
CREATE TABLE destinos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  nombre      TEXT    NOT NULL,
  descripcion TEXT    NOT NULL,
  destacado   TEXT,                                  -- frase de cierre resaltada
  imagen_url  TEXT,
  orden       INTEGER NOT NULL DEFAULT 0
);

-- Habitaciones
CREATE TABLE habitaciones (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT    NOT NULL UNIQUE,
  nombre            TEXT    NOT NULL,                -- "Habitación #1", "Apartamento"
  tipo              TEXT    NOT NULL,                -- "Habitación familiar con baño privado"
  area_m2           INTEGER NOT NULL CHECK (area_m2 > 0),
  capacidad_max     INTEGER NOT NULL CHECK (capacidad_max BETWEEN 1 AND 8),
  camas_descripcion TEXT    NOT NULL,                -- "5 camas individuales"
  descripcion       TEXT    NOT NULL,
  precio            INTEGER CHECK (precio IS NULL OR precio > 0),  -- siempre NULL (R-22)
  orden             INTEGER NOT NULL DEFAULT 0
);

-- Imágenes del carrusel de cada habitación
CREATE TABLE habitacion_imagenes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  habitacion_id  INTEGER NOT NULL REFERENCES habitaciones(id) ON DELETE CASCADE,
  url            TEXT    NOT NULL,
  alt            TEXT    NOT NULL,
  orden          INTEGER NOT NULL DEFAULT 0
);

-- Reseñas mostradas en el carrusel
CREATE TABLE resenas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  autor        TEXT    NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  titulo       TEXT    NOT NULL,
  texto        TEXT    NOT NULL,
  fecha        TEXT    NOT NULL,                     -- YYYY-MM-DD
  orden        INTEGER NOT NULL DEFAULT 0
);

-- Calificación agregada por plataforma
CREATE TABLE calificaciones_plataforma (
  plataforma  TEXT PRIMARY KEY CHECK (plataforma IN ('GOOGLE', 'BOOKING')),
  puntaje     REAL NOT NULL CHECK (puntaje >= 0),
  escala_max  REAL NOT NULL CHECK (escala_max > 0),
  CHECK (puntaje <= escala_max)
);

-- Preguntas frecuentes
CREATE TABLE faqs (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  pregunta  TEXT    NOT NULL UNIQUE,
  respuesta TEXT    NOT NULL,
  orden     INTEGER NOT NULL DEFAULT 0
);
