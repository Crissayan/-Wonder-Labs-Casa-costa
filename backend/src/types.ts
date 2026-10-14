// Tipos compartidos del contrato de la API (spec Anexo A.3). El frontend los importa con `import type`.
export type CategoriaPlan = 'plan' | 'promocion';

export interface Plan {
  id: number;
  slug: string;
  nombre: string;
  categoria: CategoriaPlan;
  descripcion: string;
  textoIdeal: string | null;
  duracionDias: number;
  precioNormal: number;
  precioTemporadaBaja: number | null;
  imagenUrl: string | null;
}

export interface Destino {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  destacado: string | null;
  imagenUrl: string | null;
}

export interface HabitacionImagen { id: number; url: string; alt: string; }

export interface Habitacion {
  id: number;
  slug: string;
  nombre: string;
  tipo: string;
  areaM2: number;
  capacidadMax: number;
  camasDescripcion: string;
  descripcion: string;
  precio: number | null;
  imagenes: HabitacionImagen[];
}

export interface Resena {
  id: number;
  autor: string;
  calificacion: number;
  titulo: string;
  texto: string;
  fecha: string; // YYYY-MM-DD
}

export interface CalificacionPlataforma {
  plataforma: 'GOOGLE' | 'BOOKING';
  puntaje: number;
  escalaMax: number;
}

export interface ResenasData {
  resenas: Resena[];
  calificaciones: CalificacionPlataforma[];
}

export interface Faq { id: number; pregunta: string; respuesta: string; }

export interface Contacto {
  telefono: string | null;
  whatsappUrl: string | null;
  instagram: string | null;
  instagramUrl: string | null;
  bookingUrl: string | null;
  vueloUrl: string | null;
  busUrl: string | null;
  direccion: string | null;
}

export type ApiErrorCode = 'INVALID_PARAM' | 'NOT_FOUND' | 'METHOD_NOT_ALLOWED' | 'INTERNAL_ERROR';

export interface ApiError {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}
