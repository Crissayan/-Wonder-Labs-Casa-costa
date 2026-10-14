import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Acordeon } from '../src/components/Acordeon';

const pintar = () =>
  render(
    <>
      <Acordeon pregunta="¿En Capurganá hay aeropuerto?" respuesta="Sí. Puedes llegar en vuelo directo." />
      <Acordeon pregunta="¿Qué hay en Bahía Aguacate?" respuesta="Uno de los destinos de los planes." />
    </>,
  );

describe('Acordeon (FR-051)', () => {
  it('inicia cerrado y alterna con clic', async () => {
    pintar();
    const boton = screen.getByRole('button', { name: '¿En Capurganá hay aeropuerto?' });
    expect(boton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Sí. Puedes llegar en vuelo directo.')).not.toBeVisible();
    await userEvent.click(boton);
    expect(boton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Sí. Puedes llegar en vuelo directo.')).toBeVisible();
    await userEvent.click(boton);
    expect(boton).toHaveAttribute('aria-expanded', 'false');
  });

  it('se opera con Enter y Espacio', async () => {
    pintar();
    const boton = screen.getByRole('button', { name: '¿Qué hay en Bahía Aguacate?' });
    boton.focus();
    await userEvent.keyboard('{Enter}');
    expect(boton).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    expect(boton).toHaveAttribute('aria-expanded', 'false');
  });

  it('permite varias preguntas abiertas a la vez (Q-14)', async () => {
    pintar();
    for (const boton of screen.getAllByRole('button')) await userEvent.click(boton);
    expect(screen.getAllByRole('button').every((b) => b.getAttribute('aria-expanded') === 'true')).toBe(true);
  });
});
