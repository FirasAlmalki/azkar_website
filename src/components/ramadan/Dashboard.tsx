'use client';

interface Stats {
  total: number;
  completed: number;
  remaining: number;
  completedDays: number;
  remainingDays: number;
}

interface Props {
  stats: Stats;
}

export default function Dashboard({ stats }: Props) {
  const cards = [
    { label: 'الأيام المتبقية', value: stats.remainingDays, color: 'from-blue-500/30 to-blue-600/20' },
    { label: 'الأوراد المكتملة', value: stats.completed, color: 'from-green-500/30 to-green-600/20' },
    { label: 'الأوراد المتبقية', value: stats.remaining, color: 'from-amber-500/30 to-amber-600/20' },
  ];

  const pct = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {cards.map(card => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} border border-white/20 rounded-2xl p-4 text-center`}
          >
            <p className="text-white text-2xl font-bold">{card.value}</p>
            <p className="text-white/70 text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-white/70 text-xs mb-1">
          <span>التقدم الكلي</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
