'use client';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MissedWarning({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="ow-card max-w-sm w-full rounded-3xl p-6 border border-red-500/40 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-red-400 text-xl font-bold">تنبيه مهم</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 space-y-2">
            <p className="text-ow-cream text-sm leading-relaxed">
              قال رسول الله ﷺ:
            </p>
            <p className="text-ow-amber font-bold text-base leading-relaxed" dir="rtl">
              "بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلاَةِ"
            </p>
            <p className="text-ow-sand/60 text-xs">رواه مسلم</p>
          </div>
          <p className="text-ow-sand/80 text-sm">
            لا تزال الصلاة في ذمتك — اذهب وصلِّها الآن
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-2 rounded-xl border border-ow-amber/40 text-ow-cream hover:bg-ow-amber/10 transition-all text-sm font-medium"
            >
              رجوع
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-all text-sm font-medium"
            >
              تسجيل كـ"لم أصلِّ"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
