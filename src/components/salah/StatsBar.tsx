'use client';

interface Props {
  onTime: number;
  late: number;
  missed: number;
}

export default function StatsBar({ onTime, late, missed }: Props) {
  const total = onTime + late + missed;

  const cards = [
    { label: 'بوقتها', value: onTime, color: 'from-green-600/30 to-green-700/20', border: 'border-green-500/30', text: 'text-green-400', icon: '✅' },
    { label: 'تأخرت',  value: late,   color: 'from-amber-600/30 to-amber-700/20', border: 'border-amber-500/30', text: 'text-amber-400', icon: '⏰' },
    { label: 'فائتة',  value: missed, color: 'from-red-700/30 to-red-800/20',     border: 'border-red-500/30',   text: 'text-red-400',   icon: '❌' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {cards.map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} border ${c.border} rounded-2xl p-4 text-center`}>
            <p className="text-2xl mb-1">{c.icon}</p>
            <p className={`${c.text} text-2xl font-bold`}>{c.value}</p>
            <p className="text-ow-sand/60 text-xs mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div>
          <div className="flex justify-between text-ow-sand/60 text-xs mb-1">
            <span>نسبة الالتزام بالوقت</span>
            <span>{Math.round((onTime / total) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${(onTime / 35) * 100}%` }} />
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${(late / 35) * 100}%` }} />
            <div className="h-full bg-red-600 transition-all"   style={{ width: `${(missed / 35) * 100}%` }} />
          </div>
          <div className="flex justify-between text-ow-sand/40 text-xs mt-1">
            <span>من 35 صلاة في الأسبوع</span>
          </div>
        </div>
      )}
    </div>
  );
}
