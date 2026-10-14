import { Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ReservaModal } from './components/ReservaModal';
import { ScrollManager } from './components/ScrollManager';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ContactoProvider } from './hooks/useContacto';
import { ReservaProvider } from './hooks/useReserva';
import { ComoLlegar } from './pages/ComoLlegar';
import { Comodidades } from './pages/Comodidades';
import { Experiencias } from './pages/Experiencias';
import { Faqs } from './pages/Faqs';
import { Inicio } from './pages/Inicio';

export const App = () => (
  <ContactoProvider>
    <ReservaProvider>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/comodidades" element={<Comodidades />} />
          <Route path="/como-llegar" element={<ComoLlegar />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <ReservaModal />
    </ReservaProvider>
  </ContactoProvider>
);
