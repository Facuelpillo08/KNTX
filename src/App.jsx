import React from 'react';
import { CartProvider } from './context/CartContext';
import { useCart } from './context/useCart';
import { SmoothScrollProvider } from './components/animation/SmoothScrollProvider';
import { Preloader } from './components/animation/Preloader';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { CatalogGrid } from './components/catalog/CatalogGrid';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { SizeCalculatorModal } from './components/modals/SizeCalculatorModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { PolicyModal } from './components/modals/PolicyModal';
import { LegalConsent } from './components/common/LegalConsent';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const NotificationToast = () => {
  const { notification } = useCart();
  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-md animate-bounce-short">
      <div
        className={`p-3.5 border font-mono text-xs shadow-2xl backdrop-blur-md flex items-center gap-3 ${
          isError
            ? 'bg-[#141417]/95 border-[#FF3B00] text-[#FF3B00]'
            : 'bg-[#141417]/95 border-[#CCFF00] text-[#CCFF00]'
        }`}
      >
        {isError ? (
          <AlertCircle size={18} className="flex-shrink-0 animate-pulse" />
        ) : (
          <CheckCircle2 size={18} className="flex-shrink-0" />
        )}
        <div className="flex-1">
          <div className="font-bold tracking-wider">
            {isError ? '[ALERTA DEL SISTEMA]' : '[KNTX LAB]'}
          </div>
          <div className="text-[11px] text-[#F4F4F6] mt-0.5">
            {notification.message}
          </div>
        </div>
      </div>
    </div>
  );
};

function MainApp() {
  return (
    <SmoothScrollProvider>
      {/* Pantalla de carga estilo Awwwards con ráfaga cinemática y láser neón */}
      <Preloader />

      <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F6] flex flex-col font-sans selection:bg-[#CCFF00] selection:text-[#0A0A0C]">
        {/* Floating Capsule Navbar */}
        <Navbar />

        <main className="flex-1">
          {/* Parallax Full-Bleed Hero con entrada cinemática */}
          <HeroSection />

          {/* Clean, Espacioso Catálogo de Productos */}
          <CatalogGrid />
        </main>

        {/* Real E-Commerce Footer (Champion / Oakley 4-column architecture) */}
        <Footer />

        {/* Interactive Modals & Consents en orden jerárquico estricto de apilamiento */}
        <ProductDetailModal />
        <CartDrawer />
        <SizeCalculatorModal />
        <PolicyModal />
        <LegalConsent />
        <NotificationToast />
      </div>
    </SmoothScrollProvider>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
