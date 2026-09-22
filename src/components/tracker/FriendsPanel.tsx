'use client';

import { useState } from 'react';
import { useFriends } from '@/hooks/useFriends';

export default function FriendsPanel({ myScore }: { myScore: number }) {
  const { leaderboard, addFriend, removeFriend, loading, error, setError } = useFriends(myScore);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFriend(username);
    setUsername('');
  };

  return (
    <div className="ow-card rounded-2xl p-4 border border-ow-amber/20 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-ow-cream font-bold text-sm">🏆 المنافسة</h2>
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
        {leaderboard.map(f => (
          <div
            key={f.id}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm border ${
              f.isMe ? 'border-ow-amber/40 bg-ow-amber/5' : 'border-white/10'
            }`}
          >
            <span className={f.isMe ? 'text-ow-amber font-bold' : 'text-ow-sand'}>
              {f.isMe ? `أنت (${f.username || '...'})` : f.username}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-ow-cream font-bold">{f.score}%</span>
              {!f.isMe && (
                <button
                  onClick={() => removeFriend(f.id)}
                  className="text-ow-sand/30 hover:text-red-400 text-xs"
                  aria-label="إزالة"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
