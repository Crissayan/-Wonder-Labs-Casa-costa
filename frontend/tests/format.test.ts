import { describe, expect, it } from 'vitest';
import { formatDuracion, formatEstrellas, formatFecha, formatPrecio, formatPuntaje } from '../src/format';

describe('formatos de presentación', () => {
  it('formatea precios COP con punto de miles y sin espacio (FR-060)', () => {
    expect(formatPrecio(600000)).toBe('$600.000');
    expect(formatPrecio(1100000)).toBe('$1.100.000');
    expect(formatPrecio(980000)).toBe('$980.000');
  });

  it('formatea fechas sin desfase de zona horaria (FR-061, CB-14)', () => {
    expect(formatFecha('2025-10-10')).toBe('10/10/2025');
    expect(formatFecha('2025-01-01')).toBe('01/01/2025');
  });

  it('formatea puntajes con un decimal y punto (FR-062)', () => {
    expect(formatPuntaje(9)).toBe('9.0');
    expect(formatPuntaje(4.7)).toBe('4.7');
  });

  it('usa singular para una estrella (FR-063)', () => {
    expect(formatEstrellas(5)).toBe('5 ESTRELLAS');
    expect(formatEstrellas(1)).toBe('1 ESTRELLA');
  });

  it('calcula noches y días de un plan', () => {
    expect(formatDuracion(3)).toBe('2 Noches · 3 Días');
    expect(formatDuracion(4)).toBe('3 Noches · 4 Días');
  });
});
