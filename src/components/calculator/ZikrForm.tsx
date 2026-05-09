'use client';

interface Props {
  zikrText: string;
  secondsPerZikr: string;
  onZikrTextChange: (v: string) => void;
  onSecondsChange: (v: string) => void;
  onCalculate: () => void;
  errors: string[];
}

export default function ZikrForm({ zikrText, secondsPerZikr, onZikrTextChange, onSecondsChange, onCalculate, errors }: Props) {
  return (
    <div className="ow-card border border-ow-amber/20 rounded-2xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-ow-sand/80 text-sm">اسم الذكر</label>
        <input
          type="text"
          value={zikrText}
          onChange={e => onZikrTextChange(e.target.value)}
          placeholder="مثال: سبحان الله"
          className="ow-input w-full"
          dir="rtl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-ow-sand/80 text-sm">الوقت لقراءة الذكر مرة واحدة (بالثواني)</label>
        <input
          type="number"
          value={secondsPerZikr}
          onChange={e => onSecondsChange(e.target.value)}
          placeholder="مثال: 3"
          min="0.1"
          step="0.1"
          className="ow-input w-full"
        />
      </div>
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-red-400 text-sm">⚠️ {e}</p>
          ))}
        </div>
      )}
      <button onClick={onCalculate} className="ow-btn-primary w-full py-3 rounded-2xl text-lg">
        احسب
      </button>
    </div>
  );
}
