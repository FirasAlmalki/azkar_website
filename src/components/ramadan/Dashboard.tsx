'use client';

interface Stats {
  total: number;
  completed: number;
  remaining: number;
  completedDays: number;
  remainingDays: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
  const pct = Math.round((stats.completed / stats.total) * 100);

  const cards = [
    { label: 'الأيام المتبقية', value: stats.remainingDays, color: 'border-ow-teal/40', text: 'text-ow-teal' },
    { label: 'الأوراد المكتملة', value: stats.completed, color: 'border-green-500/40', text: 'text-green-400' },
    { label: 'الأوراد المتبقية', value: stats.remaining, color: 'border-ow-amber/40', text: 'text-ow-amber' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {cards.map(c => (
          <div key={c.label} className={`ow-card border ${c.color} rounded-2xl p-4 text-center`}>
            <p className={`${c.text} text-2xl font-bold`}>{c.value}</p>
            <p className="text-ow-sand/60 text-xs mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-ow-sand/50 text-xs mb-1">
          <span>التقدم الكلي</span><span>{pct}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #e8943a, #d4622a)' }} />
        </div>
      </div>
    </div>
  );
}
