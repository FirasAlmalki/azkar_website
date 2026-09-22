'use client';

export default function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="ow-card rounded-2xl p-4 border border-ow-amber/20">
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-ow-cream font-bold">نقاط اليوم</span>
        <span className="text-ow-amber font-bold">{score}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(score, 100)}%`, background: 'linear-gradient(90deg, #e8943a, #d4622a)' }}
        />
      </div>
    </div>
  );
}
