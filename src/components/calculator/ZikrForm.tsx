'use client';

interface Props {
  zikrText: string;
  secondsPerZikr: string;
  onZikrTextChange: (v: string) => void;
  onSecondsChange: (v: string) => void;
  onCalculate: () => void;
  errors: string[];
}

export default function ZikrForm({
  zikrText,
  secondsPerZikr,
  onZikrTextChange,
  onSecondsChange,
  onCalculate,
  errors,
}: Props) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-white/80 text-sm">اسم الذكر</label>
        <input
          type="text"
          value={zikrText}
          onChange={e => onZikrTextChange(e.target.value)}
          placeholder="مثال: سبحان الله"
          className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors"
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/80 text-sm">الوقت اللازم لقراءة الذكر مرة واحدة (بالثواني)</label>
        <input
          type="number"
          value={secondsPerZikr}
          onChange={e => onSecondsChange(e.target.value)}
          placeholder="مثال: 3"
          min="0.1"
          step="0.1"
          className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors"
        />
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-red-300 text-sm">⚠️ {e}</p>
          ))}
        </div>
      )}

      <button
        onClick={onCalculate}
        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl py-3 font-bold text-lg transition-all"
      >
        احسب
      </button>
    </div>
  );
}
