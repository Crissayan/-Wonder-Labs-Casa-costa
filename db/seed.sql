-- Contenido semilla del sitio Hotel Casa Costa.
-- Fuentes: constitución v1.3.0 ("Contenido confirmado") y frames web del archivo Figma
-- FUuT2oETZHhIh0PIIBFDHX (regla web), con las erratas de P-15 corregidas.
-- vuelo_url y bus_url: enlaces de los botones de Cómo llegar en Figma (27:38, 167:1501), limpios según
-- P-19 (sin parámetros de rastreo) y con la tilde de "chárter" bien codificada.

-- Configuración (R-03, R-20, P-08, P-21)
INSERT INTO configuracion (clave, valor) VALUES
  ('whatsapp', '573128686680'),
  ('whatsapp_url', 'https://wa.me/573128686680?text=Quiero%20m%C3%A1s%20info%20sobre%20Hotel%20Casa%20Costa%20%F0%9F%8F%9D%EF%B8%8F'),
  ('telefono', '+57 312 8686680'),
  ('instagram', '@hotelcasacosta_'),
  ('instagram_url', 'https://www.instagram.com/hotelcasacosta_/'),
  ('booking_url', 'https://www.booking.com/hotel/co/casa-costa.es.html'),
  ('direccion', 'Calle la Arrocera, 278017, Capurganá Colombia'),
  ('vuelo_url', 'https://moonflights.com.co/servicios/vuelos-ch%C3%A1rter/14'),
  ('bus_url', 'https://www.redbus.co/pasajes-de-bus/medellin-a-necocli-ant');

-- Planes y promociones (frames 199:383, 514:710, 514:836, 514:914, 514:1029).
-- Orden del carrusel en Figma: Plan 1 Conoce, Plan 2 Explora, Plan 3 Intrépida.
INSERT INTO planes (slug, nombre, categoria, descripcion, texto_ideal, duracion_dias,
                    precio_normal, precio_temporada_baja, imagen_url, orden) VALUES
  ('plan-conoce-capurgana', 'Plan Conoce Capurganá', 'plan',
   '3 días inolvidables en Capurganá con transporte ida y regreso desde Necoclí, desayunos y cenas en el hotel, y tours espectaculares como Playa La Miel en Panamá, Bahía Sapzurro y Cabo Tiburón.',
   'Ideal para quienes quieren una primera experiencia completa, cómoda y al mejor precio.',
   3, 600000, NULL, '/img/planes/plan-conoce-capurgana.webp', 1),
  ('plan-capurgana-intrepida', 'Plan Capurganá Intrépida', 'plan',
   '4 días inolvidables en Capurganá con transporte ida y regreso desde Necoclí, desayunos y cenas en el hotel, almuerzo de bienvenida y 3 tours espectaculares con 7 destinos increíbles como Playa Soledad, Bahía Aguacate y Reserva Natural El Cielo.',
   'Ideal para quienes aman la aventura, disfrutar el mar y todo al mejor precio, más aún con un descuento especial para la temporada baja:',
   4, 1100000, 980000, '/img/planes/plan-capurgana-intrepida.webp', 3),
  ('plan-explora-capurgana', 'Plan Explora Capurganá', 'plan',
   '4 días inolvidables en Capurganá con transporte ida y regreso desde Necoclí, desayunos y cenas en el hotel, y 2 tours espectaculares con 6 destinos increíbles como Cabo Tiburón, Bahía Aguacate y Piscina de coral.',
   'Ideal para quienes disfrutan conocer todo lo posible en sus viajes sin sacrificar el descanso y todo al mejor precio, más aún con un descuento especial para la temporada baja:',
   4, 850000, 750000, '/img/planes/plan-explora-capurgana.webp', 2),
  ('capurgana-a-tu-ritmo', 'Capurganá a tu Ritmo', 'promocion',
   'Disfruta 4 días con desayuno, wifi y aire acondicionado. Perfecto para quienes quieren descansar y explorar sin itinerarios.',
   NULL, 4, 210000, NULL, '/img/planes/capurgana-a-tu-ritmo.webp', 1),
  ('capurgana-express', 'Capurganá Express', 'promocion',
   'Escápate por 3 días con transporte desde Necoclí, desayuno y alojamiento con aire acondicionado. Ideal para una pausa rápida junto al mar.',
   NULL, 3, 320000, NULL, '/img/planes/capurgana-express.webp', 2);

-- Destinos (frame 14:39)
INSERT INTO destinos (slug, nombre, descripcion, destacado, imagen_url, orden) VALUES
  ('playa-la-miel', 'Playa La Miel en Panamá',
   'Cruza la frontera y descubre un rincón escondido de Panamá: Playa La Miel, una bahía de arena dorada y aguas cristalinas que te invita a relajarte bajo el sol y nadar en total tranquilidad. El recorrido incluye una caminata corta entre la selva y la frontera natural con Panamá, ideal para los amantes de la naturaleza y las postales inolvidables.',
   'Un imperdible en tu visita a Capurganá, perfecto para disfrutar de mar, paisaje y cultura en un solo lugar.',
   '/img/destinos/playa-la-miel.webp', 1),
  ('bahia-sapzurro', 'Bahía Sapzurro',
   'Un paraíso escondido entre montañas verdes y mar azul turquesa. Bahía Sapzurro es un lugar tranquilo, perfecto para nadar en aguas cristalinas, hacer snorkel o simplemente relajarte en su arena suave mientras disfrutas de la calma caribeña. El recorrido combina naturaleza, mar y cultura local, regalándote una experiencia que parece sacada de una postal.',
   'Un destino para quienes buscan paz, belleza natural y desconexión total.',
   '/img/destinos/bahia-sapzurro.webp', 2),
  ('cabo-tiburon', 'Cabo Tiburón',
   'En el extremo norte de Capurganá se encuentra Cabo Tiburón, un punto mágico donde el mar Caribe se mezcla con la selva tropical. Aquí podrás disfrutar de playas vírgenes, practicar snorkel entre arrecifes de coral y vivir la emoción de estar justo en la frontera natural con Panamá. Un lugar lleno de historia y biodiversidad que combina aventura, naturaleza y paisajes únicos.',
   'Perfecto para quienes buscan explorar y llevarse una experiencia inolvidable del Caribe.',
   '/img/destinos/cabo-tiburon.webp', 3);

-- Habitaciones (R-09; frames 454:895, 454:893, 454:894, 454:891, 454:892). Precio NULL (R-22).
INSERT INTO habitaciones (slug, nombre, tipo, area_m2, capacidad_max, camas_descripcion,
                          descripcion, precio, orden) VALUES
  ('habitacion-1', 'Habitación #1', 'Habitación familiar con baño privado', 18, 6,
   '5 camas individuales',
   'Habitación de 18m² con capacidad de hasta 6 personas. Incluye 5 camas individuales, baño privado con WC, papel higiénico y ducha. Tiene servicio de aire acondicionado, toallas y ventilador. Incluye desayuno continental.',
   NULL, 1),
  ('habitacion-2', 'Habitación #2', 'Habitación cuádruple con baño privado', 13, 4,
   '1 cama individual y 2 literas',
   'Habitación de 13m² con capacidad de hasta 4 personas. Incluye 1 cama individual y 2 literas, baño privado con WC, papel higiénico y ducha. Tiene servicio de aire acondicionado, toallas y ventilador. Incluye desayuno continental.',
   NULL, 2),
  ('habitacion-3', 'Habitación #3', 'Habitación triple con baño privado', 11, 3,
   '1 cama doble y 1 litera',
   'Habitación de 11m² con capacidad de hasta 3 personas. Incluye 1 cama doble y 1 litera, baño privado con WC, papel higiénico y ducha. Tiene servicio de aire acondicionado, toallas y ventilador. Incluye desayuno continental.',
   NULL, 3),
  ('habitacion-4', 'Habitación #4', 'Habitación doble con baño privado', 11, 3,
   '1 cama individual y 1 cama doble',
   'Habitación de 11m² con capacidad de hasta 3 personas. Incluye 1 cama individual y 1 cama doble, baño privado con WC, papel higiénico y ducha. Tiene servicio de aire acondicionado, toallas y ventilador. Incluye desayuno continental.',
   NULL, 4),
  ('apartamento', 'Apartamento', 'Habitación familiar con baño privado', 24, 8,
   '4 camas individuales y 2 camas dobles',
   'Habitación de 24m² con capacidad de hasta 8 personas. Incluye 4 camas individuales y 2 camas dobles, TV, baño privado con WC, papel higiénico y ducha. Tiene servicio de aire acondicionado, toallas y ventilador. Incluye desayuno continental.',
   NULL, 5);

-- 3 imágenes por habitación (clarificación 3)
INSERT INTO habitacion_imagenes (habitacion_id, url, alt, orden)
SELECT h.id, '/img/habitaciones/' || h.slug || '-' || n.i || '.webp',
       h.nombre || ' - foto ' || n.i, n.i
FROM habitaciones h
CROSS JOIN (SELECT 1 AS i UNION ALL SELECT 2 UNION ALL SELECT 3) n;

-- Reseñas (P-11; frames 454:1690, 304:137, 454:1678)
INSERT INTO resenas (autor, calificacion, titulo, texto, fecha, orden) VALUES
  ('Daniela', 5, 'EXCELENTE',
   'Mi experiencia en este alojamiento fue increíble. El wifi funciona muy bien, la atención del personal es super amable y el servicio en general excelente. Las camas son muy cómodas, el cuarto estaba impecablemente y la comida deliciosa. Además, los tours que ofrecen fueron espectaculares y cumplieron con todas mis expectativas. Definitivamente un lugar para recomendar.',
   '2025-10-10', 1),
  ('Gabriela', 5, 'INCREÍBLE',
   'La atención super, la habitación contaba con aire lo cual en las noches nos dejaba dormir muy tranquilos. Don Carlos y las chicas muy atentos con la limpieza, también nos ayudaron con indicaciones a lugares cercanos. Excelente servicio y también el desayuno muy completo',
   '2025-10-10', 2),
  ('Samuel', 5, 'PERFECTO',
   'El personal es súper servicial y siempre estuvieron atentos, tienen paquetes de tours muy buenos y la comida del restaurante estuvo deliciosa. Tienen planta para cuando se va la energía y el wifi siempre funcionó 😁',
   '2025-10-10', 3);

-- Calificaciones por plataforma (R-15)
INSERT INTO calificaciones_plataforma (plataforma, puntaje, escala_max) VALUES
  ('GOOGLE', 4.7, 5),
  ('BOOKING', 9.0, 10);

-- FAQs (P-10)
INSERT INTO faqs (pregunta, respuesta, orden) VALUES
  ('¿En Capurganá hay aeropuerto?',
   'Sí. Puedes llegar en vuelo directo desde el aeropuerto Olaya Herrera de Medellín, en aproximadamente 1,5 horas. Si prefieres, también puedes llegar por la ruta mixta: bus o vehículo propio hasta Necoclí y lancha hasta Capurganá.',
   1),
  ('¿Cuál es la diferencia entre planes y tours?',
   'Los planes son paquetes completos con precio que incluyen transporte, comida y tours. Los tours son los destinos turísticos que visitas durante tu estadía, como Playa La Miel, Bahía Sapzurro y Cabo Tiburón; no se reservan por separado.',
   2),
  ('¿Qué hay en Bahía Aguacate?',
   'Bahía Aguacate es uno de los destinos que visitas en los planes Capurganá Intrépida y Explora Capurganá. Escríbenos por WhatsApp y te contamos qué incluye cada recorrido.',
   3);
