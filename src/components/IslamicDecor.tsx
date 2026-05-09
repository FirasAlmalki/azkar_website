'use client';

/** Single Islamic 8-pointed star (outline) */
function Star8({
  cx, cy, r, strokeWidth = 1, opacity = 0.07, animDuration = 30, reverse = false,
}: {
  cx: number; cy: number; r: number;
  strokeWidth?: number; opacity?: number;
  animDuration?: number; reverse?: boolean;
}) {
  const s = r * 2;
  const off = -r;
  const style: React.CSSProperties = {
    transformOrigin: `${cx}px ${cy}px`,
    animation: `${reverse ? 'ow-spin-r' : 'ow-spin'} ${animDuration}s linear infinite`,
  };

  return (
    <g opacity={opacity} stroke="url(#isl-gold)" strokeWidth={strokeWidth} fill="none">
      <rect x={cx + off} y={cy + off} width={s} height={s} rx={r * 0.08} style={style} />
      <rect x={cx + off} y={cy + off} width={s} height={s} rx={r * 0.08}
            style={{ ...style, animationDelay: '0s' }}
            transform={`rotate(45 ${cx} ${cy})`} />
    </g>
  );
}

/** Arabesque ring: concentric circles with dashes */
function ArabesqueRing({
  cx, cy, r, opacity = 0.06, animDuration = 50,
}: {
  cx: number; cy: number; r: number; opacity?: number; animDuration?: number;
}) {
  const style: React.CSSProperties = {
    transformOrigin: `${cx}px ${cy}px`,
    animation: `ow-spin-r ${animDuration}s linear infinite`,
  };
  return (
    <g opacity={opacity} stroke="url(#isl-gold)" strokeWidth="0.8" fill="none" style={style}>
      <circle cx={cx} cy={cy} r={r} strokeDasharray="6 4" />
      <circle cx={cx} cy={cy} r={r * 0.75} strokeDasharray="4 6" />
      <circle cx={cx} cy={cy} r={r * 0.5} strokeDasharray="3 5" />
    </g>
  );
}

/** 12-pointed star (3 overlapping squares) */
function Star12({
  cx, cy, r, opacity = 0.05, animDuration = 45, reverse = false,
}: {
  cx: number; cy: number; r: number; opacity?: number; animDuration?: number; reverse?: boolean;
}) {
  const s = r * 2;
  const off = -r;
  const base: React.CSSProperties = {
    transformOrigin: `${cx}px ${cy}px`,
    animation: `${reverse ? 'ow-spin-r' : 'ow-spin'} ${animDuration}s linear infinite`,
  };
  return (
    <g opacity={opacity} stroke="url(#isl-gold)" strokeWidth="0.9" fill="none">
      {[0, 30, 60].map(angle => (
        <rect key={angle}
          x={cx + off} y={cy + off} width={s} height={s} rx={r * 0.06}
          style={base}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

export default function IslamicDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="isl-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5c842" />
            <stop offset="100%" stopColor="#e8943a" />
          </linearGradient>
        </defs>

        {/* ── Top-right corner ── */}
        <Star8   cx={92} cy={8}   r={70}  opacity={0.055} animDuration={38} />
        <Star12  cx={90} cy={10}  r={42}  opacity={0.04}  animDuration={55} reverse />

        {/* ── Top-left corner ── */}
        <Star8   cx={8}  cy={12}  r={55}  opacity={0.045} animDuration={44} reverse />
        <ArabesqueRing cx={5} cy={10} r={38} opacity={0.05} animDuration={60} />

        {/* ── Bottom-right ── */}
        <Star8   cx={95} cy={88}  r={65}  opacity={0.05}  animDuration={42} reverse />
        <Star12  cx={92} cy={90}  r={38}  opacity={0.04}  animDuration={50} />

        {/* ── Bottom-left ── */}
        <Star12  cx={8}  cy={90}  r={55}  opacity={0.045} animDuration={35} reverse />
        <ArabesqueRing cx={10} cy={88} r={34} opacity={0.04} animDuration={65} />

        {/* ── Center-top large star ── */}
        <Star8   cx={50} cy={5}   r={90}  opacity={0.025} animDuration={80} />

        {/* ── Mid-left subtle ── */}
        <Star12  cx={2}  cy={50}  r={45}  opacity={0.035} animDuration={70} />

        {/* ── Mid-right subtle ── */}
        <Star8   cx={98} cy={50}  r={40}  opacity={0.04}  animDuration={36} reverse />

        {/* ── Scattered small stars ── */}
        <Star8   cx={30} cy={20}  r={18}  opacity={0.055} animDuration={25} strokeWidth={0.8} />
        <Star8   cx={72} cy={75}  r={14}  opacity={0.06}  animDuration={22} reverse strokeWidth={0.7} />
        <Star8   cx={20} cy={68}  r={16}  opacity={0.05}  animDuration={28} strokeWidth={0.8} />
        <Star8   cx={80} cy={30}  r={12}  opacity={0.07}  animDuration={20} strokeWidth={0.7} />
        <Star8   cx={55} cy={85}  r={10}  opacity={0.06}  animDuration={24} reverse strokeWidth={0.6} />
        <Star8   cx={15} cy={40}  r={11}  opacity={0.055} animDuration={27} strokeWidth={0.7} />

        {/* ── Arabesque accents ── */}
        <ArabesqueRing cx={50} cy={50} r={120} opacity={0.02}  animDuration={90} />
        <ArabesqueRing cx={25} cy={78} r={22}  opacity={0.05}  animDuration={45} />
        <ArabesqueRing cx={78} cy={22} r={18}  opacity={0.055} animDuration={40} />
      </svg>
    </div>
  );
}
