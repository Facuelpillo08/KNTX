import React, { useState } from 'react';
import { ArrowUpRight, MessageSquare, CreditCard, Send, Lock } from 'lucide-react';
import { KntxLogo } from '../common/KntxLogo';
import { useCart } from '../../context/useCart';
import { getWhatsAppUrl } from '../../config/brand';

export const Footer = () => {
  const { openPolicyModal, openSizeModal } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Por favor ingresa un correo.');
      return;
    }
    if (cleanEmail.length > 100 || !EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Formato de correo no válido.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3500);
    setEmail('');
  };

  return (
    <footer id="footer" className="w-full bg-[#0A0A0C] border-t border-[#2A2A30] relative overflow-hidden">
      {/* Top Accent Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Semantic H2 for Search Engine Outline */}
        <h2 className="sr-only">Información Corporativa, Atención al Cliente y Políticas KNTX LAB</h2>

        {/* Real E-Commerce 4-Column Layout (Estilo Champion / Oakley) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#2A2A30]">
          {/* Col 1: Colecciones y Categorías */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#CCFF00] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#CCFF00]"></span>
              COLECCIONES & PRODUCTOS
            </h3>
            <ul className="space-y-2.5 font-mono text-xs text-[#8E8E93]">
              <li>
                <a href="#catalog" className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5">
                  <span className="text-[#CCFF00] text-[10px]">›</span>
                  Chaquetas Rompevientos (DWR 20K)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5">
                  <span className="text-[#CCFF00] text-[10px]">›</span>
                  Buzos Heavy French Terry (420 GSM)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5">
                  <span className="text-[#CCFF00] text-[10px]">›</span>
                  Pantalones Cargo Tácticos
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5">
                  <span className="text-[#CCFF00] text-[10px]">›</span>
                  Rigs Modulares & Chest Bags
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5">
                  <span className="text-[#CCFF00] text-[10px]">›</span>
                  Archivo de Drops Anteriores
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Atención al Cliente y Políticas */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F4F4F6] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8E8E93]"></span>
              ATENCIÓN AL CLIENTE
            </h3>
            <ul className="space-y-2.5 font-mono text-xs text-[#8E8E93]">
              <li>
                <button
                  onClick={() => openSizeModal()}
                  className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="text-[#8E8E93] text-[10px]">›</span>
                  Calculadora y Guía de Talles
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('shipping')}
                  className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="text-[#8E8E93] text-[10px]">›</span>
                  Envíos a Todo el País
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('returns')}
                  className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="text-[#8E8E93] text-[10px]">›</span>
                  Cambios y Devoluciones (30 días)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('care')}
                  className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="text-[#8E8E93] text-[10px]">›</span>
                  Cuidado de Membranas Técnicas
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('tracking')}
                  className="hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="text-[#8E8E93] text-[10px]">›</span>
                  Seguimiento de Despacho
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Métodos de Pago y Seguridad */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F4F4F6] uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={14} className="text-[#CCFF00]" />
              MÉTODOS DE PAGO
            </h3>
            <div className="space-y-2 font-mono text-xs text-[#8E8E93]">
              <div className="p-2.5 bg-[#141417] border border-[#2A2A30] space-y-1">
                <div className="text-[11px] text-[#F4F4F6] font-bold">MERCADO PAGO / TARJETAS</div>
                <div className="text-[10px] text-[#8E8E93]">Hasta 3 cuotas sin interés en compras seleccionadas</div>
              </div>

              <div className="p-2.5 bg-[#141417] border border-[#2A2A30] space-y-1">
                <div className="text-[11px] text-[#CCFF00] font-bold">TRANSFERENCIA DIRECTA</div>
                <div className="text-[10px] text-[#8E8E93]">10% OFF adicional abonando por transferencia</div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px] text-[#8E8E93]">
                <Lock size={12} className="text-[#CCFF00]" />
                <span>PAGOS 100% ENCRIPTADOS CON SSL 256-BIT</span>
              </div>
            </div>
          </div>

          {/* Col 4: Despacho Directo & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#FF3B00] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} className="text-[#FF3B00]" />
              DESPACHO & CONTACTO
            </h3>
            
            <a
              href={getWhatsAppUrl('Hola KNTX LAB, solicito asistencia inmediata para una orden.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#141417] border border-[#2A2A30] hover:border-[#CCFF00] text-[#F4F4F6] hover:text-[#CCFF00] font-mono text-xs font-bold transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>ATENCIÓN POR WHATSAPP</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-[#8E8E93] block">
                ALERTAS DE RE-STOCK & PRÓXIMOS DROPS:
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center">
                <input
                  type="email"
                  required
                  maxLength={100}
                  autoComplete="email"
                  placeholder="TU EMAIL"
                  aria-label="Tu correo electrónico"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="flex-1 bg-[#141417] border border-[#2A2A30] border-r-0 px-3 py-2 text-xs font-mono text-[#F4F4F6] placeholder-[#8E8E93]/50 focus:outline-none focus:border-[#CCFF00]"
                />
                <button
                  type="submit"
                  aria-label="Suscribirme a alertas de re-stock"
                  className="px-3.5 py-2 bg-[#CCFF00] text-[#0A0A0C] font-mono font-bold text-xs hover:bg-white transition-colors cursor-pointer"
                  title="Suscribirme"
                >
                  <Send size={13} />
                </button>
              </form>
              {errorMsg && (
                <div className="text-[10px] font-mono text-[#FF3B00] pt-1">
                  ⚠ {errorMsg}
                </div>
              )}
              {subscribed && (
                <div className="text-[10px] font-mono text-[#CCFF00] pt-1">
                  ✓ REGISTRO CONFIRMADO PARA LA PRÓXIMA COLECCIÓN.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Bottom Section */}
        <div className="pt-10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-[#2A2A30]">
          <div className="space-y-2">
            <KntxLogo variant="lockup" className="h-8 sm:h-10 w-auto" />
            <div className="text-[10px] font-mono text-[#8E8E93] tracking-widest uppercase">
              HIGH DENSITY TEXTILES // INDUSTRIAL PERFORMANCE
            </div>
          </div>
          <div className="font-mono text-xs text-[#8E8E93] text-left sm:text-right">
            <span className="text-[#CCFF00] font-bold">[TIENDA EN LÍNEA]</span>
            <div className="text-[10px] text-[#8E8E93] mt-0.5">BUENOS AIRES • ENVÍOS GLOBALES</div>
          </div>
        </div>

        {/* Legal & Status Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] text-[#8E8E93]">
          <div>
            © 2026 KNTX LAB. TODOS LOS DERECHOS RESERVADOS.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <button
              onClick={() => openPolicyModal('terms')}
              className="hover:text-[#F4F4F6] transition-colors cursor-pointer"
            >
              Términos del Servicio
            </button>
            <span>•</span>
            <button
              onClick={() => openPolicyModal('privacy')}
              className="hover:text-[#F4F4F6] transition-colors cursor-pointer"
            >
              Privacidad
            </button>
            <span>•</span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('kntx-open-privacy-preferences'))}
              className="hover:text-[#CCFF00] transition-colors cursor-pointer"
            >
              Preferencias de Privacidad
            </button>
            <span>•</span>
            <span className="text-[#CCFF00] font-bold">ARS / USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
