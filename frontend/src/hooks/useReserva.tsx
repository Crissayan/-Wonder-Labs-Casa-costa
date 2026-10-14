import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ReservaState = { abierta: boolean; abrirReserva: () => void; cerrarReserva: () => void };

const ReservaContext = createContext<ReservaState>({
  abierta: false,
  abrirReserva: () => {},
  cerrarReserva: () => {},
});

// Modal único de reserva que abren todos los CTA (R-02).
export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [abierta, setAbierta] = useState(false);
  const abrirReserva = useCallback(() => setAbierta(true), []);
  const cerrarReserva = useCallback(() => setAbierta(false), []);
  const value = useMemo(() => ({ abierta, abrirReserva, cerrarReserva }), [abierta, abrirReserva, cerrarReserva]);
  return <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>;
};

export const useReserva = () => useContext(ReservaContext);
