# Constitución del Proyecto — [WonderLabs] CasaCosta

> Documento rector del proyecto. Toda especificación (`spec.md`) y todo código deben respetar esta constitución. Si algo la contradice, prevalece este documento hasta que se actualice explícitamente.

---

## 1. Naturaleza del Proyecto

> ⚠️ **PENDIENTE** — Se completará a partir del análisis de los diseños de Figma (vista web y vista mobile).

- **Qué es:** _por definir_
- **Problema que resuelve:** _por definir_
- **Usuarios principales:** _por definir_
- **Flujos principales:** _por definir_
- **Plataformas:** Web responsive (vista desktop y vista mobile según Figma).
- **Fuera de alcance:** Todo lo que no esté documentado en `spec.md`.

---

## 2. Stack Tecnológico (Reglas de Implementación)

- **Frontend / UI:** React. Usar Tailwind CSS para los estilos.
- **Backend:** Node.js con Express.
- **Lenguaje:** TypeScript en todo el stack.

---

## 3. Reglas de Dominio y Lógica de Negocio (Reglas inmutables)

> ⚠️ **PENDIENTE** — Se derivarán de los diseños de Figma y se validarán con el equipo antes de fijarlas.

- _por definir_

---

## 4. Estructura y Estilo de Código

- **Estructura plana:** Evitar la sobreingeniería. No implementar "Clean Architecture" ni patrones complejos. Usar una estructura simple:

  ```
  /frontend
  /backend
  /db
  ```

- **Estilo:** Priorizar la programación funcional y los componentes funcionales (Hooks en React). Evitar el uso de clases a menos que sea obligatorio.
- **Nomenclatura:**
  - `camelCase` para funciones y variables.
  - `PascalCase` para Interfaces y Tipos.

---

## 5. Manejo de Errores y Validaciones

- **UI:** Nunca exponer errores crudos o stack traces al usuario final. Todo error técnico debe traducirse a un mensaje amigable.
- **Backend:** Retornar siempre códigos de estado HTTP semánticos.

---

## 6. Comportamiento del Agente de IA (Reglas SDD)

- **Cero Código Sombra (Shadow Code):** Construir estrictamente lo documentado en `spec.md`. No añadir características "por si acaso" (no pasarelas de pago, no perfiles complejos, etc.).
- **Fuente de la Verdad:** Si una instrucción del usuario contradice esta constitución o si se detecta una falla lógica, detenerse. Advertir del problema y solicitar actualizar el `spec.md` antes de tocar el código fuente.
