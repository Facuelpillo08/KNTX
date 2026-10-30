import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { KntxLogo } from '../common/KntxLogo';

// Imágenes de la colección para la ráfaga cinemática
import lookbook1 from '../../assets/lookbook-1.webp';
import anorakFront from '../../assets/anorak-front.webp';
import lookbook2 from '../../assets/lookbook-2.webp';
import jacketFront from '../../assets/jacket-front.webp';
import hoodieFront from '../../assets/hoodie-front.webp';
import cargoFront from '../../assets/cargo-front.webp';
import vestFront from '../../assets/vest-front.webp';

const PRELOADER_IMAGES = [
  lookbook1,
  anorakFront,
  lookbook2,
  jacketFront,
  hoodieFront,
  cargoFront,
  vestFront,
];

const STATUS_LOGS = [
  { max: 25, label: '[01/04] BOOTING ARCHIVE CORE • SYS_INIT' },
  { max: 55, label: '[02/04] INDEXING FABRICS (HYDROPHOBIC 420D)' },
  { max: 80, label: '[03/04] CALIBRATING OPTICS • KNTX LAB' },
  { max: 99, label: '[04/04] DECOMPRESSING ASSETS • DEPLOYMENT' },
  { max: 100, label: '[READY] ACCESS GRANTED • WELCOME TO KNTX' },
];

/**
 * Preloader
 * Pantalla de carga estilo Awwwards:
 * - Ráfaga cinemática de fotos de la colección a pantalla completa.
 * - Haz láser neón (#CCFF00) que barre verticalmente la pantalla.
 * - Contador de porcentaje monumental con tipografía monospaced.
 * - Micro-códigos y estados de diagnóstico dinámicos.
 * - Destello final y cortina que se eleva revelando el Hero.
 */
export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const containerRef = useRef(null);
  const scanlineRef = useRef(null);
  const flashRef = useRef(null);
  const photoIntervalRef = useRef(null);

  // 1. Ráfaga continua de imágenes durante la carga
  useEffect(() => {
    photoIntervalRef.current = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % PRELOADER_IMAGES.length);
    }, 110);

    return () => {
      if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);
    };
  }, []);

  // 2. Animación de escaneo láser continuo y contador GSAP
  useEffect(() => {
    // Bloquear scroll mientras el preloader esté activo
    document.body.style.overflow = 'hidden';

    // Barrido continuo del haz láser neón
    const laserTween = gsap.to(scanlineRef.current, {
      y: '100vh',
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Contador de porcentaje numérico (0 -> 100)
    const progressObj = { value: 0 };
    const counterTween = gsap.to(progressObj, {
      value: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
      onComplete: () => {
        // Detener la ráfaga de fotos en background para liberar ciclos de CPU
        if (photoIntervalRef.current) {
          clearInterval(photoIntervalRef.current);
          photoIntervalRef.current = null;
        }

        // Secuencia ágil de apertura: cortina que sube revelando el Hero
        const exitTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
          },
        });

        // Micro-destello neón simultáneo
        exitTl.to(flashRef.current, {
          opacity: 0.5,
          duration: 0.06,
          ease: 'power1.in',
        });
        exitTl.to(flashRef.current, {
          opacity: 0,
          duration: 0.12,
          ease: 'power1.out',
        });

        // Cortina del preloader se eleva hacia arriba de inmediato
        exitTl.to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 0.65,
            ease: 'power3.inOut',
          },
          '-=0.14'
        );

        // Disparar evento global para que el Hero inicie su animación en sincronía perfecta con la apertura
        exitTl.call(() => {
          window.dispatchEvent(new CustomEvent('kntx-preloader-ready'));
          if (onComplete) onComplete();
        }, null, 0.10);
      },
    });

    return () => {
      laserTween.kill();
      counterTween.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Obtener status actual según el porcentaje
  const currentStatus =
    STATUS_LOGS.find((s) => progress <= s.max)?.label || STATUS_LOGS[0].label;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0A0A0C] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden will-change-transform"
    >
      {/* Ráfaga Cinemática de Fotos de Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {PRELOADER_IMAGES.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`KNTX LAB Archivo Textil — Prenda Técnica ${idx + 1}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            width="1920"
            height="1080"
            className={`absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-75 transition-opacity duration-75 ${
              idx === currentPhotoIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}

        {/* Viñeta oscura periférica para mantener legibles los textos */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-[#0A0A0C]/90 pointer-events-none"></div>

        {/* Retícula sutil tipo Blueprint/HUD */}
        <div className="absolute inset-0 bg-[radial-gradient(#CCFF00_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
      </div>

      {/* Haz Láser Neón que barre verticalmente la pantalla */}
      <div
        ref={scanlineRef}
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent shadow-[0_0_25px_4px_rgba(204,255,0,0.8)] z-10 pointer-events-none"
      ></div>

      {/* Destello Neón de Finalización */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-[#CCFF00] opacity-0 z-50 pointer-events-none"
      ></div>

      {/* Encabezado Superior del Preloader */}
      <div className="relative z-20 flex items-center justify-between font-mono text-xs text-[#8E8E93]">
        <div className="flex items-center gap-3">
          <KntxLogo variant="symbol" className="w-5 h-5" />
          <span className="font-bold text-[#F4F4F6] tracking-widest uppercase">
            KNTX<span className="text-[#CCFF00] ml-1">[LAB]</span>
          </span>
          <span className="hidden sm:inline text-[#2A2A30]">|</span>
          <span className="hidden sm:inline tracking-wider">OFFICIAL SYSTEM PRELOAD</span>
        </div>

        <div className="flex items-center gap-2 text-[#CCFF00] tracking-widest text-[11px]">
          <span className="animate-spin text-xs">◐</span>
          <span>{currentStatus}</span>
        </div>
      </div>

      {/* Elemento Central: Cuadrícula de Enfoque Óptico */}
      <div className="relative z-20 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 sm:w-64 sm:h-64 border border-[#CCFF00]/30 relative flex flex-col items-center justify-center bg-[#0A0A0C]/40 backdrop-blur-xs p-4">
          {/* Esquinas con brackets tácticos */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#CCFF00]"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#CCFF00]"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#CCFF00]"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#CCFF00]"></div>

          <KntxLogo variant="symbol" className="w-16 h-16 sm:w-20 sm:h-20 mb-3 drop-shadow-[0_0_18px_rgba(204,255,0,0.35)]" />

          <div className="font-mono text-[9px] text-[#CCFF00]/70 tracking-widest uppercase text-center space-y-1">
            <div>SCANNING ASSETS</div>
            <div className="text-[#8E8E93] text-[8px]">FRAME: {currentPhotoIdx + 1} / {PRELOADER_IMAGES.length}</div>
          </div>
        </div>
      </div>

      {/* Pie Inferior: Barra de Progreso y Contador Monumental */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#2A2A30]/80 pt-6">
        {/* Barra de Progreso y Especificaciones Técnicas */}
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#8E8E93] tracking-widest uppercase">
            <span>INITIALIZING BUFFER</span>
            <span className="text-[#CCFF00]">{progress}%</span>
          </div>

          {/* Barra de progreso con resplandor neón */}
          <div className="w-full h-1 bg-[#141417] border border-[#2A2A30] overflow-hidden">
            <div
              className="h-full bg-[#CCFF00] shadow-[0_0_12px_#CCFF00] transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="font-mono text-[10px] text-[#8E8E93] tracking-wider uppercase">
            DROP_004 // TOKYO • BUENOS AIRES • ALL-WEATHER SPEC
          </div>
        </div>

        {/* Contador Numérico Monumental */}
        <div className="flex items-baseline font-mono text-[#F4F4F6] self-end sm:self-auto">
          <span className="font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter leading-none">
            {progress < 10 ? `0${progress}` : progress}
          </span>
          <span className="font-mono text-2xl sm:text-4xl text-[#CCFF00] font-black ml-2">
            %
          </span>
        </div>
      </div>
    </div>
  );
};
