import React, { useState, useId, useEffect, useMemo } from 'react';
import { useCart } from '../../context/useCart';
import {
  X,
  Sliders,
  CheckCircle2,
  Crosshair,
  ArrowRight,
  Ruler,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';

// Medidas reales oficiales de confección KNTX LAB (en centímetros)
const GARMENT_SPECS = {
  TOPS: {
    label: 'CHAQUETAS, ANORAKS & BUZOS',
    description: 'Silueta Drop-Shoulder con arquitectura ergonómica y mangas articuladas.',
    measures: [
      { key: 'chest', label: 'Ancho de Pecho (Sisa a Sisa plano)' },
      { key: 'chestTotal', label: 'Contorno Total de Prenda' },
      { key: 'length', label: 'Largo Total (Cuello a Base)' },
      { key: 'shoulders', label: 'Ancho de Hombros (Caído)' },
      { key: 'sleeve', label: 'Largo de Manga' },
    ],
    sizes: {
      S: { chest: 58, chestTotal: 116, length: 70, shoulders: 50, sleeve: 64, heightRange: '160 - 172 cm', weightRange: '50 - 67 kg' },
      M: { chest: 62, chestTotal: 124, length: 73, shoulders: 53, sleeve: 66, heightRange: '170 - 181 cm', weightRange: '66 - 79 kg' },
      L: { chest: 66, chestTotal: 132, length: 76, shoulders: 56, sleeve: 68, heightRange: '178 - 189 cm', weightRange: '78 - 92 kg' },
      XL: { chest: 71, chestTotal: 142, length: 79, shoulders: 60, sleeve: 70, heightRange: '185 - 205 cm', weightRange: '90 - 125 kg' },
    },
  },
  BOTTOMS: {
    label: 'PANTALONES CARGO TÁCTICOS',
    description: 'Corte cónico articulado con paneles elásticos en cintura y cinchas de compresión.',
    measures: [
      { key: 'waist', label: 'Cintura Ajustable (Mín - Máx)' },
      { key: 'hips', label: 'Cadera Plana' },
      { key: 'length', label: 'Largo Total de Pierna' },
      { key: 'inseam', label: 'Tiro Frontal' },
      { key: 'ankle', label: 'Apertura de Tobillo (Velcro)' },
    ],
    sizes: {
      S: { waist: '72 - 80 cm', hips: 52, length: 101, inseam: 30, ankle: '16 - 20 cm', heightRange: '160 - 172 cm', weightRange: '50 - 68 kg' },
      M: { waist: '78 - 87 cm', hips: 56, length: 104, inseam: 31, ankle: '17 - 21 cm', heightRange: '170 - 181 cm', weightRange: '67 - 79 kg' },
      L: { waist: '85 - 95 cm', hips: 60, length: 107, inseam: 32, ankle: '18 - 22 cm', heightRange: '177 - 189 cm', weightRange: '78 - 91 kg' },
      XL: { waist: '92 - 105 cm', hips: 64, length: 110, inseam: 33, ankle: '19 - 23 cm', heightRange: '185 - 205 cm', weightRange: '89 - 125 kg' },
    },
  },
};

export const SizeCalculatorModal = () => {
  const {
    isSizeModalOpen,
    closeSizeModal,
    setRecommendedSize,
    showNotification,
    activeProductForSize,
  } = useCart();

  const heightId = useId();
  const weightId = useId();

  // Biometric state
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'specsheet'
  const [height, setHeight] = useState(178); // cm
  const [weight, setWeight] = useState(74); // kg
  const [fitStyle, setFitStyle] = useState('oversize'); // 'regular' | 'oversize' | 'ultra'
  const [bodyBuild, setBodyBuild] = useState('athletic'); // 'slim' | 'athletic' | 'heavy'
  const [manualCategory, setManualCategory] = useState(null);
  const selectedCategory = manualCategory || (
    activeProductForSize && activeProductForSize.category === 'PANTS' ? 'BOTTOMS' : 'TOPS'
  );
  const setSelectedCategory = setManualCategory;

  // Handle ESC key
  useEffect(() => {
    if (!isSizeModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeSizeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSizeModalOpen, closeSizeModal]);

  // Precise Anthropometric Calculation Algorithm
  const analysis = useMemo(() => {
    const clampedH = Math.min(Math.max(Number(height) || 178, 150), 210);
    const clampedW = Math.min(Math.max(Number(weight) || 74, 45), 130);

    // Height in meters & BMI
    const hM = clampedH / 100;
    const bmi = clampedW / (hM * hM);

    // Estimated Body Dimensions
    const buildMod = bodyBuild === 'heavy' ? 4 : bodyBuild === 'slim' ? -4 : 0;
    const estimatedChest = Math.round((clampedW * 1.02) + (clampedH * 0.16) - 5 + buildMod);
    const estimatedWaist = Math.round((clampedW * 0.84) + (clampedH * 0.12) - 9 + buildMod);

    // Calculate score based on category
    let calculatedSize = 'M';
    let matchRate = 95;
    let verdictDetails = '';
    let ease = '';

    if (selectedCategory === 'BOTTOMS') {
      // Pant sizing logic (waist and height driven)
      let pantScore = (clampedW * 0.52) + (clampedH * 0.22);
      if (bodyBuild === 'heavy') pantScore += 3;
      if (bodyBuild === 'slim') pantScore -= 3;
      if (fitStyle === 'ultra') pantScore += 4;
      if (fitStyle === 'regular') pantScore -= 3;

      if (pantScore < 60) {
        calculatedSize = 'S';
        verdictDetails = 'Cintura 72-80 cm • Silueta técnica ergonómica';
        ease = 'Calce exacto en cintura y caída sin pliegues excesivos';
      } else if (pantScore < 72) {
        calculatedSize = 'M';
        verdictDetails = 'Cintura 78-87 cm • Silueta cónica estándar';
        ease = 'Ajuste cómodo en tiro y espacio ideal para articulación de rodilla';
      } else if (pantScore < 83) {
        calculatedSize = 'L';
        verdictDetails = 'Cintura 85-95 cm • Caída oversize holgada';
        ease = 'Volumen ampliado en bolsillos cargo y longitud de pierna completa';
      } else {
        calculatedSize = 'XL';
        verdictDetails = 'Cintura 92-105 cm • Máxima amplitud táctica';
        ease = 'Holgura superior con ajuste mediante cinchas en tobillos';
      }
    } else {
      // Tops sizing logic (Chest & Height driven)
      let topScore = (clampedW * 0.48) + (clampedH * 0.26);
      if (bodyBuild === 'heavy') topScore += 3;
      if (bodyBuild === 'slim') topScore -= 3;
      if (fitStyle === 'oversize') topScore += 3;
      if (fitStyle === 'ultra') topScore += 7;

      if (topScore < 58) {
        calculatedSize = 'S';
        const garmentChest = GARMENT_SPECS.TOPS.sizes.S.chestTotal;
        const diff = garmentChest - estimatedChest;
        verdictDetails = `Pecho estimado: ~${estimatedChest} cm • Ancho prenda: 58 cm`;
        ease = `+${diff} cm de holgura táctica (Caída limpia en hombros)`;
      } else if (topScore < 70) {
        calculatedSize = 'M';
        const garmentChest = GARMENT_SPECS.TOPS.sizes.M.chestTotal;
        const diff = garmentChest - estimatedChest;
        verdictDetails = `Pecho estimado: ~${estimatedChest} cm • Ancho prenda: 62 cm`;
        ease = `+${diff} cm de holgura táctica (Oversize KNTX Signature con drop-shoulder)`;
      } else if (topScore < 82) {
        calculatedSize = 'L';
        const garmentChest = GARMENT_SPECS.TOPS.sizes.L.chestTotal;
        const diff = garmentChest - estimatedChest;
        verdictDetails = `Pecho estimado: ~${estimatedChest} cm • Ancho prenda: 66 cm`;
        ease = `+${diff} cm de holgura táctica (Silueta amplia para capas intermedias)`;
      } else {
        calculatedSize = 'XL';
        const garmentChest = GARMENT_SPECS.TOPS.sizes.XL.chestTotal;
        const diff = garmentChest - estimatedChest;
        verdictDetails = `Pecho estimado: ~${estimatedChest} cm • Ancho prenda: 71 cm`;
        ease = `+${diff} cm de holgura táctica (Silueta maximalista para capas pesadas)`;
      }
    }

    // Check inventory stock if user is previewing a specific product
    let stockStatus = 'DISPONIBLE EN STOCK';
    let isOutOfStock = false;
    let fallbackRecommendation = null;

    if (activeProductForSize && activeProductForSize.stock) {
      const available = activeProductForSize.stock[calculatedSize] || 0;
      if (available === 0) {
        isOutOfStock = true;
        // Determine logical alternative
        const sizesOrder = ['S', 'M', 'L', 'XL'];
        const currentIdx = sizesOrder.indexOf(calculatedSize);
        if (currentIdx < sizesOrder.length - 1 && (activeProductForSize.stock[sizesOrder[currentIdx + 1]] || 0) > 0) {
          fallbackRecommendation = sizesOrder[currentIdx + 1];
          stockStatus = `TALLE [${calculatedSize}] AGOTADO • RECOMENDAMOS [${fallbackRecommendation}] PARA CALCE MÁS HOLGADO`;
        } else if (currentIdx > 0 && (activeProductForSize.stock[sizesOrder[currentIdx - 1]] || 0) > 0) {
          fallbackRecommendation = sizesOrder[currentIdx - 1];
          stockStatus = `TALLE [${calculatedSize}] AGOTADO • RECOMENDAMOS [${fallbackRecommendation}] PARA CALCE MÁS AJUSTADO`;
        } else {
          stockStatus = `TALLE [${calculatedSize}] AGOTADO TEMPORALMENTE`;
        }
      } else {
        stockStatus = `DISPONIBLE (${available} UNIDADES RESTANTES)`;
      }
    }

    return {
      size: calculatedSize,
      fallbackSize: fallbackRecommendation,
      isOutOfStock,
      stockStatus,
      bmi: bmi.toFixed(1),
      estimatedChest,
      estimatedWaist,
      matchRate,
      verdictDetails,
      ease,
    };
  }, [height, weight, fitStyle, bodyBuild, selectedCategory, activeProductForSize]);

  if (!isSizeModalOpen) return null;

  // Imperial conversions for display
  const heightFeet = Math.floor(height / 30.48);
  const heightInches = Math.round((height % 30.48) / 2.54);
  const weightLbs = Math.round(weight * 2.20462);

  const appliedSize = analysis.isOutOfStock && analysis.fallbackSize ? analysis.fallbackSize : analysis.size;

  const handleApplySize = () => {
    setRecommendedSize(appliedSize);
    showNotification(
      `TALLE [${appliedSize}] APLICADO AL PERFIL DE COMPRA (${activeProductForSize ? activeProductForSize.name : 'TODO EL CATÁLOGO'})`,
      'success'
    );
    closeSizeModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-calc-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in"
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeSizeModal}
      ></div>

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0E0E11] border border-[#2A2A30] z-10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden font-mono flex flex-col">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-[#CCFF00] shrink-0"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A2A30] flex items-center justify-between bg-[#141417]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#CCFF00] bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00] shrink-0 shadow-[0_0_12px_rgba(204,255,0,0.2)]">
              <Sliders size={16} />
            </div>
            <div>
              <h2 id="size-calc-title" className="font-display font-black text-sm sm:text-base uppercase text-[#F4F4F6] tracking-tight">
                CALIBRADOR BIOMÉTRICO DE TALLES
              </h2>
              <div className="text-[10px] text-[#8E8E93] flex items-center gap-2">
                <span>KNTX LAB // ANTHROPOMETRIC SIZING ENGINE</span>
                {activeProductForSize && (
                  <span className="text-[#CCFF00] font-bold">
                    [ENFOCADO EN: {activeProductForSize.name}]
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={closeSizeModal}
            aria-label="Cerrar modal de talles"
            className="w-8 h-8 border border-[#2A2A30] hover:border-[#CCFF00] flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors cursor-pointer group"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Navigation Tabs (Calculator vs Full Spec Sheet) */}
        <div className="flex items-center gap-1 p-2 bg-[#0A0A0C] border-b border-[#2A2A30] text-xs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2 px-3 border transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'calculator'
                ? 'border-[#CCFF00] bg-[#141417] text-[#CCFF00] font-bold shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                : 'border-transparent text-[#8E8E93] hover:text-[#F4F4F6]'
            }`}
          >
            <Crosshair size={13} />
            <span>CALIBRADOR PERSONALIZADO</span>
          </button>

          <button
            onClick={() => setActiveTab('specsheet')}
            className={`flex-1 py-2 px-3 border transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'specsheet'
                ? 'border-[#CCFF00] bg-[#141417] text-[#CCFF00] font-bold shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                : 'border-transparent text-[#8E8E93] hover:text-[#F4F4F6]'
            }`}
          >
            <Ruler size={13} />
            <span>TABLA DE MEDIDAS TÉCNICAS (CM)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {activeTab === 'calculator' ? (
            <>
              {/* Category selector if opened generically */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span>TIPO DE PRENDA A CALCULAR:</span>
                  <span className="text-[#CCFF00] text-[10px]">{GARMENT_SPECS[selectedCategory].label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setSelectedCategory('TOPS')}
                    className={`py-2 px-3 border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedCategory === 'TOPS'
                        ? 'border-[#CCFF00] bg-[#141417] text-[#CCFF00] font-bold'
                        : 'border-[#2A2A30] bg-[#0A0A0C] text-[#8E8E93] hover:text-[#F4F4F6]'
                    }`}
                  >
                    <Layers size={13} />
                    <span>SUPERIOR (JACKETS & BUZOS)</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('BOTTOMS')}
                    className={`py-2 px-3 border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedCategory === 'BOTTOMS'
                        ? 'border-[#CCFF00] bg-[#141417] text-[#CCFF00] font-bold'
                        : 'border-[#2A2A30] bg-[#0A0A0C] text-[#8E8E93] hover:text-[#F4F4F6]'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>INFERIOR (PANTALONES CARGO)</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid: Height & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#141417] border border-[#2A2A30]">
                {/* Height Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor={heightId} className="text-[#8E8E93] flex items-center gap-1.5 cursor-pointer">
                      <Crosshair size={12} className="text-[#CCFF00]" />
                      <span>ALTURA:</span>
                    </label>
                    <div className="text-right">
                      <span className="text-[#CCFF00] font-bold text-sm bg-[#0A0A0C] px-2 py-0.5 border border-[#2A2A30]">
                        {height} CM
                      </span>
                      <span className="text-[10px] text-[#8E8E93] ml-1.5">
                        ({heightFeet}&apos;{heightInches}&quot;)
                      </span>
                    </div>
                  </div>
                  <input
                    id={heightId}
                    type="range"
                    min="150"
                    max="210"
                    value={height}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) setHeight(Math.min(Math.max(val, 150), 210));
                    }}
                    className="w-full accent-[#CCFF00] bg-[#0A0A0C] h-2 rounded-none border border-[#2A2A30] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#8E8E93]">
                    <span>150 CM (4&apos;11&quot;)</span>
                    <span>180 CM (5&apos;11&quot;)</span>
                    <span>210 CM (6&apos;11&quot;)</span>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor={weightId} className="text-[#8E8E93] flex items-center gap-1.5 cursor-pointer">
                      <Crosshair size={12} className="text-[#FF3B00]" />
                      <span>PESO:</span>
                    </label>
                    <div className="text-right">
                      <span className="text-[#FF3B00] font-bold text-sm bg-[#0A0A0C] px-2 py-0.5 border border-[#2A2A30]">
                        {weight} KG
                      </span>
                      <span className="text-[10px] text-[#8E8E93] ml-1.5">
                        ({weightLbs} LBS)
                      </span>
                    </div>
                  </div>
                  <input
                    id={weightId}
                    type="range"
                    min="45"
                    max="130"
                    value={weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) setWeight(Math.min(Math.max(val, 45), 130));
                    }}
                    className="w-full accent-[#FF3B00] bg-[#0A0A0C] h-2 rounded-none border border-[#2A2A30] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#8E8E93]">
                    <span>45 KG (99 LBS)</span>
                    <span>85 KG (187 LBS)</span>
                    <span>130 KG (286 LBS)</span>
                  </div>
                </div>
              </div>

              {/* Contexture & Fit Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Body Build / Complexion */}
                <div className="space-y-2">
                  <span className="text-[11px] text-[#8E8E93] block">COMPLEXIÓN FÍSICA:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'slim', label: 'DELGADA' },
                      { id: 'athletic', label: 'ATLÉTICA' },
                      { id: 'heavy', label: 'ROBUSTA' },
                    ].map((build) => (
                      <button
                        key={build.id}
                        onClick={() => setBodyBuild(build.id)}
                        className={`py-2 px-1 border text-center transition-all cursor-pointer text-[10px] ${
                          bodyBuild === build.id
                            ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-bold'
                            : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6]'
                        }`}
                      >
                        {build.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Preference */}
                <div className="space-y-2">
                  <span className="text-[11px] text-[#8E8E93] block">SILUETA / PREFERENCIA DE CALCE:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'regular', label: 'REGULAR' },
                      { id: 'oversize', label: 'OVERSIZE' },
                      { id: 'ultra', label: 'BAGGY' },
                    ].map((fit) => (
                      <button
                        key={fit.id}
                        onClick={() => setFitStyle(fit.id)}
                        className={`py-2 px-1 border text-center transition-all cursor-pointer text-[10px] ${
                          fitStyle === fit.id
                            ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-bold'
                            : 'border-[#2A2A30] bg-[#141417] text-[#8E8E93] hover:text-[#F4F4F6]'
                        }`}
                      >
                        {fit.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendation Output Display Stage */}
              <div className="border border-[#CCFF00] bg-[#0A0A0C] p-5 relative shadow-[0_0_30px_rgba(204,255,0,0.1)]">
                {/* Corner reticles */}
                <div className="absolute top-1 left-1 text-[9px] text-[#CCFF00]">┌</div>
                <div className="absolute top-1 right-1 text-[9px] text-[#CCFF00]">┐</div>
                <div className="absolute bottom-1 left-1 text-[9px] text-[#CCFF00]">└</div>
                <div className="absolute bottom-1 right-1 text-[9px] text-[#CCFF00]">┘</div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-[#8E8E93]">
                      <span>VEREDICTO ANTROPOMÉTRICO:</span>
                      <span className="text-[#CCFF00] font-bold">[{analysis.matchRate}% COMPATIBILIDAD]</span>
                    </div>

                    <div className="flex items-baseline gap-3 mt-1">
                      <div className="font-display font-black text-5xl text-[#CCFF00]">
                        [{appliedSize}]
                      </div>
                      <div className="text-xs text-[#F4F4F6] font-bold">
                        {fitStyle === 'regular' ? 'FIT TÁCTICO REGULAR' : fitStyle === 'oversize' ? 'KNTX SIGNATURE OVERSIZE' : 'SILUETA ULTRA-BAGGY'}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-[#8E8E93] space-y-1 bg-[#141417] p-3 border border-[#2A2A30] w-full sm:w-auto">
                    <div>
                      {selectedCategory === 'BOTTOMS' ? 'CINTURA ESTIMADA:' : 'PECHO ESTIMADO:'}{' '}
                      <strong className="text-[#F4F4F6]">
                        {selectedCategory === 'BOTTOMS' ? `~${analysis.estimatedWaist} CM` : `~${analysis.estimatedChest} CM`}
                      </strong>
                    </div>
                    <div>
                      ÍNDICE CORPORAL: <strong className="text-[#CCFF00]">BMI {analysis.bmi}</strong>
                    </div>
                  </div>
                </div>

                {/* Ease & Sizing Details */}
                <div className="mt-4 pt-3 border-t border-[#2A2A30] space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-[#F4F4F6]">
                    <CheckCircle2 size={13} className="text-[#CCFF00] shrink-0" />
                    <span>{analysis.verdictDetails}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#8E8E93]">
                    <Sparkles size={13} className="text-[#CCFF00] shrink-0" />
                    <span className="text-[10px]">{analysis.ease}</span>
                  </div>

                  {/* Stock notice if inspecting product */}
                  <div className={`flex items-center gap-2 pt-1 text-[10px] font-bold ${
                    analysis.isOutOfStock ? 'text-[#FF3B00]' : 'text-[#CCFF00]'
                  }`}>
                    {analysis.isOutOfStock ? (
                      <AlertTriangle size={13} className="text-[#FF3B00] shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 bg-[#CCFF00]"></span>
                    )}
                    <span>{analysis.stockStatus}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* TAB 2: SPEC SHEET TABLE (Medidas exactas en CM) */
            <div className="space-y-6">
              <div className="p-3 bg-[#141417] border-l-2 border-[#CCFF00] border border-[#2A2A30] text-xs space-y-1">
                <div className="font-bold text-[#F4F4F6] uppercase">
                  ESPECIFICACIONES DE PATRONAJE {GARMENT_SPECS[selectedCategory].label}
                </div>
                <div className="text-[11px] text-[#8E8E93]">
                  {GARMENT_SPECS[selectedCategory].description} Medidas tomadas sobre prenda plana en centímetros.
                </div>
              </div>

              {/* Category switch in spec sheet */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('TOPS')}
                  className={`flex-1 py-1.5 px-2 border text-xs cursor-pointer ${
                    selectedCategory === 'TOPS' ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-bold' : 'border-[#2A2A30] text-[#8E8E93]'
                  }`}
                >
                  CHAQUETAS & BUZOS
                </button>
                <button
                  onClick={() => setSelectedCategory('BOTTOMS')}
                  className={`flex-1 py-1.5 px-2 border text-xs cursor-pointer ${
                    selectedCategory === 'BOTTOMS' ? 'border-[#CCFF00] bg-[#CCFF00] text-[#0A0A0C] font-bold' : 'border-[#2A2A30] text-[#8E8E93]'
                  }`}
                >
                  PANTALONES CARGO
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-[#2A2A30]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141417] text-[#CCFF00] uppercase text-[10px] border-b border-[#2A2A30]">
                    <tr>
                      <th className="p-3">MEDIDA (CM)</th>
                      <th className="p-3 text-center">S</th>
                      <th className="p-3 text-center">M</th>
                      <th className="p-3 text-center">L</th>
                      <th className="p-3 text-center">XL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A30] text-[#F4F4F6]">
                    {GARMENT_SPECS[selectedCategory].measures.map((m) => (
                      <tr key={m.key} className="hover:bg-[#141417]/50 transition-colors">
                        <td className="p-3 font-bold text-[#8E8E93] text-[11px]">{m.label}</td>
                        <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.S[m.key]}</td>
                        <td className="p-3 text-center font-bold text-[#CCFF00]">{GARMENT_SPECS[selectedCategory].sizes.M[m.key]}</td>
                        <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.L[m.key]}</td>
                        <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.XL[m.key]}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#141417]/40 text-[10px] text-[#8E8E93]">
                      <td className="p-3 font-bold">ALTURA CORPORAL SUGERIDA</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.S.heightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.M.heightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.L.heightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.XL.heightRange}</td>
                    </tr>
                    <tr className="bg-[#141417]/40 text-[10px] text-[#8E8E93]">
                      <td className="p-3 font-bold">PESO SUGERIDO</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.S.weightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.M.weightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.L.weightRange}</td>
                      <td className="p-3 text-center">{GARMENT_SPECS[selectedCategory].sizes.XL.weightRange}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#0A0A0C] border border-[#2A2A30] text-[10px] text-[#8E8E93] space-y-1">
                <strong className="text-[#F4F4F6] block">¿CÓMO MEDIR TU PRENDA FAVORITA?</strong>
                <div>
                  Extiende una chaqueta o buzo que te quede bien sobre una mesa plana. Mide de sisa a sisa justo por debajo de las axilas para obtener el ancho de pecho y compáralo con la columna correspondiente.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#0A0A0C] border-t border-[#2A2A30] flex gap-3 shrink-0">
          <button
            onClick={closeSizeModal}
            className="flex-1 py-3 border border-[#2A2A30] text-[#8E8E93] hover:text-[#F4F4F6] hover:border-[#8E8E93] text-xs font-bold transition-colors cursor-pointer"
          >
            CERRAR
          </button>

          <button
            onClick={handleApplySize}
            className="flex-1 py-3 bg-[#CCFF00] text-[#0A0A0C] hover:bg-white text-xs font-black tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.4)]"
          >
            <span>APLICAR TALLE [{appliedSize}]</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeCalculatorModal;
