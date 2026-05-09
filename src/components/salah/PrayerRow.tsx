'use client';

import { useState } from 'react';
import {
  PrayerName, PrayerStatus,
  PRAYER_LABELS, PRAYER_EMOJIS,
} from '@/hooks/usePrayerTracker';
import MissedWarning from './MissedWarning';

interface Props {
  prayer: PrayerName;
  status: PrayerStatus;
  disabled: boolean; // future day
  onSet: (status: PrayerStatus) => void;
}

const STATUS_STYLES: Record<PrayerStatus, string> = {
  on_time: 'bg-green-600/80 border-green-400/60 text-white',
  late:    'bg-amber-600/80 border-amber-400/60 text-white',
  missed:  'bg-red-700/80 border-red-500/60 text-white',
  pending: 'bg-white/5 border-white/10 text-ow-sand/50',
};

const STATUS_LABEL: Record<PrayerStatus, string> = {
  on_time: '✅ بوقتها',
  late:    '⏰ تأخرت',
  missed:  '❌ لم أصلِّ',
  pending: '—',
};

export default function PrayerRow({ prayer, status, disabled, onSet }: Props) {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PrayerStatus | null>(null);

  const handleClick = (s: PrayerStatus) => {
    if (disabled) return;
    if (s === 'missed') {
      setPendingStatus(s);
      setShowWarning(true);
    } else {
      onSet(s);
    }
  };

  const confirmMissed = () => {
    if (pendingStatus) onSet(pendingStatus);
    setShowWarning(false);
    setPendingStatus(null);
  };

  const buttons: { s: PrayerStatus; label: string }[] = [
    { s: 'on_time', label: '✅ بوقتها' },
    { s: 'late',    label: '⏰ تأخرت' },
    { s: 'missed',  label: '❌ لم أصلِّ' },
  ];

  return (
    <>
      {showWarning && (
        <MissedWarning
          onConfirm={confirmMissed}
          onCancel={() => { setShowWarning(false); setPendingStatus(null); }}
        />
      )}
      <div className={`flex items-center gap-3 py-2 ${disabled ? 'opacity-40' : ''}`}>
        {/* Prayer name */}
        <div className="w-24 flex items-center gap-1 shrink-0">
          <span className="text-lg">{PRAYER_EMOJIS[prayer]}</span>
          <span className="text-ow-cream text-sm font-medium">{PRAYER_LABELS[prayer]}</span>
        </div>

        {/* Current status badge */}
        <div className={`w-24 text-center text-xs py-1 rounded-full border ${STATUS_STYLES[status]} shrink-0`}>
          {STATUS_LABEL[status]}
        </div>

        {/* Action buttons */}
        {!disabled && (
          <div className="flex gap-1 flex-1 flex-wrap justify-end">
            {buttons.map(({ s, label }) => (
              <button
                key={s}
                onClick={() => handleClick(s)}
                className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                  status === s
                    ? STATUS_STYLES[s]
                    : 'border-white/10 text-ow-sand/50 hover:border-white/30 hover:text-ow-sand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
