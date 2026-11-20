'use client';
import { useEffect, useState } from 'react';
import type { GQ } from '@/lib/games';
import { EndScreen, QuestionCard, fetchQ, useFinish } from './kit';

const C = '#d97706', LOCKS = [1, 1, 2, 2, 3];
/** صندوق الكنز: خمسة أقفال متدرجة الصعوبة، ولكل قفل محاولتان */
export default function Treasure() {
  const [qs, setQs] = useState<GQ[]>([]), [lock, setLock] = useState(0), [tries, setTries] = useState(0), [opened, setOpened] = useState(0), [over, setOver] = useState(false);
  const { res, finish, reset } = useFinish('treasure');
  const load = async () => { reset(); setLock(0); setTries(0); setOpened(0); setOver(false); const parts = await Promise.all(LOCKS.map((d) => fetchQ({ d, n: 2 }))); setQs(parts.flat()); };
  useEffect(() => { load(); }, []);
  const q = qs[lock * 2 + tries];
  const end = (o: number) => { setOver(true); finish(o * 2); };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-gradient-to-b from-amber-100 to-amber-50 p-5">
        {LOCKS.map((_, k) => <span key={k} className={`text-4xl transition ${k < opened ? 'scale-110' : k === lock && !over ? 'game-pulse' : 'opacity-50'}`}>{k < opened ? '🔓' : '🔒'}</span>)}
        <span className={`text-6xl ${opened === LOCKS.length ? 'game-pop' : ''}`}>{opened === LOCKS.length ? '💰' : '🧰'}</span>
      </div>
      {over ? <EndScreen title={opened === LOCKS.length ? 'فُتح الكنز!' : 'انتهت المحاولة'} line={`فُتح ${opened} من ${LOCKS.length} أقفال`} correct={opened} total={LOCKS.length} res={res} onAgain={load} color={C} />
        : q && (<>
          <p className="text-center font-bold">القفل {lock + 1} · {['سهل', 'سهل', 'متوسط', 'متوسط', 'صعب'][lock]} · {tries === 0 ? 'المحاولة الأولى' : 'المحاولة الأخيرة'}</p>
          <QuestionCard tone={C} q={q} onDone={(ok) => {
            if (ok) { const o = opened + 1; setOpened(o); setTries(0); if (lock + 1 >= LOCKS.length) end(o); else setLock(lock + 1); }
            else if (tries === 0) setTries(1); else end(opened);
          }} />
        </>)}
    </div>
  );
}
