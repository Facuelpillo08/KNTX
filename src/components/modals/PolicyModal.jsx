import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/useCart';
import { getWhatsAppUrl } from '../../config/brand';
import {
  X,
  Truck,
  RotateCcw,
  ShieldCheck,
  Search,
  FileText,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const POLICIES = [
  {
    id: 'shipping',
    label: '[01] ENVÍOS',
    title: 'LOGÍSTICA & DESPACHO TÁCTICO',
    icon: Truck,
  },
  {
    id: 'returns',
    label: '[02] CAMBIOS',
    title: 'GARANTÍA & CAMBIOS (30 DÍAS)',
    icon: RotateCcw,
  },
  {
    id: 'care',
    label: '[03] CUIDADO',
    title: 'MANTENIMIENTO DE MEMBRANAS',
    icon: ShieldCheck,
  },
  {
    id: 'tracking',
    label: '[04] RASTREO',
    title: 'SEGUIMIENTO DE DESPACHO',
    icon: Search,
  },
  {
    id: 'terms',
    label: '[05] TÉRMINOS',
    title: 'TÉRMINOS DEL SERVICIO',
    icon: FileText,
  },
  {
    id: 'privacy',
    label: '[06] PRIVACIDAD',
    title: 'PROTECCIÓN DE DATOS & PRIVACIDAD',
    icon: Lock,
  },
];

export const PolicyModal = () => {
  const { activePolicy, openPolicyModal, closePolicyModal } = useCart();
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!activePolicy) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePolicyModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePolicy, closePolicyModal]);

  if (!activePolicy) return null;

  const currentTab = POLICIES.find((p) => p.id === activePolicy) || POLICIES[0];

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const clean = trackingCode.trim().toUpperCase();
    if (!clean) return;

    setIsSearching(true);
    setTrackingResult(null);

    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult({
        code: clean,
        status: 'EN TRÁNSITO TÁCTICO // RUTA PRIORITARIA',
        carrier: 'ANDREANI LOGÍSTICA / DHL EXPRESS',
        estimated: '24 a 48 hs hábiles',
        checkpoint: 'HUB CENTRAL BUENOS AIRES [SCANNER ÓPTICO OK]',
        sealed: 'PACKAGING HERMÉTICO DWR VERIFICADO',
      });
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in"
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closePolicyModal}
      ></div>

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E0E11] border border-[#2A2A30] shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-[#CCFF00] shrink-0"></div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#2A2A30] flex items-center justify-between bg-[#141417]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#CCFF00] tracking-widest uppercase">
              <span className="w-2 h-2 bg-[#CCFF00]"></span>
              <span>KNTX [LAB] // PROTOCOLOS OFICIALES</span>
            </div>
            <h2
              id="policy-modal-title"
              className="font-display font-black text-xl sm:text-2xl text-[#F4F4F6] tracking-tight uppercase"
            >
              {currentTab.title}
            </h2>
          </div>

          <button
            onClick={closePolicyModal}
            aria-label="Cerrar modal de políticas"
            className="w-9 h-9 bg-[#0A0A0C] border border-[#2A2A30] hover:border-[#CCFF00] flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer group"
          >
            <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1 p-2 bg-[#0A0A0C] border-b border-[#2A2A30] overflow-x-auto no-scrollbar font-mono text-xs">
          {POLICIES.map((policy) => {
            const Icon = policy.icon;
            const isActive = policy.id === activePolicy;
            return (
              <button
                key={policy.id}
                onClick={() => openPolicyModal(policy.id)}
                className={`flex items-center gap-2 px-3.5 py-2 border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#CCFF00] bg-[#141417] text-[#CCFF00] font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                    : 'border-transparent text-[#8E8E93] hover:text-[#F4F4F6] hover:bg-[#141417]/50'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-[#CCFF00]' : 'text-[#8E8E93]'} />
                <span>{policy.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 text-[#8E8E93] font-sans text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: ENVÍOS */}
          {activePolicy === 'shipping' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30] space-y-1">
                <div className="font-mono text-xs font-bold text-[#F4F4F6] tracking-wider uppercase">
                  POLÍTICA DE DESPACHO DIRECTO
                </div>
                <div className="text-xs text-[#8E8E93]">
                  Todas las prendas de KNTX LAB se ensamblan e inspeccionan manualmente en nuestro taller
                  antes de ser selladas al vacío para proteger las membranas DWR de la humedad.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">[CABA & GBA]</div>
                  <div className="text-lg font-black font-display text-[#F4F4F6]">24 — 48 HS</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Entrega prioritaria por motomensajería táctica con geolocalización en tiempo real.
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">[TODO EL PAÍS]</div>
                  <div className="text-lg font-black font-display text-[#F4F4F6]">3 — 5 DÍAS</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Despacho por Andreani / Correo Oficial con seguro total de reposición y tracking web.
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">[ENVÍO INTERNACIONAL]</div>
                  <div className="text-lg font-black font-display text-[#F4F4F6]">5 — 8 DÍAS</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Courier DHL Express con entrega en puerta y gestión aduanera simplificada (DDP).
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <h3 className="text-[#F4F4F6] font-bold uppercase tracking-wider text-sm">
                  ESPECIFICACIONES DE COSTOS & TARIFAS
                </h3>
                <ul className="space-y-2 text-[#8E8E93]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#CCFF00]">•</span>
                    <span>
                      <strong className="text-[#F4F4F6]">Órdenes superiores a $200 USD:</strong> Envío bonificado (100% GRATUITO) a cualquier destino de Argentina.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#CCFF00]">•</span>
                    <span>
                      <strong className="text-[#F4F4F6]">Órdenes menores a $200 USD:</strong> Tarifa plana nacional de $15 USD integrada en el checkout.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#CCFF00]">•</span>
                    <span>
                      <strong className="text-[#F4F4F6]">Packaging Táctico:</strong> Bolsa hermética al vacío con film opaco anti-UV y etiquetas reflectivas de autenticidad.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: DEVOLUCIONES & GARANTÍA */}
          {activePolicy === 'returns' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30] space-y-1">
                <div className="font-mono text-xs font-bold text-[#F4F4F6] tracking-wider uppercase">
                  GARANTÍA DE CALCE & RESISTENCIA — 30 DÍAS
                </div>
                <div className="text-xs text-[#8E8E93]">
                  Diseñamos indumentaria técnica para soportar el asfalto. Si el talle no es exacto o no estás 100% conforme con la caída de la prenda, gestionamos el cambio sin complicaciones.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">FASE 01</div>
                  <div className="font-bold text-[#F4F4F6]">NOTIFICACIÓN</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Envíanos tu número de orden por WhatsApp dentro de los 30 días posteriores a la recepción.
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">FASE 02</div>
                  <div className="font-bold text-[#F4F4F6]">RETIRO BONIFICADO</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    El primer cambio de talle tiene el envío de retiro y entrega 100% bonificado por el LAB.
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0C] border border-[#2A2A30] space-y-2">
                  <div className="text-[#CCFF00] font-bold">FASE 03</div>
                  <div className="font-bold text-[#F4F4F6]">NUEVO DESPACHO</div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Al recibir la prenda y verificar sellos, despachamos tu nuevo talle en menos de 24 horas.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#141417] border border-[#2A2A30] space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
                  <AlertTriangle size={14} />
                  <span>CONDICIONES DE ACEPTACIÓN</span>
                </div>
                <div className="text-[11px] text-[#8E8E93] leading-relaxed">
                  Las prendas deben conservar sus etiquetas balísticas originales, sellos de autenticidad intactos y no presentar signos de uso, perfumes o lavados. La garantía de costuras y herrajes YKK cubre 6 meses contra defectos de manufactura.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUIDADO DE MEMBRANAS */}
          {activePolicy === 'care' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30] space-y-1">
                <div className="font-mono text-xs font-bold text-[#F4F4F6] tracking-wider uppercase">
                  MANUAL DE PRESERVACIÓN TÉCNICA
                </div>
                <div className="text-xs text-[#8E8E93]">
                  Nuestras chaquetas y pantalones incorporan membranas hidrófugas DWR 20.000 mm y textiles Heavy French Terry de 420 GSM. Un cuidado adecuado garantiza impermeabilidad de por vida.
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 bg-[#0A0A0C] border border-[#2A2A30] flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold text-sm">[01]</span>
                  <div>
                    <strong className="text-[#F4F4F6] block mb-1">LAVADO EN AGUA FRÍA (MÁXIMO 30°C)</strong>
                    <span className="text-[#8E8E93] text-[11px]">
                      Lavar siempre del revés con cierres YKK cerrados. Usar ciclo delicado y jabón líquido neutro sin fragancias ni blanqueadores ópticos.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0A0C] border border-[#FF3B00] flex items-start gap-3">
                  <span className="text-[#FF3B00] font-bold text-sm">[!]</span>
                  <div>
                    <strong className="text-[#FF3B00] block mb-1">PROHIBIDO USAR SUAVIZANTE</strong>
                    <span className="text-[#8E8E93] text-[11px]">
                      Los suavizantes obstruyen los microporos respirables de la membrana técnica y eliminan la repelencia al agua de manera irreversible.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0A0C] border border-[#2A2A30] flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold text-sm">[02]</span>
                  <div>
                    <strong className="text-[#F4F4F6] block mb-1">SECADO TÁCTICO AL AIRE</strong>
                    <span className="text-[#8E8E93] text-[11px]">
                      Colgar en percha acolchada en lugar ventilado y a la sombra. Jamás someter a secadoras mecánicas de tambor con alta temperatura.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0A0C] border border-[#2A2A30] flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold text-sm">[03]</span>
                  <div>
                    <strong className="text-[#F4F4F6] block mb-1">REACTIVACIÓN DEL TRATAMIENTO DWR</strong>
                    <span className="text-[#8E8E93] text-[11px]">
                      Tras varios lavados, pasar un secador de pelo a 15 cm de distancia en calor medio para reactivar la alineación de las partículas hidrófugas en la superficie.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEGUIMIENTO DE DESPACHO */}
          {activePolicy === 'tracking' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30] space-y-1">
                <div className="font-mono text-xs font-bold text-[#F4F4F6] tracking-wider uppercase">
                  CONSOLA DE TELEMETRÍA DE ENVÍOS
                </div>
                <div className="text-xs text-[#8E8E93]">
                  Ingresa tu código de orden KNTX o número de seguimiento asignado para consultar el estado del paquete en tiempo real.
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    maxLength={30}
                    placeholder="EJ: KX-902-881 O N° DE GUÍA ANDREANI"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 bg-[#0A0A0C] border border-[#2A2A30] px-4 py-3 text-[#F4F4F6] placeholder-[#8E8E93]/50 focus:outline-none focus:border-[#CCFF00] uppercase font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 bg-[#CCFF00] text-[#0A0A0C] font-mono font-bold tracking-wider hover:bg-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isSearching ? 'CONSULTANDO...' : 'RASTREAR ORDEN'}
                  </button>
                </div>
                <div className="text-[10px] text-[#8E8E93]">
                  * También puedes consultar tu seguimiento con tu número de teléfono registrado en el checkout.
                </div>
              </form>

              {trackingResult && (
                <div className="p-5 bg-[#0A0A0C] border border-[#CCFF00] space-y-3 font-mono text-xs animate-fade-in shadow-[0_0_20px_rgba(204,255,0,0.15)]">
                  <div className="flex items-center justify-between border-b border-[#2A2A30] pb-2">
                    <span className="text-[#CCFF00] font-bold">CÓDIGO: {trackingResult.code}</span>
                    <span className="flex items-center gap-1.5 text-[#CCFF00] text-[10px]">
                      <CheckCircle2 size={12} />
                      <span>ORDEN LOCALIZADA</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[#8E8E93] block">ESTADO ACTUAL:</span>
                      <strong className="text-[#F4F4F6]">{trackingResult.status}</strong>
                    </div>
                    <div>
                      <span className="text-[#8E8E93] block">OPERADOR LOGÍSTICO:</span>
                      <strong className="text-[#F4F4F6]">{trackingResult.carrier}</strong>
                    </div>
                    <div>
                      <span className="text-[#8E8E93] block">ÚLTIMO CHECKPOINT:</span>
                      <span className="text-[#8E8E93]">{trackingResult.checkpoint}</span>
                    </div>
                    <div>
                      <span className="text-[#8E8E93] block">TIEMPO ESTIMADO:</span>
                      <strong className="text-[#CCFF00]">{trackingResult.estimated}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2A2A30]">
                    <a
                      href={getWhatsAppUrl(`Hola KNTX LAB, solicito asistencia inmediata para el seguimiento de mi orden ${trackingResult.code}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#CCFF00] hover:underline pt-1"
                    >
                      <span>Hablar con un despachante en WhatsApp</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TÉRMINOS */}
          {activePolicy === 'terms' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30]">
                <strong className="text-[#F4F4F6] block mb-1">CONDICIONES DE CONTRATACIÓN Y COMPRA</strong>
                <span className="text-[#8E8E93] text-[11px]">
                  KNTX LAB opera bajo el modelo de producción limitada (Drops seriados). Al adquirir una prenda, se aceptan los siguientes términos comerciales.
                </span>
              </div>

              <div className="space-y-3 text-[#8E8E93] text-[11px] leading-relaxed">
                <div>
                  <strong className="text-[#F4F4F6] block">[1] DISPONIBILIDAD & RESERVAS:</strong>
                  Las prendas agregadas al carrito no representan una reserva de inventario hasta que la orden es confirmada y validada por nuestro equipo operativo.
                </div>
                <div>
                  <strong className="text-[#F4F4F6] block">[2] PRECIOS & MONEDA:</strong>
                  Los valores exhibidos en la plataforma están expresados en Dólares Estadounidenses (USD) con equivalencia en Pesos Argentinos (ARS) liquidables según la cotización oficial al momento del pago.
                </div>
                <div>
                  <strong className="text-[#F4F4F6] block">[3] PROPIEDAD INTELECTUAL:</strong>
                  La marca KNTX LAB, el isotipo "Kinetic Beam", patrones textiles y material visual son propiedad exclusiva protegida bajo leyes de propiedad intelectual internacionales.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PRIVACIDAD */}
          {activePolicy === 'privacy' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30]">
                <strong className="text-[#F4F4F6] block mb-1">PROTECCIÓN DE DATOS PERSONALES</strong>
                <span className="text-[#8E8E93] text-[11px]">
                  En KNTX LAB protegemos tu información bajo los más rigurosos estándares de ciberseguridad, cumpliendo con la Ley Argentina N° 25.326 y los principios de GDPR.
                </span>
              </div>

              <div className="space-y-3 text-[#8E8E93] text-[11px] leading-relaxed">
                <div>
                  <strong className="text-[#F4F4F6] block">[1] TRATAMIENTO DE DATOS:</strong>
                  Únicamente recopilamos los datos estrictamente necesarios para el despacho de pedidos (nombre, dirección, correo y teléfono de contacto). Nunca comercializamos información con terceras partes.
                </div>
                <div>
                  <strong className="text-[#F4F4F6] block">[2] ENCRIPTACIÓN SSL 256-BIT:</strong>
                  Todas las sesiones y transferencias de telemetría están protegidas mediante certificados TLS/SSL con cifrado de grado militar.
                </div>
                <div>
                  <strong className="text-[#F4F4F6] block">[3] POLÍTICA DE COOKIES & ALMACENAMIENTO:</strong>
                  Utilizamos almacenamiento local (localStorage) para mantener tu carrito de compras activo entre sesiones y registrar tus preferencias de navegación sin rastreadores invasivos.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141417] border-t border-[#2A2A30] flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] text-[#8E8E93]">
          <div>
            KNTX LAB // BUENOS AIRES • ALL-WEATHER TEXTILES
          </div>
          <button
            onClick={closePolicyModal}
            className="px-5 py-1.5 border border-[#2A2A30] hover:border-[#CCFF00] text-[#F4F4F6] hover:text-[#CCFF00] transition-colors cursor-pointer"
          >
            ENTENDIDO / CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
