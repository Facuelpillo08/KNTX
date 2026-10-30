import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CartContext } from './CartContextDef';
import { PRODUCTS } from '../data/products';

const LOCAL_STORAGE_KEY = 'kntx_lab_cart_v1';
const ALLOWED_SIZES = ['S', 'M', 'L', 'XL'];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        console.warn('Invalid cart format in localStorage; resetting.');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return [];
      }
      // Re-hydrate strictly from canonical catalog data to prevent price/content tampering & prototype pollution
      return parsed
        .filter(item => item && typeof item === 'object' && !Array.isArray(item))
        .map(item => {
          const canonical = PRODUCTS.find(p => p.id === item.productId);
          if (!canonical) return null;
          const allowedSizes = canonical.sizes || ALLOWED_SIZES;
          const validSize = allowedSizes.includes(item.size) ? item.size : null;
          if (!validSize) return null;
          const qty = Number.isInteger(item.quantity) && item.quantity > 0
            ? Math.min(Math.max(item.quantity, 1), 99)
            : 1;

          return {
            cartItemId: `${canonical.id}-${validSize}`,
            productId: canonical.id,
            name: canonical.name,
            code: canonical.code,
            ref: canonical.ref,
            price: Number(canonical.price) || 0,
            size: validSize,
            image: canonical.frontImage,
            accentColor: canonical.accentColor || '#CCFF00',
            quantity: qty,
          };
        })
        .filter(Boolean);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [activeProductForSize, setActiveProductForSize] = useState(null);
  const [recommendedSize, setRecommendedSizeState] = useState(() => {
    try {
      const saved = localStorage.getItem('kntx_user_size_v1');
      return ['S', 'M', 'L', 'XL'].includes(saved) ? saved : null;
    } catch {
      return null;
    }
  });

  const setRecommendedSize = useCallback((size) => {
    const valid = ['S', 'M', 'L', 'XL'].includes(size) ? size : null;
    setRecommendedSizeState(valid);
    try {
      if (valid) {
        localStorage.setItem('kntx_user_size_v1', valid);
      } else {
        localStorage.removeItem('kntx_user_size_v1');
      }
    } catch {
      // ignore
    }
  }, []);
  const [notification, setNotification] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activePolicy, setActivePolicy] = useState(null); // 'shipping' | 'returns' | 'care' | 'tracking' | 'terms' | 'privacy'

  const openPolicyModal = useCallback((policyKey = 'shipping') => {
    setActivePolicy(policyKey);
  }, []);

  const closePolicyModal = useCallback(() => {
    setActivePolicy(null);
  }, []);

  const openProductDetail = useCallback((product) => {
    setSelectedProductDetail(product);
  }, []);

  const closeProductDetail = useCallback(() => {
    setSelectedProductDetail(null);
  }, []);

  // Centralized body scroll lock for all modals (prevents leaks when multiple modals stack)
  const anyModalOpen = Boolean(
    isCartOpen || isSizeModalOpen || selectedProductDetail || activePolicy
  );

  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [anyModalOpen]);

  // Sync with localStorage with QuotaExceededError protection
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('Storage quota exceeded; resetting cart cache in localStorage');
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
          // ignore
        }
      } else {
        console.error('Error saving cart to localStorage', e);
      }
    }
  }, [cartItems]);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  }, []);

  const addToCart = useCallback((product, selectedSize) => {
    if (!product || !product.id) {
      return { success: false, reason: 'INVALID_PRODUCT' };
    }
    const allowedSizes = product.sizes || ALLOWED_SIZES;
    if (!selectedSize || !allowedSizes.includes(selectedSize)) {
      showNotification('ALERTA: SELECCIONA UN TALLE [S | M | L | XL] ANTES DE CONTINUAR', 'error');
      return { success: false, reason: 'SIZE_REQUIRED' };
    }

    const itemKey = `${product.id}-${selectedSize}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === itemKey);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === itemKey
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId: itemKey,
            productId: product.id,
            name: product.name,
            code: product.code,
            ref: product.ref,
            price: Number(product.price) || 0,
            size: selectedSize,
            image: product.frontImage,
            accentColor: product.accentColor || '#CCFF00',
            quantity: 1,
          }
        ];
      }
    });

    showNotification(`Añadido al carrito: ${product.name} [${selectedSize}]`, 'success');
    setIsCartOpen(true);
    return { success: true };
  }, [showNotification]);

  const removeFromCart = useCallback((cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, delta) => {
    const safeDelta = Number.isInteger(delta) ? Math.min(Math.max(delta, -10), 10) : 0;
    if (safeDelta === 0) return;

    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + safeDelta;
          // Clamped at 1 to prevent accidental removal; user must click Trash icon for deliberate removal
          return { ...item, quantity: Math.min(Math.max(newQty, 1), 99) };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const openSizeModal = useCallback((product = null) => {
    setActiveProductForSize(product);
    setIsSizeModalOpen(true);
  }, []);

  const closeSizeModal = useCallback(() => {
    setIsSizeModalOpen(false);
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );
  const shippingThreshold = 200;
  const isFreeShipping = subtotal >= shippingThreshold;

  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      totalItems,
      isFreeShipping,
      shippingThreshold,
      isSizeModalOpen,
      activeProductForSize,
      openSizeModal,
      closeSizeModal,
      recommendedSize,
      setRecommendedSize,
      notification,
      showNotification,
      selectedProductDetail,
      openProductDetail,
      closeProductDetail,
      activePolicy,
      openPolicyModal,
      closePolicyModal,
    }),
    [
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      totalItems,
      isFreeShipping,
      shippingThreshold,
      isSizeModalOpen,
      activeProductForSize,
      openSizeModal,
      closeSizeModal,
      recommendedSize,
      setRecommendedSize,
      notification,
      showNotification,
      selectedProductDetail,
      openProductDetail,
      closeProductDetail,
      activePolicy,
      openPolicyModal,
      closePolicyModal,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
