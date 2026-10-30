import React, { useEffect, useRef } from 'react';
import heroImg from '../../assets/hero.webp';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroSection
 * - 100% Pantalla completa (w-full h-screen / 100vh) de borde a borde.
 * - Sin botones ni saturación de textos.
 * - Título monumental fiel al diseño original con interlineado leading-[0.92] perfecto.
 * - Entrada cinematográfica fluida y sin pantallas negras.
 * - Desplazamiento parallax natural al scrollear.
 */
export const HeroSection = () => {
  const sectionRef = useRef(null);
  const heroImgRef = useRef(null);
  const tagRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    let played = false;
    let fallbackTimer = null;
    let playTimeline = null;

    const ctx = gsap.context(() => {
      // 1. Estado inicial fijado por GSAP: oculto, con desplazamiento hacia abajo y ligero desenfoque
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        opacity: 0,
        y: 60,
        filter: 'blur(10px)',
      });
      gsap.set([tagRef.current, subtextRef.current], {
        opacity: 0,
        y: 18,
      });

      // 2. Timeline principal de entrada (inicia pausado)
      const tl = gsap.timeline({ paused: true });

      // Aterrizaje sutil de la fotografía editorial de fondo
      tl.fromTo(
        heroImgRef.current,
        { scale: 1.08 },
        { scale: 1.0, duration: 1.4, ease: 'power3.out' },
        0
      );

      // Helper para la animación de entrada cinética + chisporroteo de ignición de cada línea
      const addLineEntrance = (target, atTime, isNeon = false) => {
        if (!target) return;

        // Movimiento cinético ascendente bien marcado y visible (0.75s)
        tl.to(
          target,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.75,
            ease: 'power3.out',
          },
          atTime
        );

        // Chisporroteo eléctrico de encendido a mitad de la subida
        tl.to(
          target,
          {
            opacity: 0.35,
            filter: isNeon
              ? 'drop-shadow(0 0 15px rgba(204,255,0,0.4))'
              : 'brightness(1.9)',
            duration: 0.05,
            ease: 'power1.in',
          },
          atTime + 0.22
        );

        // Golpe de voltaje / arco neón intenso
        tl.to(
          target,
          {
            opacity: 1,
            filter: isNeon
              ? 'drop-shadow(0 0 65px rgba(204,255,0,1)) drop-shadow(0 0 25px rgba(204,255,0,0.95))'
              : 'brightness(2.2)',
            duration: 0.08,
            ease: 'power2.out',
          },
          atTime + 0.27
        );

        // Micro-rebote de tensión
        tl.to(
          target,
          {
            opacity: 0.8,
            filter: isNeon
              ? 'drop-shadow(0 0 28px rgba(204,255,0,0.6))'
              : 'brightness(1.2)',
            duration: 0.06,
            ease: 'power1.out',
          },
          atTime + 0.35
        );

        // Estabilización sólida y permanente
        tl.to(
          target,
          {
            opacity: 1,
            y: 0,
            filter: isNeon
              ? 'drop-shadow(0 0 35px rgba(204,255,0,0.7))'
              : 'none',
            duration: 0.15,
            ease: 'power2.out',
          },
          atTime + 0.41
        );

        // Limpieza de transforms para estabilidad estática total y nitidez pura
        tl.set(
          target,
          {
            clearProps: isNeon ? 'transform' : 'transform,filter',
          },
          atTime + 0.65
        );
      };

      // Entrada cinética escalonada de las 3 líneas
      addLineEntrance(line1Ref.current, 0.05, false); // "ENGINEERED" (Blanco)
      addLineEntrance(line2Ref.current, 0.28, true);  // "FOR THE" (Volt neón #CCFF00)
      addLineEntrance(line3Ref.current, 0.50, false); // "CONCRETE" (Blanco)

      // Entrada suave de la etiqueta de colección y subtítulo técnico
      tl.to(
        [tagRef.current, subtextRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
        },
        0.75
      );

      // Función para reproducir el timeline
      playTimeline = () => {
        if (played) return;
        played = true;
        tl.play();
      };

      // Escuchar el evento del preloader
      window.addEventListener('kntx-preloader-ready', playTimeline);

      // Fallback timer: a los 1.8s se dispara garantizado
      fallbackTimer = setTimeout(playTimeline, 1800);

      // Parallax suave y continuo durante el scroll posterior
      gsap.to(heroImgRef.current, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      if (playTimeline) {
        window.removeEventListener('kntx-preloader-ready', playTimeline);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-[100dvh] min-h-[560px] bg-[#0A0A0C] overflow-hidden select-none z-10 flex flex-col justify-center"
    >
      {/* 100% Fullscreen Editorial Photograph con parallax suave */}
      <img
        ref={heroImgRef}
        src={heroImg}
        alt="KNTX LAB Colección Oficial — Ropa Técnica Urbana Engineered for the Concrete"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width="1920"
        height="1080"
        className="absolute inset-0 w-full h-[118%] -top-[9%] object-cover object-[center_25%] sm:object-[center_30%] filter contrast-105 brightness-100 will-change-transform"
      />

      {/* Viñeta con gradiente responsivo: vertical en móvil para proteger el texto, horizontal en desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/75 to-[#0A0A0C]/25 sm:bg-gradient-to-r sm:from-[#0A0A0C]/95 sm:via-[#0A0A0C]/40 sm:to-transparent pointer-events-none z-10"></div>

      {/* Un Solo Título Monumental al Costado con Tipografía Fluid Clamp & Zero Clipping */}
      <div className="relative z-20 flex flex-col justify-center px-4 xs:px-6 sm:px-12 lg:px-20 max-w-4xl h-full pt-16 sm:pt-0">
        <div className="space-y-2.5 sm:space-y-3">
          {/* Tag Superior */}
          <div ref={tagRef} className="will-change-transform">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#CCFF00] tracking-widest uppercase bg-[#0A0A0C]/60 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 border border-[#CCFF00]/30 sm:border-none backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
              <span>COLECCIÓN OFICIAL DROP 004</span>
            </div>
          </div>

          {/* Título Monumental Fluido: Escala matemáticamente con clamp() en móvil para evitar recortes */}
          <h1
            className="font-display font-black text-[clamp(1.5rem,7.5vw,3.2rem)] sm:text-7xl lg:text-8xl tracking-tighter text-[#F4F4F6] uppercase leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            <span ref={line1Ref} className="block whitespace-nowrap will-change-transform">
              ENGINEERED
            </span>
            <span
              ref={line2Ref}
              className="block whitespace-nowrap text-[#CCFF00] drop-shadow-[0_0_35px_rgba(204,255,0,0.7)] will-change-transform"
            >
              FOR THE
            </span>
            <span ref={line3Ref} className="block whitespace-nowrap will-change-transform">
              CONCRETE
            </span>
          </h1>

          {/* Subtítulo Inferior */}
          <div ref={subtextRef} className="will-change-transform">
            <p className="font-mono text-[11px] sm:text-sm text-[#8E8E93] tracking-wider pt-1 sm:pt-2 uppercase">
              KNTX LAB • ROPA TÉCNICA URBANA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
