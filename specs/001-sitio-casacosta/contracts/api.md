# Contrato de la API (solo lectura)

Base: `/api`. Constitución v1.3.0 ("Contrato de la API") + spec (Anexo A). Tipos en
`backend/src/types.ts` (ver [data-model.md](../data-model.md)).

## Convenciones

- Solo `GET`. Respuestas JSON `application/json; charset=utf-8`.
- Éxito: `200` con `{ "data": <payload> }`. Listas vacías: `{ "data": [] }`.
- Error: `{ "error": { "code": "<CODE>", "message": "<mensaje en español>" } }`.
- Validación antes de consultar:
  - `slug`: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, máximo 100 caracteres.
  - `categoria` (opcional): `plan` | `promocion`.

| Código HTTP | `code` | Cuándo | `message` |
|---|---|---|---|
| 400 | `INVALID_PARAM` | `categoria` o `slug` inválidos | "El parámetro enviado no es válido." |
| 404 | `NOT_FOUND` | Slug inexistente, plan inactivo o ruta `/api/*` inexistente | "No encontramos lo que buscas." |
| 405 | `METHOD_NOT_ALLOWED` | Método distinto de `GET` en `/api/*` (cabecera `Allow: GET`) | "Esta acción no está disponible." |
| 500 | `INTERNAL_ERROR` | Error inesperado (detalle solo en el log) | "Ocurrió un problema. Intenta de nuevo en unos minutos." |

## Endpoints

| Método y ruta | `data` | Notas |
|---|---|---|
| `GET /api/planes?categoria=plan\|promocion` | `Plan[]` | Solo `activo = 1`, `ORDER BY orden, id`. Sin `categoria`: ambas categorías. |
| `GET /api/planes/:slug` | `Plan` | 404 si no existe o `activo = 0`. |
| `GET /api/destinos` | `Destino[]` | `ORDER BY orden, id`. |
| `GET /api/habitaciones` | `Habitacion[]` | Cada una con `imagenes: HabitacionImagen[]` ordenadas. |
| `GET /api/habitaciones/:slug` | `Habitacion` | 404 si no existe. |
| `GET /api/resenas` | `{ resenas: Resena[]; calificaciones: CalificacionPlataforma[] }` | Calificaciones: GOOGLE, BOOKING. |
| `GET /api/faqs` | `Faq[]` | `ORDER BY orden, id`. |
| `GET /api/contacto` | `Contacto` | 8 claves de [data-model.md](../data-model.md#configuración-configuracion); ausentes → `null`. |

## Ejemplos

`GET /api/planes/plan-capurgana-intrepida` → `200`

```json
{
  "data": {
    "id": 2,
    "slug": "plan-capurgana-intrepida",
    "nombre": "Plan Capurganá Intrépida",
    "categoria": "plan",
    "descripcion": "…",
    "textoIdeal": "…",
    "duracionDias": 3,
    "precioNormal": 1100000,
    "precioTemporadaBaja": 980000,
    "imagenUrl": "/img/planes/plan-capurgana-intrepida.webp"
  }
}
```

`GET /api/planes?categoria=tour` → `400`

```json
{ "error": { "code": "INVALID_PARAM", "message": "El parámetro enviado no es válido." } }
```

`POST /api/faqs` → `405`, cabecera `Allow: GET`

```json
{ "error": { "code": "METHOD_NOT_ALLOWED", "message": "Esta acción no está disponible." } }
```

`GET /api/contacto` → `200`

```json
{
  "data": {
    "telefono": "+57 312 8686680",
    "whatsappUrl": "https://wa.me/573128686680?text=…",
    "instagram": "@hotelcasacosta_",
    "instagramUrl": "https://www.instagram.com/hotelcasacosta_/",
    "bookingUrl": "https://www.booking.com/hotel/co/casa-costa.es.html",
    "vueloUrl": "https://moonflights.com.co/servicios/vuelos-ch%C3%A1rter/14",
    "busUrl": "https://www.redbus.co/pasajes-de-bus/medellin-a-necocli-ant",
    "direccion": "Calle la Arrocera, 278017, Capurganá Colombia"
  }
}
```

(`duracionDias` y las URLs pendientes del ejemplo son ilustrativas; ver D-11 en
[research.md](../research.md).)
