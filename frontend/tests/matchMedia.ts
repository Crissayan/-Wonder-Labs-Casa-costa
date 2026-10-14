import { vi } from 'vitest';

// Simula la vista de escritorio (true) o mobile (false) para useIsDesktop.
export const mockViewport = (desktop: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: desktop,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};
