import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { id: 'ALL', label: 'TODAS LAS PRENDAS' },
  { id: 'JACKETS', label: 'CHAQUETAS' },
  { id: 'HOODIES', label: 'BUZOS' },
  { id: 'PANTS', label: 'PANTALONES' },
];

/**
 * CatalogGrid
 * - Formato: Slider horizontal interactivo con navegación lateral.
 * - Compuerta Mecánica / Shutter Airlock en policarbonato translúcido oscuro.
 * - Al scrollear, los dos paneles (superior e inferior) se abren verticalmente desde el centro
 *   revelando el catálogo completo.
 */
export const CatalogGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const catalogRef = useRef(null);
  const contentRef = useRef(null);
  const topPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const topSeamRef = useRef(null);
  const bottomSeamRef = useRef(null);
  const lockBadgeRef = useRef(null);
  const sliderRef = useRef(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Deep linking & URL hash synchronization for SEO indexing (#jackets, #hoodies, #pants, #catalog)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'jackets') setSelectedCategory('JACKETS');
      else if (hash === 'hoodies') setSelectedCategory('HOODIES');
      else if (hash === 'pants') setSelectedCategory('PANTS');
      else if (hash === 'catalog') setSelectedCategory('ALL');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Check scroll position to enable/disable arrow buttons efficiently
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const newCanLeft = scrollLeft > 10;
            const newCanRight = scrollLeft < scrollWidth - clientWidth - 10;
            setCanScrollLeft((prev) => (prev !== newCanLeft ? newCanLeft : prev));
            setCanScrollRight((prev) => (prev !== newCanRight ? newCanRight : prev));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [filteredProducts]);

  // Animación de la Compuerta Mecánica / Shutter Airlock reactiva al scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: catalogRef.current,
          start: 'top top',
          end: '+=80%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // 1. Desacople y disolución del sello central de descompresión
      tl.to(
        lockBadgeRef.current,
        {
          scale: 1.15,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.2,
          ease: 'power2.in',
        },
        0
      );

      // 2. Apertura vertical de las compuertas de policarbonato translúcido
      tl.to(
        topPanelRef.current,
        {
          yPercent: -102,
          ease: 'power2.inOut',
          duration: 0.8,
        },
        0.1
      );

      tl.to(
        bottomPanelRef.current,
        {
          yPercent: 102,
          ease: 'power2.inOut',
          duration: 0.8,
        },
        0.1
      );

      // 3. Destello de las líneas neón al abrirse
      tl.to(
        [topSeamRef.current, bottomSeamRef.current],
        {
          opacity: 0.3,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0.1
      );

      // 4. Cristalización y enfoque nítido del contenido del catálogo
      tl.fromTo(
        contentRef.current,
        {
          scale: 0.97,
          filter: 'blur(4px)',
          opacity: 0.7,
        },
        {
          scale: 1.0,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.1
      );
    }, catalogRef);

    return () => ctx.revert();
  }, []);

  const slide = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = Math.max(320, Math.round(window.innerWidth * 0.32));
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="catalog"
      className="w-full bg-[#0A0A0C] border-b border-[#2A2A30] relative overflow-hidden z-20 min-h-screen"
    >
      <div
        ref={catalogRef}
        className="w-full py-16 lg:py-24 relative overflow-hidden min-h-screen"
      >
      {/* =========================================================================
          COMPUERTA MECÁNICA / SHUTTER AIRLOCK (POLICARBONATO TRANSLÚCIDO OSCURO)
          ========================================================================= */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-30 overflow-hidden">
        {/* Panel Superior de Policarbonato */}
        <div
          ref={topPanelRef}
          className="absolute top-0 left-0 w-full h-[50vh] bg-[#0A0A0C]/85 backdrop-blur-xl border-b border-[#2A2A30] flex flex-col justify-between will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
        >
          {/* Micro-marcas técnicas en panel superior */}
          <div className="flex items-center justify-between px-6 sm:px-12 pt-6">
            <div className="flex items-center gap-3 font-mono text-[9px] text-[#8E8E93]/70 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 border border-[#CCFF00]/80 bg-[#CCFF00]/20"></span>
              <span>KNTX LAB // HYDRAULIC SHUTTER [SEC_ALPHA]</span>
            </div>
            <div className="hidden sm:block font-mono text-[9px] text-[#8E8E93]/60 tracking-wider">
              PRESSURE: 101.3 kPa • HYDROPHOBIC 420D
            </div>
          </div>

          {/* Borde inferior del panel superior con junta neón */}
          <div
            ref={topSeamRef}
            className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent shadow-[0_0_15px_2px_rgba(204,255,0,0.7)]"
          ></div>
        </div>

        {/* Panel Inferior de Policarbonato */}
        <div
          ref={bottomPanelRef}
          className="absolute top-[50vh] left-0 w-full h-[50vh] bg-[#0A0A0C]/85 backdrop-blur-xl border-t border-[#2A2A30] flex flex-col justify-between will-change-transform shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
        >
          {/* Borde superior del panel inferior con junta neón */}
          <div
            ref={bottomSeamRef}
            className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent shadow-[0_0_15px_2px_rgba(204,255,0,0.7)]"
          ></div>

          {/* Micro-marcas técnicas en panel inferior */}
          <div className="flex items-center justify-between px-6 sm:px-12 pb-6">
            <div className="flex items-center gap-3 font-mono text-[9px] text-[#8E8E93]/70 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 border border-[#CCFF00]/80 bg-[#CCFF00]/20"></span>
              <span>RESTRICTED ARCHIVE ACCESS // SYS_ARMORED</span>
            </div>
            <div className="hidden sm:block font-mono text-[9px] text-[#8E8E93]/60 tracking-wider">
              LOCK_ID: #004-BLAST-DOOR • AIRLOCK ACTIVE
            </div>
          </div>
        </div>

        {/* Sello Central de Descompresión / Latch Central */}
        <div
          ref={lockBadgeRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center gap-3 px-5 py-2.5 bg-[#0A0A0C]/95 border border-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.4)] backdrop-blur-md will-change-transform"
        >
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black text-[#CCFF00] tracking-widest uppercase">
                [AIRLOCK SYS // 004]
              </span>
              <span className="px-1.5 py-0.2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 font-mono text-[8px] text-[#CCFF00]">
                LOCKED
              </span>
            </div>
            <span className="font-mono text-[8px] text-[#8E8E93] tracking-wider uppercase mt-0.5">
              DESCOMPRESIÓN HIDRÁULICA • DESPLIEGUE ACTIVO
            </span>
          </div>
        </div>
      </div>

      {/* Sutil gradiente de iluminación de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#CCFF00]/3 blur-[160px] pointer-events-none"></div>

      {/* Contenedor del contenido del Catálogo (que se revela tras la compuerta) */}
      <div ref={contentRef} className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 will-change-transform">
        {/* Header Superior del Catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#2A2A30]/80 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#CCFF00] tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
              <span>CATÁLOGO DE PRENDAS • COLECCIÓN 004</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#F4F4F6] tracking-tight uppercase">
              SELECCIÓN TÉCNICA
            </h2>
          </div>

          {/* Controles de Navegación del Slide (Flechas Izquierda / Derecha) */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#8E8E93] hidden sm:inline">
              DESLIZAR PRENDAS
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => slide('left')}
                disabled={!canScrollLeft}
                className={`w-11 h-11 border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'border-[#2A2A30] bg-[#141417] text-[#F4F4F6] hover:border-[#CCFF00] hover:text-[#CCFF00] shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                    : 'border-[#2A2A30]/40 bg-[#0A0A0C] text-[#8E8E93]/30 cursor-not-allowed'
                }`}
                aria-label="Deslizar hacia la izquierda"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => slide('right')}
                disabled={!canScrollRight}
                className={`w-11 h-11 border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? 'border-[#2A2A30] bg-[#141417] text-[#F4F4F6] hover:border-[#CCFF00] hover:text-[#CCFF00] shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                    : 'border-[#2A2A30]/40 bg-[#0A0A0C] text-[#8E8E93]/30 cursor-not-allowed'
                }`}
                aria-label="Deslizar hacia la derecha"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Anchors de Categoría para SEO, Sitemap e Indexación */}
        <div id="jackets" className="sr-only" aria-hidden="true"></div>
        <div id="hoodies" className="sr-only" aria-hidden="true"></div>
        <div id="pants" className="sr-only" aria-hidden="true"></div>

        {/* Barra de Filtros por Categoría */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#8E8E93] flex items-center gap-1.5 mr-2">
              <Filter size={13} className="text-[#CCFF00]" />
              FILTRAR:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 border font-mono text-xs transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                    : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6] hover:border-[#8E8E93]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-[#8E8E93]">
            [PRENDAS DISPONIBLES: <span className="text-[#CCFF00] font-bold">{filteredProducts.length}</span>]
          </div>
        </div>

        {/* Track Deslizante Horizontal (Slide hacia los costados) */}
        <div
          ref={sliderRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-6 pt-2"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>

        {/* Guía Visual Inferior de Desplazamiento */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2A2A30]/50 font-mono text-[11px] text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full"></span>
            <span>Haz clic en cualquier prenda para ver su ficha completa, guía de talles y compra.</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>PASAR CURSOR SOBRE PRENDA PARA VER ESPALDA</span>
            <span>•</span>
            <span className="text-[#F4F4F6]">DESLIZA HORIZONTALMENTE</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
};
