export default function LogoMark({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lm-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5c842" />
          <stop offset="100%" stopColor="#d4622a" />
        </linearGradient>
        <linearGradient id="lm-soft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5c842" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d4622a" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* ── Outer 8-pointed star (two squares) ── */}
      <rect x="44" y="44" width="112" height="112" rx="6"
            fill="url(#lm-soft)" stroke="url(#lm-gold)" strokeWidth="2" />
      <rect x="44" y="44" width="112" height="112" rx="6"
            fill="url(#lm-soft)" stroke="url(#lm-gold)" strokeWidth="2"
            transform="rotate(45 100 100)" />

      {/* ── Inner decorative ring ── */}
      <circle cx="100" cy="100" r="44" stroke="url(#lm-gold)" strokeWidth="1.2"
              strokeDasharray="4 3" fill="none" opacity="0.5" />

      {/* ── Crescent moon (two overlapping circles — works on dark bg) ── */}
      <circle cx="95" cy="100" r="30" fill="url(#lm-gold)" />
      <circle cx="109" cy="96" r="23" fill="#0a0d17" />

      {/* ── Small 5-pointed star beside crescent ── */}
      <polygon
        points="138,70 140.8,78.6 149.8,78.6 142.5,83.9 145.3,92.5 138,87.2 130.7,92.5 133.5,83.9 126.2,78.6 135.2,78.6"
        fill="url(#lm-gold)"
        transform="scale(0.72) translate(55, 18)"
      />

      {/* ── 8 corner dots ── */}
      {[
        [100, 44], [156, 100], [100, 156], [44, 100],
        [139.2, 60.8], [139.2, 139.2], [60.8, 139.2], [60.8, 60.8],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill="url(#lm-gold)" />
      ))}
    </svg>
  );
}
