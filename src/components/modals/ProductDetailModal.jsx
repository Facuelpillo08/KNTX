import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/useCart';
import {
  X,
  Sliders,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Truck,
  RotateCcw,
  ZoomIn,
  Crosshair,
} from 'lucide-react';

const ProductDetailDialog = ({
  product,
  closeProductDetail,
  addToCart,
  openSizeModal,
  recommendedSize,
  openPolicyModal,
}) => {
  const [activeImageKey, setActiveImageKey] = useState('front'); // 'front' | 'back'
  const [selectedSize, setSelectedSize] = useState(() => (
    recommendedSize && product.sizes.includes(recommendedSize) ? recommendedSize : null
  ));

  // Synchronize selection whenever recommendedSize is applied from the calculator
  useEffect(() => {
    let timer;
    if (recommendedSize && product.sizes.includes(recommendedSize)) {
      const stock = product.stock ? product.stock[recommendedSize] : 1;
      if (stock > 0) {
        timer = setTimeout(() => setSelectedSize(recommendedSize), 0);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [recommendedSize, product]);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'desc' | 'specs' | 'shipping'
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [activeMacroDetail, setActiveMacroDetail] = useState(null);

  const handleMouseMove = (e) => {
    if (!isZoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const handleTouchMove = (e) => {
    if (!isZoomActive || !e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const focusMacroSpot = (name, x, y) => {
    setIsZoomActive(true);
    setActiveMacroDetail(name);
    setZoomCoords({ x, y });
  };

  const isVolt = product.accent === 'volt';
  const accentColor = isVolt ? '#CCFF00' : '#FF3B00';
  const currentImage = activeImageKey === 'front' ? product.frontImage : product.backImage;

  const handleAddToCart = () => {
    const res = addToCart(product, selectedSize);
    if (res.success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        closeProductDetail();
      }, 350);
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in"
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeProductDetail}
      ></div>

      {/* Modal Dialog (Architecture inspired by Newline Halo product page) */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0E0E11] border border-[#2A2A30] shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden">
        {/* Top Accent Strip */}
        <div
          className="h-1 w-full flex-shrink-0 transition-colors"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* Modal Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-[#141417]/90 border border-[#2A2A30] hover:border-[#CCFF00] flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer group"
          aria-label="Cerrar modal"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Large Studio Product Imagery & Thumbnails with Tactical Optical Zoom */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* Main Photo Display Stage */}
              <div
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className={`relative w-full aspect-[4/5] sm:aspect-[1/1] max-w-[540px] bg-[#0A0A0C] border flex items-center justify-center p-6 sm:p-10 overflow-hidden select-none transition-colors ${
                  isZoomActive ? 'border-[#CCFF00] cursor-crosshair shadow-[0_0_25px_rgba(204,255,0,0.15)]' : 'border-[#2A2A30] group'
                }`}
              >
                {/* Product Badge */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-1 border uppercase tracking-wider"
                    style={{
                      borderColor: accentColor,
                      color: accentColor,
                      backgroundColor: 'rgba(10, 10, 12, 0.9)',
                    }}
                  >
                    {product.badge || 'NUEVA PRENDA'}
                  </span>
                </div>

                {/* Tactical Zoom Toggle Button */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => {
                      setIsZoomActive((prev) => !prev);
                      setActiveMacroDetail(null);
                    }}
                    className={`px-3 py-1.5 border font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                      isZoomActive
                        ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-black shadow-[0_0_15px_rgba(204,255,0,0.4)]'
                        : 'border-[#2A2A30] bg-[#0A0A0C]/90 text-[#F4F4F6] hover:border-[#CCFF00]'
                    }`}
                    aria-label="Alternar zoom óptico 2.5X de textura"
                  >
                    <ZoomIn size={12} className={isZoomActive ? 'text-[#0A0A0C]' : 'text-[#CCFF00]'} />
                    <span>{isZoomActive ? 'SALIR DE LUPA' : 'LUPA TÁCTICA [2.5X]'}</span>
                  </button>
                </div>

                {/* Tactical Reticle Brackets (Visible when Zoom Active) */}
                {isZoomActive && (
                  <>
                    <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#CCFF00] pointer-events-none z-20"></div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF00] pointer-events-none z-20"></div>
                    <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#CCFF00] pointer-events-none z-20"></div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF00] pointer-events-none z-20"></div>
                  </>
                )}

                {/* Main Product Image with dynamic scale / pan */}
                <img
                  src={currentImage}
                  alt={`${product.name} — Vista ${activeImageKey === 'front' ? 'Frontal' : 'Trasera'} Ropa Técnica KNTX LAB`}
                  loading="eager"
                  decoding="async"
                  width="540"
                  height="540"
                  style={
                    isZoomActive
                      ? {
                          transform: 'scale(2.6)',
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                          transition: 'transform 0.12s ease-out',
                        }
                      : undefined
                  }
                  className={`w-full h-full object-contain filter contrast-105 pointer-events-none transition-transform duration-300 ease-out ${
                    !isZoomActive ? 'group-hover:scale-105' : ''
                  }`}
                />

                {/* Laser scan line effect (inactive when zooming) */}
                {!isZoomActive && (
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-96 transition-all duration-1000 ease-in-out pointer-events-none"></div>
                )}

                {/* Optical Telemetry HUD Overlay (When zoom active) */}
                {isZoomActive && (
                  <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-none flex items-center justify-between font-mono text-[9px] bg-[#0A0A0C]/90 border border-[#2A2A30] px-3 py-1.5 backdrop-blur-xs text-[#8E8E93]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse"></span>
                      <span className="text-[#CCFF00] font-bold">LUPA TÁCTICA 2.6X:</span>
                      <span>[X: {zoomCoords.x}% | Y: {zoomCoords.y}%]</span>
                    </div>
                    <div className="hidden sm:inline text-[#F4F4F6]">
                      {activeMacroDetail ? `ENFOQUE: ${activeMacroDetail}` : 'ARRASTRA PARA INSPECCIONAR'}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails Navigation (Front & Back Views) */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setActiveImageKey('front');
                    setActiveMacroDetail(null);
                  }}
                  className={`w-20 h-20 bg-[#0A0A0C] border p-1 transition-all cursor-pointer flex flex-col items-center justify-center ${
                    activeImageKey === 'front'
                      ? 'border-[#CCFF00] ring-1 ring-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : 'border-[#2A2A30] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.frontImage}
                    alt={`${product.name} — Miniatura Vista Frontal`}
                    loading="lazy"
                    decoding="async"
                    width="70"
                    height="70"
                    className="w-full h-full object-contain"
                  />
                  <span className="text-[9px] font-mono text-[#8E8E93] mt-0.5">FRENTE</span>
                </button>

                <button
                  onClick={() => {
                    setActiveImageKey('back');
                    setActiveMacroDetail(null);
                  }}
                  className={`w-20 h-20 bg-[#0A0A0C] border p-1 transition-all cursor-pointer flex flex-col items-center justify-center ${
                    activeImageKey === 'back'
                      ? 'border-[#CCFF00] ring-1 ring-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : 'border-[#2A2A30] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.backImage}
                    alt={`${product.name} — Miniatura Vista Trasera`}
                    loading="lazy"
                    decoding="async"
                    width="70"
                    height="70"
                    className="w-full h-full object-contain"
                  />
                  <span className="text-[9px] font-mono text-[#8E8E93] mt-0.5">ESPALDA</span>
                </button>
              </div>

              {/* Quick Macro Inspection Points */}
              <div className="w-full max-w-[540px] mt-4 pt-3 border-t border-[#2A2A30]/60 space-y-2 font-mono">
                <div className="flex items-center justify-between text-[10px] text-[#8E8E93]">
                  <span className="uppercase tracking-wider flex items-center gap-1.5">
                    <Crosshair size={11} className="text-[#CCFF00]" />
                    PUNTOS DE INSPECCIÓN TÁCTICA:
                  </span>
                  <span className="text-[9px] text-[#CCFF00]">CLICK PARA ENFOCAR</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <button
                    onClick={() => focusMacroSpot('MEMBRANA DWR', 50, 26)}
                    className={`px-2.5 py-1 border transition-all cursor-pointer ${
                      activeMacroDetail === 'MEMBRANA DWR'
                        ? 'border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00] font-bold'
                        : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6] hover:border-[#CCFF00]'
                    }`}
                  >
                    [+] TRAMA TEXTIL DWR
                  </button>
                  <button
                    onClick={() => focusMacroSpot('CIERRE YKK', 50, 52)}
                    className={`px-2.5 py-1 border transition-all cursor-pointer ${
                      activeMacroDetail === 'CIERRE YKK'
                        ? 'border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00] font-bold'
                        : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6] hover:border-[#CCFF00]'
                    }`}
                  >
                    [+] CIERRES AQUAGUARD
                  </button>
                  <button
                    onClick={() => focusMacroSpot('HERRAJES & ANCLAJES', 40, 72)}
                    className={`px-2.5 py-1 border transition-all cursor-pointer ${
                      activeMacroDetail === 'HERRAJES & ANCLAJES'
                        ? 'border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00] font-bold'
                        : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6] hover:border-[#CCFF00]'
                    }`}
                  >
                    [+] COSTURAS & HERRAJES
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information & Purchase Flow (Style Newline Halo) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              {/* Product Header */}
              <div className="space-y-2 border-b border-[#2A2A30] pb-5">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E8E93]">
                  <span>KNTX LAB</span>
                  <span>•</span>
                  <span>{product.category}</span>
                  <span>•</span>
                  <span style={{ color: accentColor }}>{product.ref}</span>
                </div>

                <h2 id="product-detail-title" className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#F4F4F6] tracking-tight uppercase leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4F4F6]">
                    ${product.price} USD
                  </span>
                  <span className="font-mono text-xs text-[#8E8E93]">
                    IVA INCLUIDO
                  </span>
                </div>
              </div>

              {/* Color Swatch Information */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] text-[11px] uppercase tracking-wider">
                    COLOR:
                  </span>
                  <span className="font-bold text-[#F4F4F6]">
                    {product.tag}
                  </span>
                </div>
                {/* Visual miniature representation */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 border border-[#2A2A30] flex items-center justify-center p-0.5 ring-1"
                    style={{ ringColor: accentColor }}
                  >
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Size Selector Box (Like Newline Halo horizontal boxes [S] [M] [L] [XL]) */}
              <div className="space-y-2.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] uppercase tracking-wider text-[11px]">
                    SELECCIONAR TALLE:
                  </span>
                  <button
                    onClick={() => openSizeModal(product)}
                    className="text-[#8E8E93] hover:text-[#CCFF00] flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                  >
                    <Sliders size={12} className="text-[#CCFF00]" />
                    <span className="underline">GUÍA DE TALLES</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {product.sizes.map(size => {
                    const isSelected = selectedSize === size;
                    const stockQty = product.stock[size] || 0;
                    const isOutOfStock = stockQty === 0;
                    const isRecommended = recommendedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`relative py-3 border font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isOutOfStock
                            ? 'border-[#2A2A30] bg-[#0A0A0C] text-[#8E8E93]/30 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] shadow-[0_0_15px_rgba(204,255,0,0.4)]'
                            : 'border-[#2A2A30] bg-[#141417] text-[#F4F4F6] hover:border-[#8E8E93]'
                        }`}
                      >
                        <span className="text-sm">{size}</span>
                        {isRecommended && !isOutOfStock && (
                          <span className={`text-[8px] uppercase tracking-tighter mt-0.5 ${isSelected ? 'text-[#0A0A0C]' : 'text-[#CCFF00]'}`}>
                            SUGERIDO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {recommendedSize && (
                  <div className="flex items-center justify-between text-[10px] text-[#CCFF00] bg-[#141417] px-2.5 py-1.5 border border-[#2A2A30]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse"></span>
                      <span>CALCE SUGERIDO: [{recommendedSize}]</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openSizeModal(product)}
                      className="underline text-[#8E8E93] hover:text-[#F4F4F6] cursor-pointer"
                    >
                      Recalibrar
                    </button>
                  </div>
                )}

                {!selectedSize && (
                  <p className="text-[10px] text-[#8E8E93] italic">
                    * Elige un talle para habilitar la orden.
                  </p>
                )}
              </div>

              {/* Add to Cart CTA Button */}
              <div className="pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-4 font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 ${
                    isAdded
                      ? 'bg-white text-[#0A0A0C] shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                      : !selectedSize
                      ? 'bg-[#1E1E24] text-[#8E8E93] cursor-not-allowed border border-[#2A2A30]'
                      : 'bg-[#CCFF00] text-[#0A0A0C] hover:bg-white shadow-[0_0_20px_-3px_rgba(204,255,0,0.5)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>¡AÑADIDO AL CARRITO!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>{selectedSize ? `AÑADIR AL CARRITO [${selectedSize}]` : 'SELECCIONA UN TALLE'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Accordions (Description, Tech Specs, Shipping) */}
              <div className="space-y-2 border-t border-[#2A2A30] pt-4 font-mono text-xs">
                {/* Description Accordion */}
                <div className="border border-[#2A2A30] bg-[#141417]">
                  <button
                    onClick={() => toggleAccordion('desc')}
                    className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-[#F4F4F6] hover:text-[#CCFF00] transition-colors cursor-pointer"
                  >
                    <span>DESCRIPCIÓN DE LA PRENDA</span>
                    {openAccordion === 'desc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {openAccordion === 'desc' && (
                    <div className="p-4 pt-1 border-t border-[#2A2A30]/50 text-[#8E8E93] text-xs leading-relaxed font-sans">
                      {product.description}
                    </div>
                  )}
                </div>

                {/* Tech Specs Accordion */}
                <div className="border border-[#2A2A30] bg-[#141417]">
                  <button
                    onClick={() => toggleAccordion('specs')}
                    className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-[#F4F4F6] hover:text-[#CCFF00] transition-colors cursor-pointer"
                  >
                    <span>ESPECIFICACIONES TÉCNICAS</span>
                    {openAccordion === 'specs' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="p-4 pt-1 border-t border-[#2A2A30]/50 space-y-1.5">
                      {product.techSpecs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-[#8E8E93]">
                          <span style={{ color: accentColor }}>•</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping & Returns Accordion */}
                <div className="border border-[#2A2A30] bg-[#141417]">
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-[#F4F4F6] hover:text-[#CCFF00] transition-colors cursor-pointer"
                  >
                    <span>ENVÍOS & GARANTÍA</span>
                    {openAccordion === 'shipping' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="p-4 pt-1 border-t border-[#2A2A30]/50 space-y-2 text-[#8E8E93] text-[11px] font-sans">
                      <div className="flex items-center gap-2">
                        <Truck size={13} className="text-[#CCFF00] flex-shrink-0" />
                        <span>Despacho seguro a todo el país en 24-48 hs hábiles.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw size={13} className="text-[#CCFF00] flex-shrink-0" />
                        <span>Cambios gratuitos de talle dentro de los 30 días.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield size={13} className="text-[#CCFF00] flex-shrink-0" />
                        <span>Garantía de resistencia en costuras y textiles técnicos.</span>
                      </div>
                      <div className="pt-2 border-t border-[#2A2A30]/50 font-mono">
                        <button
                          type="button"
                          onClick={() => {
                            closeProductDetail();
                            openPolicyModal('shipping');
                          }}
                          className="text-[#CCFF00] hover:underline text-[10px] cursor-pointer"
                        >
                          → Ver protocolo oficial de envíos y garantías
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal = () => {
  const {
    selectedProductDetail,
    closeProductDetail,
    addToCart,
    openSizeModal,
    recommendedSize,
    openPolicyModal,
  } = useCart();

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeProductDetail();
    };
    if (selectedProductDetail) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProductDetail, closeProductDetail]);

  if (!selectedProductDetail) return null;

  return (
    <ProductDetailDialog
      key={selectedProductDetail.id}
      product={selectedProductDetail}
      closeProductDetail={closeProductDetail}
      addToCart={addToCart}
      openSizeModal={openSizeModal}
      recommendedSize={recommendedSize}
      openPolicyModal={openPolicyModal}
    />
  );
};
