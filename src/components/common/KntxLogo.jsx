import React from 'react';

/**
 * KNTX [LAB] Official Brand Identity Component
 * Architected for precision rendering, responsive scaling, and zero layout shift.
 *
 * @param {'lockup' | 'symbol' | 'wordmark'} variant - Layout format
 * @param {'color' | 'mono-white' | 'mono-black' | 'volt'} theme - Color scheme
 * @param {string} className - Optional styling classes
 */
export const KntxLogo = ({
  variant = 'lockup',
  theme = 'color',
  className = '',
  ...props
}) => {
  // Palette definitions
  const getColors = () => {
    switch (theme) {
      case 'mono-white':
        return {
          primary: '#F4F4F6',
          accent: '#F4F4F6',
          secondary: '#F4F4F6',
          divider: '#F4F4F6',
        };
      case 'mono-black':
        return {
          primary: '#0A0A0C',
          accent: '#0A0A0C',
          secondary: '#0A0A0C',
          divider: '#0A0A0C',
        };
      case 'volt':
        return {
          primary: '#CCFF00',
          accent: '#CCFF00',
          secondary: '#CCFF00',
          divider: '#CCFF00',
        };
      case 'color':
      default:
        return {
          primary: '#F4F4F6',
          accent: '#CCFF00',
          secondary: '#8E8E93',
          divider: '#F4F4F6',
        };
    }
  };

  const colors = getColors();

  // Standalone Kinetic Beam Symbol
  if (variant === 'symbol') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="none"
        aria-label="KNTX LAB Symbol"
        className={`inline-block shrink-0 ${className}`}
        {...props}
      >
        <title>KNTX LAB Symbol</title>
        {/* Monolithic Vertical Pillar with 45° chamfer */}
        <path d="M44 60 L68 36 H96 V220 H44 V60 Z" fill={colors.primary} />
        {/* Upper Arm White Beam */}
        <polygon points="112,120 196,36 156,36 112,80" fill={colors.primary} />
        {/* Volt Energy Apex Triangle */}
        <polygon points="168,36 216,36 216,84" fill={colors.accent} />
        {/* Lower Strut White Beam */}
        <polygon points="112,136 196,220 156,220 112,176" fill={colors.primary} />
        {/* Secondary Stabilizer Chevron */}
        <polygon points="172,220 216,220 216,176" fill={colors.secondary} />
      </svg>
    );
  }

  // Standalone Geometric Wordmark: KNTX [LAB]
  if (variant === 'wordmark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 810 128"
        fill="none"
        aria-label="KNTX [LAB] Wordmark"
        className={`inline-block shrink-0 ${className}`}
        {...props}
      >
        <title>KNTX LAB</title>
        {/* K */}
        <polygon points="0,0 26,0 26,128 0,128" fill={colors.primary} />
        <polygon points="26,64 90,0 126,0 62,64 126,128 90,128 26,64" fill={colors.primary} />

        {/* N */}
        <polygon points="144,0 170,0 226,128 200,128" fill={colors.primary} />
        <polygon points="144,0 170,0 170,128 144,128" fill={colors.primary} />
        <polygon points="200,0 226,0 226,128 200,128" fill={colors.primary} />

        {/* T */}
        <polygon points="244,0 344,0 344,24 307,24 307,128 281,128 281,24 244,24" fill={colors.primary} />

        {/* X */}
        <polygon points="360,0 396,0 492,96 492,128 456,128 360,32" fill={colors.primary} />
        <polygon points="456,0 492,0 360,128 360,96 396,96" fill={colors.primary} />

        {/* [LAB] */}
        <path d="M524 16 H542 V32 H536 V96 H542 V112 H524 Z" fill={colors.accent} />
        <polygon points="554,32 568,32 568,96 600,96 600,112 554,112" fill={colors.accent} />
        <path fillRule="evenodd" d="M624 32 H640 L666 112 H648 L642 94 H622 L616 112 H598 L624 32 Z M627 78 H637 L632 58 Z" fill={colors.accent} />
        <path fillRule="evenodd" d="M678 32 H710 C722 32 730 38 730 48 C730 54 726 60 718 64 C728 68 734 76 734 88 C734 102 722 112 708 112 H678 V32 Z M694 48 V62 H706 C712 62 716 58 716 55 C716 51 712 48 706 48 Z M694 78 V96 H708 C714 96 718 92 718 87 C718 82 714 78 708 78 Z" fill={colors.accent} />
        <path d="M748 16 H766 V112 H748 V96 H754 V32 H748 Z" fill={colors.accent} />
      </svg>
    );
  }

  // Full Horizontal Combination Lockup (Default)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1140 256"
      fill="none"
      aria-label="KNTX [LAB] Brand Logo"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      <title>KNTX LAB</title>

      {/* Kinetic Beam Symbol */}
      <g transform="translate(24, 0)">
        <path d="M44 60 L68 36 H96 V220 H44 V60 Z" fill={colors.primary} />
        <polygon points="112,120 196,36 156,36 112,80" fill={colors.primary} />
        <polygon points="168,36 216,36 216,84" fill={colors.accent} />
        <polygon points="112,136 196,220 156,220 112,176" fill={colors.primary} />
        <polygon points="172,220 216,220 216,176" fill={colors.secondary} />
      </g>

      {/* Structural Divider */}
      <rect x="296" y="56" width="2" height="144" fill={colors.divider} opacity="0.25" />

      {/* Geometric Wordmark KNTX [LAB] */}
      <g transform="translate(324, 64)">
        {/* K */}
        <polygon points="0,0 26,0 26,128 0,128" fill={colors.primary} />
        <polygon points="26,64 90,0 126,0 62,64 126,128 90,128 26,64" fill={colors.primary} />

        {/* N */}
        <polygon points="144,0 170,0 226,128 200,128" fill={colors.primary} />
        <polygon points="144,0 170,0 170,128 144,128" fill={colors.primary} />
        <polygon points="200,0 226,0 226,128 200,128" fill={colors.primary} />

        {/* T */}
        <polygon points="244,0 344,0 344,24 307,24 307,128 281,128 281,24 244,24" fill={colors.primary} />

        {/* X */}
        <polygon points="360,0 396,0 492,96 492,128 456,128 360,32" fill={colors.primary} />
        <polygon points="456,0 492,0 360,128 360,96 396,96" fill={colors.primary} />

        {/* [LAB] */}
        <path d="M524 16 H542 V32 H536 V96 H542 V112 H524 Z" fill={colors.accent} />
        <polygon points="554,32 568,32 568,96 600,96 600,112 554,112" fill={colors.accent} />
        <path fillRule="evenodd" d="M624 32 H640 L666 112 H648 L642 94 H622 L616 112 H598 L624 32 Z M627 78 H637 L632 58 Z" fill={colors.accent} />
        <path fillRule="evenodd" d="M678 32 H710 C722 32 730 38 730 48 C730 54 726 60 718 64 C728 68 734 76 734 88 C734 102 722 112 708 112 H678 V32 Z M694 48 V62 H706 C712 62 716 58 716 55 C716 51 712 48 706 48 Z M694 78 V96 H708 C714 96 718 92 718 87 C718 82 714 78 708 78 Z" fill={colors.accent} />
        <path d="M748 16 H766 V112 H748 V96 H754 V32 H748 Z" fill={colors.accent} />
      </g>
    </svg>
  );
};

export default KntxLogo;

