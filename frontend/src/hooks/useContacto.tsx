import type { Contacto } from '@api/types';
import { createContext, useContext, type ReactNode } from 'react';
import { useApi } from './useApi';

const vacio: Contacto = {
  telefono: null,
  whatsappUrl: null,
  instagram: null,
  instagramUrl: null,
  bookingUrl: null,
  vueloUrl: null,
  busUrl: null,
  direccion: null,
};

type ContactoState = { contacto: Contacto; loaded: boolean };

const ContactoContext = createContext<ContactoState>({ contacto: vacio, loaded: false });

// Datos de contacto cargados una sola vez por visita y compartidos (FR-007, R-03).
export const ContactoProvider = ({ children }: { children: ReactNode }) => {
  const state = useApi<Contacto>('/contacto');
  const value: ContactoState =
    state.status === 'success'
      ? { contacto: state.data, loaded: true }
      : { contacto: vacio, loaded: state.status === 'error' };
  return <ContactoContext.Provider value={value}>{children}</ContactoContext.Provider>;
};

export const useContacto = () => useContext(ContactoContext);
