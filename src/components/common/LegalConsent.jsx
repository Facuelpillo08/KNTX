import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/useCart';
import { ShieldCheck, Check, Settings2 } from 'lucide-react';

const STORAGE_KEY = 'kntx_legal_preferences_v1';

export const LegalConsent = () => {
  const { openPolicyModal } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [performanceEnabled, setPerformanceEnabled] = useState(true);

  useEffect(() => {
    let timer;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Show banner after brief delay for smooth entrance
        timer = setTimeout(() => setIsVisible(true), 1200);
      }
    } catch {
      timer = setTimeout(() => setIsVisible(true), 1200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Listen for footer "PREFERENCIAS DE PRIVACIDAD" button to reopen
  useEffect(() => {
    const handleReopen = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };
    window.addEventListener('kntx-open-privacy-preferences', handleReopen);
    return () => window.removeEventListener('kntx-open-privacy-preferences', handleReopen);
  }, []);

  const savePreferences = (preferences) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...preferences,
          necessary: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error('Error saving privacy preferences', e);
    }
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ analytics: true, performance: true });
  };

  const handleRejectOptional = () => {
    savePreferences({ analytics: false, performance: false });
  };

  const handleSaveCustom = () => {
    savePreferences({
      analytics: analyticsEnabled,
      performance: performanceEnabled,
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimiento de privacidad y cookies"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg z-[90] animate-fade-in"
    >
      <div className="bg-[#0E0E11]/95 backdrop-blur-md border border-[#2A2A30] shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-5 space-y-4 font-mono text-xs text-[#8E8E93]">
        {/* Accent Bar */}
        <div className="h-0.5 w-full bg-[#CCFF00] -mt-5 -mx-5 px-5 pt-0.5"></div>

        {/* Header */}
        <div className="flex items-center justify-between text-[#F4F4F6]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#CCFF00]" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              KNTX LAB // PRIVACIDAD & PROTOCOLOS
            </span>
          </div>
          <span className="text-[10px] text-[#CCFF00] font-bold">[GDPR / LEY 25.326]</span>
        </div>

        {/* Description */}
        <p className="text-[11px] leading-relaxed text-[#8E8E93] font-sans">
          Utilizamos almacenamiento esencial para el funcionamiento del carrito de compras y telemetría técnica anónima para optimizar la velocidad y renderizado de prendas en el LAB.
        </p>

        {/* Detailed Preferences Accordion */}
        {showPreferences && (
          <div className="space-y-3 pt-2 border-t border-[#2A2A30]/80 text-[11px]">
            {/* Essential */}
            <div className="flex items-center justify-between p-2.5 bg-[#141417] border border-[#2A2A30]">
              <div>
                <strong className="text-[#F4F4F6] block">ALMACENAMIENTO ESENCIAL</strong>
                <span className="text-[10px] text-[#8E8E93]">Requerido para el carrito de compras y talles.</span>
              </div>
              <span className="text-[10px] text-[#CCFF00] font-bold border border-[#CCFF00]/40 px-2 py-0.5">
                OBLIGATORIO
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-2.5 bg-[#141417] border border-[#2A2A30]">
              <div>
                <strong className="text-[#F4F4F6] block">TELEMETRÍA DE RENDIMIENTO</strong>
                <span className="text-[10px] text-[#8E8E93]">Métricas de latencia y Core Web Vitals.</span>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsEnabled((prev) => !prev)}
                className={`w-10 h-5 border transition-colors flex items-center p-0.5 cursor-pointer ${
                  analyticsEnabled ? 'border-[#CCFF00] bg-[#CCFF00]/20 justify-end' : 'border-[#2A2A30] bg-[#0A0A0C] justify-start'
                }`}
              >
                <span className={`w-3.5 h-3.5 ${analyticsEnabled ? 'bg-[#CCFF00]' : 'bg-[#8E8E93]'}`}></span>
              </button>
            </div>

            {/* Performance */}
            <div className="flex items-center justify-between p-2.5 bg-[#141417] border border-[#2A2A30]">
              <div>
                <strong className="text-[#F4F4F6] block">EXPERIENCIA VISUAL & CACHE</strong>
                <span className="text-[10px] text-[#8E8E93]">Optimización local de texturas e imágenes.</span>
              </div>
              <button
                type="button"
                onClick={() => setPerformanceEnabled((prev) => !prev)}
                className={`w-10 h-5 border transition-colors flex items-center p-0.5 cursor-pointer ${
                  performanceEnabled ? 'border-[#CCFF00] bg-[#CCFF00]/20 justify-end' : 'border-[#2A2A30] bg-[#0A0A0C] justify-start'
                }`}
              >
                <span className={`w-3.5 h-3.5 ${performanceEnabled ? 'bg-[#CCFF00]' : 'bg-[#8E8E93]'}`}></span>
              </button>
            </div>
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-mono text-xs">
          {showPreferences ? (
            <button
              onClick={handleSaveCustom}
              className="flex-1 py-2 px-3 bg-[#CCFF00] text-[#0A0A0C] font-bold text-center hover:bg-white transition-colors cursor-pointer"
            >
              GUARDAR CONFIGURACIÓN
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 bg-[#CCFF00] text-[#0A0A0C] font-bold text-center hover:bg-white transition-colors cursor-pointer"
              >
                ACEPTAR TODAS
              </button>
              <button
                onClick={handleRejectOptional}
                className="py-2 px-3 bg-[#141417] border border-[#2A2A30] text-[#F4F4F6] hover:border-[#CCFF00] text-center transition-colors cursor-pointer"
              >
                SOLO ESENCIALES
              </button>
            </>
          )}

          <button
            onClick={() => setShowPreferences((prev) => !prev)}
            aria-label="Configurar preferencias de privacidad"
            className="py-2 px-2.5 bg-[#141417] border border-[#2A2A30] hover:text-[#CCFF00] transition-colors flex items-center justify-center cursor-pointer"
            title="Ajustar preferencias"
          >
            {showPreferences ? <Check size={14} /> : <Settings2 size={14} />}
          </button>
        </div>

        {/* Footer Link to Privacy Policy */}
        <div className="text-[10px] text-[#8E8E93] text-center pt-1 border-t border-[#2A2A30]/50">
          <button
            onClick={() => openPolicyModal('privacy')}
            className="text-[#8E8E93] hover:text-[#CCFF00] underline transition-colors cursor-pointer"
          >
            Consultar Declaración de Privacidad y Almacenamiento de KNTX LAB
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LegalConsent;

