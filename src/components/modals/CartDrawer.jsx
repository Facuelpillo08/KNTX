import React, { useEffect } from 'react';
import { useCart } from '../../context/useCart';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Terminal, ShoppingBag } from 'lucide-react';
import { getWhatsAppUrl } from '../../config/brand';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    isFreeShipping,
    shippingThreshold,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeCart();
      }
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);
  const remainingForFree = Math.max(0, shippingThreshold - subtotal);

  const handleWhatsAppCheckout = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    // Sanitize and calculate validated numbers
    const validItems = cartItems.map((item) => {
      const safeName = String(item.name || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 80);
      const safeSize = ['S', 'M', 'L', 'XL'].includes(item.size) ? item.size : 'ESTÁNDAR';
      const safeQty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
      const safePrice = Math.max(0, Number(item.price) || 0);
      const safeRef = String(item.ref || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 30);
      const safeCode = String(item.code || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 30);
      const itemTotal = safePrice * safeQty;

      return {
        name: safeName,
        size: safeSize,
        quantity: safeQty,
        price: safePrice,
        itemTotal,
        ref: safeRef,
        code: safeCode,
      };
    });

    const validatedSubtotal = validItems.reduce((acc, item) => acc + item.itemTotal, 0);
    const validatedFreeShipping = validatedSubtotal >= shippingThreshold;
    const validatedFinalTotal = validatedFreeShipping ? validatedSubtotal : validatedSubtotal + 15;

    let message = `*ORDEN DE COMPRA • KNTX LAB*\n`;
    message += `===================================\n`;
    message += `CLIENTE: DESPACHO DIRECTO\n`;
    message += `FECHA: ${new Date().toLocaleDateString()}\n\n`;
    message += `*PRENDAS REGISTRADAS:*\n`;

    validItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} [TALLE: ${item.size}] x${item.quantity} -> $${item.itemTotal} USD\n`;
      message += `   (${item.ref} - CÓD: ${item.code})\n`;
    });

    message += `\n===================================\n`;
    message += `*SUBTOTAL:* $${validatedSubtotal} USD\n`;
    message += `*ENVÍO TÁCTICO:* ${validatedFreeShipping ? 'GRATUITO (BONIFICADO)' : '$15 USD'}\n`;
    message += `*TOTAL FINAL:* $${validatedFinalTotal} USD\n`;
    message += `===================================\n`;
    message += `Solicito confirmación de inventario y coordenadas para despacho.`;

    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-[70] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      ></div>

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#141417] border-l border-[#2A2A30] h-full flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Top Hazard Accent Bar */}
        <div className="h-1 w-full bg-[#CCFF00]"></div>

        {/* Header */}
        <div className="p-4 border-b border-[#2A2A30] flex items-center justify-between bg-[#0A0A0C]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-[#CCFF00] flex items-center justify-center text-[#CCFF00]">
              <ShoppingBag size={13} />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="font-display font-extrabold text-sm uppercase text-[#F4F4F6] tracking-tight">
                CARRITO DE COMPRAS
              </h2>
              <span className="text-[10px] font-mono text-[#8E8E93]">
                [{totalItems} PRENDAS SELECCIONADAS]
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 border border-[#2A2A30] hover:border-[#CCFF00] flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="px-4 py-2.5 bg-[#0A0A0C] border-b border-[#2A2A30] font-mono text-xs">
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-[#8E8E93]">ENVÍO TÁCTICO SIN COSTO:</span>
            <span className={isFreeShipping ? 'text-[#CCFF00] font-bold' : 'text-[#FF3B00]'}>
              {isFreeShipping ? '✓ DESBLOQUEADO' : `FALTAN $${remainingForFree} USD`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#2A2A30] overflow-hidden">
            <div
              className="h-full bg-[#CCFF00] transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 border border-[#2A2A30] flex items-center justify-center text-[#8E8E93]">
                <Terminal size={28} />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#F4F4F6] font-bold">
                  [MANIFIESTO VACÍO]
                </p>
                <p className="font-mono text-[11px] text-[#8E8E93] max-w-xs">
                  No se han registrado prendas del DROP_004. Selecciona un talle en el catálogo para agregarlo.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-volt px-4 py-2 text-xs font-mono font-bold cursor-pointer"
              >
                IR AL CATÁLOGO
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="border border-[#2A2A30] bg-[#0A0A0C] p-3 flex gap-3 relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 bg-[#141417] border border-[#2A2A30] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.name} — Prenda en Carrito de Compras`}
                    width="80"
                    height="80"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between font-mono">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-display font-bold text-xs text-[#F4F4F6] uppercase leading-snug">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#8E8E93] hover:text-[#FF3B00] transition-colors p-0.5 cursor-pointer"
                        title="Eliminar prenda"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#141417] border border-[#2A2A30] text-[#CCFF00] font-bold">
                        TALLE: [{item.size}]
                      </span>
                      <span className="text-[10px] text-[#8E8E93]">
                        {item.ref}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2A30]/50 mt-2">
                    <div className="flex items-center border border-[#2A2A30] bg-[#141417]">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="px-2 py-0.5 text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#F4F4F6]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="px-2 py-0.5 text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="font-display font-extrabold text-sm text-[#F4F4F6]">
                      ${item.price * item.quantity} USD
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#0A0A0C] border-t border-[#2A2A30] space-y-3 font-mono">
            {/* Clear Cart link */}
            <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
              <span>PAGO DIRECTO POR WHATSAPP</span>
              <button
                onClick={clearCart}
                className="hover:text-[#FF3B00] underline transition-colors cursor-pointer"
              >
                VACIAR CARRITO
              </button>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#8E8E93] pt-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-[#F4F4F6] font-bold">${subtotal} USD</span>
              </div>
              <div className="flex justify-between">
                <span>ENVÍO ESTIMADO:</span>
                <span className={isFreeShipping ? 'text-[#CCFF00]' : 'text-[#F4F4F6]'}>
                  {isFreeShipping ? 'FREE (URBAN DROP)' : '$15 USD'}
                </span>
              </div>
              <div className="h-[1px] bg-[#2A2A30] my-1"></div>
              <div className="flex justify-between text-sm font-display font-extrabold text-[#F4F4F6]">
                <span>TOTAL ASIGNADO:</span>
                <span className="text-[#CCFF00]">
                  ${isFreeShipping ? subtotal : subtotal + 15} USD
                </span>
              </div>
            </div>

            {/* WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3.5 bg-[#CCFF00] text-[#0A0A0C] hover:bg-white font-mono font-extrabold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_-3px_rgba(204,255,0,0.5)]"
            >
              <span>CHECKOUT DIRECTO WHATSAPP</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-[#8E8E93] text-center pt-1">
              <ShieldCheck size={12} className="text-[#CCFF00]" />
              <span>ENLACE ENCRIPTADO DIRECTO CON EL TALLER KNTX</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
