import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/useCart';
import { ShoppingBag, Sliders, Menu, X, ArrowUpRight } from 'lucide-react';
import { KntxLogo } from '../common/KntxLogo';
import { getWhatsAppUrl } from '../../config/brand';

/**
 * Navbar E-Commerce que aparece SOLO al scrollear hacia abajo.
 * En la parte superior (Hero), permanece oculta para dejar la pantalla 100% limpia.
 */
export const Navbar = () => {
  const { totalItems, openCart, openSizeModal } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 100;
          setIsScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#2A2A30] transition-all duration-400 ease-out ${
        isScrolled
          ? 'translate-y-0 opacity-100 pointer-events-auto shadow-2xl'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group py-1" aria-label="KNTX LAB - Inicio">
          <KntxLogo
            variant="lockup"
            className="h-6 sm:h-7 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span className="hidden lg:inline text-[9px] font-mono uppercase tracking-widest text-[#8E8E93] border-l border-[#2A2A30] pl-3 ml-1">
            Engineered for Concrete
          </span>
        </a>

        {/* Categories Navigation */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-7 font-mono text-xs uppercase tracking-wider">
          <a
            href="#catalog"
            className="text-[#8E8E93] hover:text-[#CCFF00] transition-colors font-semibold"
          >
            CATÁLOGO
          </a>
          <button
            onClick={() => openSizeModal()}
            className="text-[#8E8E93] hover:text-[#CCFF00] transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Sliders size={13} className="text-[#CCFF00]" />
            <span>CALCULADORA DE TALLE</span>
          </button>
          <a
            href={getWhatsAppUrl('Hola KNTX LAB, solicito asistencia inmediata.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8E8E93] hover:text-[#CCFF00] transition-colors flex items-center gap-1 font-semibold"
          >
            <span>WHATSAPP DIRECTO</span>
            <ArrowUpRight size={12} className="text-[#CCFF00]" />
          </a>
        </nav>

        {/* Right Actions: Cart & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label={`Ver carrito de compras, ${totalItems} prendas`}
            className="flex items-center gap-2.5 px-4 py-2 border border-[#CCFF00] bg-[#141417] text-[#F4F4F6] hover:bg-[#CCFF00] hover:text-[#0A0A0C] transition-all duration-200 font-mono text-xs font-bold cursor-pointer group shadow-[0_0_15px_-3px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_2px_rgba(204,255,0,0.6)]"
          >
            <ShoppingBag size={15} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-wider hidden xs:inline">CARRITO</span>
            <span className="px-1.5 py-0.5 text-[11px] bg-[#CCFF00] text-[#0A0A0C] font-black group-hover:bg-[#0A0A0C] group-hover:text-[#CCFF00] transition-colors">
              [{totalItems}]
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-[#8E8E93] hover:text-[#F4F4F6] cursor-pointer"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0C] border-b border-[#2A2A30] px-6 py-4 space-y-3 font-mono text-xs tracking-wider">
          <a
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#8E8E93] hover:text-[#CCFF00] border-b border-[#2A2A30]/50"
          >
            CATÁLOGO
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openSizeModal();
            }}
            className="w-full text-left py-2 text-[#8E8E93] hover:text-[#CCFF00] border-b border-[#2A2A30]/50 cursor-pointer flex items-center gap-2"
          >
            <Sliders size={13} className="text-[#CCFF00]" />
            <span>CALCULADORA DE TALLE</span>
          </button>
          <a
            href={getWhatsAppUrl('Hola KNTX LAB, solicito asistencia inmediata.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#CCFF00]"
          >
            WHATSAPP DIRECTO
          </a>
        </div>
      )}
    </header>
  );
};
