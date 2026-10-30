import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 * Módulo 1: Smooth Scroll Global (Lenis + GSAP Ticker)
 * Sincroniza la inercia de Lenis con ScrollTrigger.update y gsap.ticker
 * para garantizar un scroll cinematográfico sin saltos en 60/120fps.
 */
export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Inicializar Lenis con configuración de alta precisión
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponencial suave
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // 2. Conectar el evento de scroll de Lenis a ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Sincronizar el RAF de GSAP con el loop de render de Lenis
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // Evitar desajustes de lag en GSAP al cambiar de pestaña
    gsap.ticker.lagSmoothing(0);

    // 4. Limpieza al desmontar
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};
