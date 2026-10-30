import jacketFront from '../assets/jacket-front.webp';
import jacketBack from '../assets/jacket-back.webp';
import hoodieFront from '../assets/hoodie-front.webp';
import hoodieBack from '../assets/hoodie-back.webp';
import cargoFront from '../assets/cargo-front.webp';
import cargoBack from '../assets/cargo-back.webp';
import lookbook1 from '../assets/lookbook-1.webp';
import lookbook2 from '../assets/lookbook-2.webp';
import vestFront from '../assets/vest-front.webp';
import vestBack from '../assets/vest-back.webp';
import anorakFront from '../assets/anorak-front.webp';
import anorakBack from '../assets/anorak-back.webp';

export const PRODUCTS = [
  {
    id: 'kx-01-windbreaker',
    name: 'TECHWEAR WINDBREAKER',
    code: '1.217',
    ref: 'REF: KX-902',
    category: 'JACKETS',
    price: 130,
    accent: 'volt',
    accentColor: '#CCFF00',
    frontImage: jacketFront,
    backImage: jacketBack,
    techSpecs: [
      'TOCTIER 2 LIMMS MEMBRANE',
      'CARGO PANT CONNECTOR BUCKLES',
      'OVERSIZED MULTI-POCKET RIG',
      'FIDLOCK MAGNETIC SLIDERS',
      'WEATHERPROOF RIPSTOP DWR 20K'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 3, M: 6, L: 2, XL: 1 },
    badge: 'EDICIÓN LIMITADA',
    tag: 'COLOR: VOLT',
    description: 'Chaqueta táctica cortavientos impermeable diseñada para exploración urbana hostil. Equipada con arnés de porteo, sistema MOLLE y parches tácticos intercambiables.',
    featured: true,
  },
  {
    id: 'kx-02-hoodie',
    name: 'HEAVY COTTON HOODIE',
    code: '1.217',
    ref: 'REF: KX-883',
    category: 'HOODIES',
    price: 100,
    accent: 'orange',
    accentColor: '#FF3B00',
    frontImage: hoodieFront,
    backImage: hoodieBack,
    techSpecs: [
      'MULTI-POCKET HOODIE HOOD',
      'ACID-PICK HIGH DENSITY PRINT',
      'SERIGRAFÍA TÉCNICA 420 GSM',
      'TACTICAL DESIGN ARCHITECTURE',
      '100% HEAVY FRENCH TERRY COTTON'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 4, M: 8, L: 5, XL: 2 },
    badge: 'EDICIÓN LIMITADA',
    tag: 'COLOR: TARGET ORANGE',
    description: 'Buzo con capucha confeccionado en algodón pesado de 420 GSM. Tipografía técnica sobredimensionada en espalda, diana balística en verde ácido y bolsillo con división.',
    featured: true,
  },
  {
    id: 'kx-03-cargo',
    name: 'TACTICAL CARGO PANTS',
    code: '2.044',
    ref: 'REF: KX-714',
    category: 'PANTS',
    price: 115,
    accent: 'volt',
    accentColor: '#CCFF00',
    frontImage: cargoFront,
    backImage: cargoBack,
    techSpecs: [
      'MODULAR 8-POCKET CONFIGURATION',
      'NYLON REINFORCED CINCH STRAPS',
      '3M REFLECTIVE PIPING LINES',
      'TEFLON HYDROPHOBIC COATING',
      'ANKLE QUICK-RELEASE VELCRO BUCKLE'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 2, M: 5, L: 3, XL: 1 },
    badge: 'CORE_SPEC',
    tag: '3M_REFLECTIVE',
    description: 'Pantalón cargo de corte técnico estructurado con paneles ergonómicos articulados. Cintas ajustables en muslos y gemelos para modificar la silueta en tiempo real.',
    featured: false,
  },
  {
    id: 'kx-04-modular-set',
    name: 'DEPLOYMENT HOODIE & RIG',
    code: '3.011',
    ref: 'REF: KX-620',
    category: 'HOODIES',
    price: 145,
    accent: 'orange',
    accentColor: '#FF3B00',
    frontImage: lookbook2,
    backImage: lookbook1,
    techSpecs: [
      'OVERSIZE BOX CUT FIT 450 GSM',
      'SYSTEM OVERRIDE BACK GRAPHIC',
      'TACTICAL NYLON STRAP SYSTEM',
      'REINFORCED HEAVY RIBS',
      'REFLECTIVE NEO-KYOTO EMBLEM'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 1, M: 3, L: 2, XL: 1 },
    badge: 'ÚLTIMAS UNIDADES',
    tag: 'NEO-KYOTO SERIE 4',
    description: 'Edición limitada con serigrafía brutalista Neo-Kyoto y arnés táctico multipropósito. Silueta ultra-oversize para capas superiores.',
    featured: false,
  },
  {
    id: 'kx-05-tactical-vest',
    name: 'TACTICAL CHEST RIG VEST',
    code: '4.108',
    ref: 'REF: KX-501',
    category: 'JACKETS',
    price: 95,
    accent: 'volt',
    accentColor: '#CCFF00',
    frontImage: vestFront,
    backImage: vestBack,
    techSpecs: [
      'CORDURA® 1000D BALLISTIC NYLON',
      'FIDLOCK® MAGNETIC V-BUCKLES',
      'LASER-CUT MODULAR MOLLE RIG',
      'ERGONOMIC BREATHABLE 3D MESH',
      'WATER-REPELLENT YKK AQUAGUARD ZIPPERS'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 3, M: 7, L: 4, XL: 2 },
    badge: 'MOLLE RIG',
    tag: 'COLOR: SHADOW VOLT',
    description: 'Chaleco arnés táctico modular de alta resistencia confeccionado en Cordura 1000D. Sistema MOLLE frontal y dorsal cortado por láser con hebillas magnéticas Fidlock para liberación rápida.',
    featured: true,
  },
  {
    id: 'kx-06-storm-anorak',
    name: 'STORM SHELL ANORAK',
    code: '5.092',
    ref: 'REF: KX-440',
    category: 'JACKETS',
    price: 160,
    accent: 'orange',
    accentColor: '#FF3B00',
    frontImage: anorakFront,
    backImage: anorakBack,
    techSpecs: [
      '3-LAYER GORE-TEX PRO MEMBRANE 28K',
      'ASYMMETRIC DUAL STORM FRONT ZIPPER',
      'ARTICULATED STORM HOOD HOODIE',
      'SAFETY TARGET ORANGE ACCENTS',
      'FULLY TAPED WATERPROOF SEAMS'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 4, M: 6, L: 3, XL: 1 },
    badge: 'GORE-TEX 3L',
    tag: 'COLOR: TARGET BLACK',
    description: 'Anorak técnico impermeable de 3 capas diseñado contra lluvia torrencial y vientos extremos de ciudad. Cremallera frontal asimétrica sellada y bolsillo canguro de despliegue rápido.',
    featured: true,
  }
];

export const LOOKBOOK_GALLERY = [
  {
    id: 'look-1',
    title: 'PANTALÓN CARGO 3M REFLECT',
    ref: 'SPEC_01',
    image: lookbook1,
    caption: 'DETALLE DE SILUETA ARTICULADA Y CALZADO TÁCTICO'
  },
  {
    id: 'look-2',
    title: 'BUZO OVERSIZE 420 GSM',
    ref: 'SPEC_02',
    image: lookbook2,
    caption: 'SERIGRAFÍA INDUSTRIAL EN ESPALDA • NEO-KYOTO DIVISION'
  }
];
