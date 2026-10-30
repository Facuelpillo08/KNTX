import React, { useState } from 'react';
import { useCart } from '../../context/useCart';
import { ArrowUpRight } from 'lucide-react';

/**
 * ProductCard (Preview para el slider horizontal de catálogo)
 * - Sin botones manuales de FRONT/BACK.
 * - Al pasar el mouse por arriba, la foto cambia automáticamente a la parte trasera.
 * - Sin selector de talles ni tablas saturadas (puramente editorial).
 * - Al hacer clic, abre la vista de detalle completa (estilo Newline Halo).
 */
export const ProductCard = React.memo(({ product, priority = false }) => {
  const { openProductDetail } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const isVolt = product.accent === 'volt';
  const accentColor = isVolt ? '#CCFF00' : '#FF3B00';

  return (
    <article
      id={`product-${product.id}`}
      onClick={() => openProductDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${product.name} - ${product.category}`}
      className="group relative flex flex-col cursor-pointer transition-all duration-300 w-[82vw] sm:w-[46vw] md:w-[32vw] lg:w-[24vw] xl:w-[20vw] min-w-[270px] max-w-[400px] flex-shrink-0 snap-start"
    >
      {/* Editorial Image Stage (Aspect ratio 3:4, sin marcos pesados ni botones de giro) */}
      <div className="relative aspect-[3/4] w-full bg-[#111114] border border-[#2A2A30]/60 group-hover:border-[#8E8E93] transition-all duration-300 flex items-center justify-center p-6 overflow-hidden">
        {/* Accent indicator corner */}
        <div
          className="absolute top-0 left-0 w-8 h-[2px] transition-all duration-300 group-hover:w-full"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* Product Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[9px] font-mono font-bold px-2 py-0.5 border"
            style={{
              borderColor: accentColor,
              color: accentColor,
              backgroundColor: 'rgba(10, 10, 12, 0.85)'
            }}
          >
            {product.badge || 'NUEVA'}
          </span>
        </div>

        {/* Hover View indicator */}
        <div className="absolute top-3 right-3 z-10 font-mono text-[9px] text-[#8E8E93] bg-[#0A0A0C]/80 px-2 py-0.5 border border-[#2A2A30]/80 transition-colors group-hover:text-[#F4F4F6]">
          {isHovered ? 'VISTA TRASERA' : 'VISTA FRONTAL'}
        </div>

        {/* Front Image */}
        <img
          src={product.frontImage}
          alt={`${product.name} — Vista Frontal Ropa Técnica KNTX LAB`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width="1024"
          height="1024"
          className={`absolute inset-0 w-full h-full object-contain p-6 filter contrast-105 transition-all duration-500 ease-out select-none ${
            isHovered ? 'opacity-0 scale-95 blur-xs' : 'opacity-100 scale-100 blur-none'
          }`}
        />

        {/* Back Image (Se muestra automáticamente al pasar el cursor) */}
        <img
          src={product.backImage}
          alt={`${product.name} — Vista Trasera Ropa Técnica KNTX LAB`}
          loading="lazy"
          decoding="async"
          width="1024"
          height="1024"
          className={`absolute inset-0 w-full h-full object-contain p-6 filter contrast-105 transition-all duration-500 ease-out select-none ${
            isHovered ? 'opacity-100 scale-105 blur-none' : 'opacity-0 scale-95 blur-xs'
          }`}
        />

        {/* Subtle quick action floating bar on hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="py-2 px-3 bg-[#0A0A0C]/90 backdrop-blur-md border border-[#2A2A30] flex items-center justify-between font-mono text-[10px] text-[#CCFF00]">
            <span>VER DETALLE & COMPRA</span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>

      {/* Product Details Caption (Clean, Editorial, Non-square) */}
      <div className="pt-3.5 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
          <span className="uppercase tracking-wider">{product.category}</span>
          <span style={{ color: accentColor }} className="font-bold">{product.ref}</span>
        </div>

        <h3 className="font-display font-extrabold text-base sm:text-lg text-[#F4F4F6] tracking-tight uppercase group-hover:text-white transition-colors truncate">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-0.5">
          <span className="font-display font-bold text-sm text-[#F4F4F6]">
            ${product.price} USD
          </span>
          <span className="font-mono text-[10px] text-[#8E8E93]">
            {product.tag}
          </span>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
