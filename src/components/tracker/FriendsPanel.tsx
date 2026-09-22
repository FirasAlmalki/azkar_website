'use client';

import { useState } from 'react';
import { useFriends } from '@/hooks/useFriends';
import type { TrackerItem } from '@/hooks/useDailyTracker';

export default function FriendsPanel({ myScore, items }: { myScore: number; items: TrackerItem[] }) {
  const { leaderboard, addFriend, removeFriend, loading, error, setError } = useFriends(myScore);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFriend(username);
    setUsername('');
  };

  return (
    <div className="ow-card rounded-2xl p-4 border border-ow-amber/20 space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={() => { setShowForm(v => !v); setError(''); }}
          className="w-6 h-6 rounded-full ow-btn-primary flex items-center justify-center text-sm leading-none"
          aria-label="إضافة صديق"
        >
          +
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="flex gap-2">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="ow-input flex-1 text-sm"
            dir="ltr"
          />
          <button type="submit" disabled={loading} className="ow-btn-primary px-3 rounded-xl text-xs disabled:opacity-40">
            إضافة
          </button>
        </form>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="space-y-1.5">
        {leaderboard.map(f => {
          const isOpen = expandedId === f.id;
          return (
            <div
              key={f.id}
              className={`rounded-xl border overflow-hidden ${
                f.isMe ? 'border-ow-amber/40 bg-ow-amber/5' : 'border-white/10'
              }`}
            >
              <button
                onClick={() => !f.isMe && setExpandedId(isOpen ? null : f.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm ${f.isMe ? 'cursor-default' : ''}`}
              >
                <span className={f.isMe ? 'text-ow-amber font-bold' : 'text-ow-sand'}>
                  {f.isMe ? `أنت (${f.username || '...'})` : f.username}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-ow-cream font-bold">{f.score}%</span>
                  {!f.isMe && (
                    <>
                      <span className={`text-ow-sand/40 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                      <span
                        onClick={e => { e.stopPropagation(); removeFriend(f.id); }}
                        className="text-ow-sand/30 hover:text-red-400 text-xs cursor-pointer"
                        role="button"
                        aria-label="إزالة"
                      >
                        ✕
                      </span>
                    </>
                  )}
                </div>
              </button>

              {isOpen && !f.isMe && (
                <div className="px-3 pb-2.5 pt-1 space-y-1 border-t border-white/10">
                  {items.length === 0 ? (
                    <p className="text-ow-sand/40 text-xs py-1">لا توجد عناصر</p>
                  ) : (
                    items.map(item => {
                      const done = f.completedItemIds.includes(item.id);
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs py-0.5">
                          <span className={done ? 'text-ow-sand' : 'text-ow-sand/40'}>{item.label}</span>
                          <span className={done ? 'text-green-400' : 'text-ow-sand/20'}>{done ? '✓' : '—'}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
