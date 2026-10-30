/**
 * KNTX [LAB] Brand & Operational Configuration
 * Centralized settings for e-commerce, customer support and logistics.
 */
export const BRAND_CONFIG = {
  name: 'KNTX LAB',
  tagline: 'Engineered for Concrete',
  // Reemplazar con el número de teléfono oficial en formato internacional (sin signos +, ej: 5491112345678 para Argentina)
  whatsappNumber: '5491122334455',
  supportEmail: 'taller@kntx.lab',
  currency: 'USD',
  shippingThreshold: 200,
  flatShippingRate: 15,
  location: 'BUENOS AIRES // GLOBAL DISPATCH',
};

export const getWhatsAppUrl = (message) => {
  const encoded = encodeURIComponent(message);
  const number = BRAND_CONFIG.whatsappNumber ? BRAND_CONFIG.whatsappNumber.replace(/[^0-9]/g, '') : '';
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
};

