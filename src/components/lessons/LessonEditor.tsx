'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { newScene, TEMPLATES, totalDuration, type Scenario, type Scene, type Template } from '@/lib/scenario';
import { saveLesson, setLessonStatus } from '@/app/teacher/(panel)/lessons/actions';
import { ScenePlayer } from './ScenePlayer';

interface Lesson { id: string; title: string; skill_id: string | null; status: string; extracted_text: string; concept_summary: string; source_file_path: string | null; scenario_source: 'manual' | 'ai_draft'; scenario: Scenario }

const linesToArr = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

export function LessonEditor({ lesson, skills, aiEnabled }: { lesson: Lesson; skills: { id: string; code: string; name_ar: string }[]; aiEnabled: boolean }) {
  const [l, setL] = useState(lesson);
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; m: string } | null>(null);
  const [busy, setBusy] = useState('');
  const [pending, start] = useTransition();
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [pdfPage, setPdfPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const sb = supabaseBrowser();

  const set = <K extends keyof Lesson>(k: K, v: Lesson[K]) => setL((x) => ({ ...x, [k]: v }));
  const setScenes = (fn: (s: Scene[]) => Scene[]) => setL((x) => ({ ...x, scenario: { scenes: fn(x.scenario.scenes) } }));

  // روابط موقعة مؤقتة لتسجيلات الصوت (التخزين خاص)
  useEffect(() => {
    const paths = l.scenario.scenes.filter((s) => s.audio_path).map((s) => [s.id, s.audio_path!] as const);
    if (!paths.length) { setAudioUrls({}); return; }
    Promise.all(paths.map(async ([id, p]) => [id, (await sb.storage.from('content').createSignedUrl(p, 3600)).data?.signedUrl] as const))
      .then((r) => setAudioUrls(Object.fromEntries(r.filter(([, u]) => u)) as Record<string, string>));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l.scenario.scenes.map((s) => s.audio_path).join('|')]);

  async function uploadAndExtract() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setMsg(null);
    try {
      setBusy('رفع الملف...');
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
      const path = `lessons/${l.id}/source-${Date.now()}.${ext}`;
      const up = await sb.storage.from('content').upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      set('source_file_path', path);
      let text = '';
      if (file.type === 'application/pdf') {
        setBusy('استخراج النص من PDF...');
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        const page = await doc.getPage(Math.min(Math.max(1, pdfPage), doc.numPages));
        const content = await page.getTextContent();
        text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ').replace(/\s+/g, ' ').trim();
        if (!text) text = '(لا يوجد نص قابل للنسخ في هذه الصفحة؛ قد تكون صورة ممسوحة، ويمكن رفعها صورةً.)';
      } else if (file.type.startsWith('image/')) {
        setBusy('قراءة النص من الصورة (OCR) — قد يستغرق دقيقة...');
        const { createWorker } = await import('tesseract.js');
        const w = await createWorker(['ara', 'eng']);
        const r = await w.recognize(file);
        await w.terminate();
        text = r.data.text.trim();
      }
      set('extracted_text', text);
      setMsg({ t: 'ok', m: 'تم الرفع والاستخراج. النص جاهز للمراجعة والتصحيح.' });
    } catch (e) {
      setMsg({ t: 'err', m: 'تعذر الرفع أو الاستخراج: ' + (e as Error).message });
    }
    setBusy('');
  }

  async function aiDraft() {
    if (l.scenario.scenes.length && !confirm('سيستبدل الاقتراح المشاهد الحالية. متابعة؟')) return;
    setBusy('إعداد مسودة السيناريو...'); setMsg(null);
    await doSave(true);
    const r = await fetch('/api/lessons/ai-draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId: l.id }) });
    const j = await r.json();
    setBusy('');
    if (!r.ok) { setMsg({ t: 'err', m: j.error }); return; }
    setL((x) => ({ ...x, scenario: j.scenario, concept_summary: x.concept_summary || j.summary || '', scenario_source: 'ai_draft' }));
    setMsg({ t: 'ok', m: `وصلت مسودة من ${j.scenario.scenes.length} مشاهد${j.dropped ? ` (استُبعد ${j.dropped} مشهد غير صالح)` : ''}. المسودة جاهزة للمراجعة والتعديل ثم الحفظ.` });
  }

  async function doSave(silent = false) {
    const r = await saveLesson({ id: l.id, title: l.title, skill_id: l.skill_id, extracted_text: l.extracted_text, concept_summary: l.concept_summary, scenario: l.scenario, source_file_path: l.source_file_path, scenario_source: l.scenario_source });
    if ('error' in r && r.error) setMsg({ t: 'err', m: r.error });
    else { if (r.status) set('status', r.status); if (!silent) setMsg({ t: 'ok', m: 'تم الحفظ.' }); }
    return r;
  }

  const move = (i: number, d: number) => setScenes((s) => { const n = [...s]; const j = i + d; if (j < 0 || j >= n.length) return n; [n[i], n[j]] = [n[j], n[i]]; return n; });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input value={l.title} onChange={(e) => set('title', e.target.value)} className="field max-w-xl text-2xl font-black" aria-label="عنوان الدرس" />
        <span className="chip">{l.status === 'published' ? 'منشور للطلاب' : l.status === 'review' ? 'عُدّل بعد النشر — يحتاج إلى اعتماد' : 'مسودة'}</span>
      </div>

      {/* 1. المصدر */}
      <section className="panel space-y-3">
        <h2 className="text-lg font-extrabold">1. صفحة الكتاب</h2>
        <div className="flex flex-wrap items-end gap-3">
          <input ref={fileRef} type="file" accept="image/*,application/pdf" className="field max-w-sm" />
          <div><label className="label">رقم الصفحة (لملفات PDF)</label><input type="number" min={1} value={pdfPage} onChange={(e) => setPdfPage(Number(e.target.value))} className="field w-28" /></div>
          <button onClick={uploadAndExtract} disabled={!!busy} className="btn-ghost">رفع واستخراج النص</button>
        </div>
        {l.source_file_path && <p className="text-xs muted">الملف محفوظ في التخزين الخاص للمنصة.</p>}
        <div><label className="label">النص المستخرج (للمراجعة والتصحيح)</label><textarea rows={6} value={l.extracted_text} onChange={(e) => set('extracted_text', e.target.value)} className="field" dir="auto" /></div>
        <div><label className="label">ملخص المفهوم كما تعتمده المعلم</label><textarea rows={3} value={l.concept_summary} onChange={(e) => set('concept_summary', e.target.value)} className="field" /></div>
        <div><label className="label">المهارة المرتبطة (للانتقال إلى التدريب)</label>
          <select value={l.skill_id ?? ''} onChange={(e) => set('skill_id', e.target.value || null)} className="field max-w-md"><option value="">—</option>{skills.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name_ar}</option>)}</select></div>
      </section>

      {/* 2. السيناريو */}
      <section className="panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">2. مشاهد الدرس ({l.scenario.scenes.length} · نحو {Math.round(totalDuration(l.scenario) / 60 * 10) / 10} دقيقة)</h2>
          {aiEnabled
            ? <button onClick={aiDraft} disabled={!!busy || (!l.source_file_path && !l.extracted_text)} className="btn-rose">اقتراح سيناريو بالذكاء الاصطناعي</button>
            : <span className="text-xs muted">الاقتراح الآلي غير مفعّل (يتطلب مفتاح Gemini). يمكن بناء المشاهد يدويًا.</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => <button key={t.key} onClick={() => setScenes((s) => [...s, newScene(t.key as Template)])} className="chip px-3 py-2 hover:bg-ink/5" title={t.use}>+ {t.name}</button>)}
        </div>
        {l.scenario.scenes.map((s, i) => (
          <SceneEditor key={s.id} scene={s} index={i} lessonId={l.id}
            onChange={(n) => setScenes((all) => all.map((x) => (x.id === s.id ? n : x)))}
            onMove={(d) => move(i, d)} onDelete={() => setScenes((all) => all.filter((x) => x.id !== s.id))} />
        ))}
      </section>

      {/* 3. المعاينة */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">3. المعاينة (كما ستراها الطالب)</h2>
        <ScenePlayer key={l.scenario.scenes.map((s) => s.id).join()} scenario={l.scenario} audioUrls={audioUrls} />
      </section>

      <div className="panel sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3">
        <div>{busy && <span className="text-star-600">{busy}</span>}{msg && <span className={msg.t === 'ok' ? 'text-aqua-600' : 'text-rose-600'}>{msg.m}</span>}</div>
        <div className="flex flex-wrap gap-2">
          <button disabled={pending || !!busy} onClick={() => start(async () => { await doSave(); })} className="btn-ghost">حفظ</button>
          {l.status !== 'published'
            ? <button disabled={pending || !!busy} onClick={() => start(async () => { const r = await doSave(true); if ('error' in r && r.error) return; const p = await setLessonStatus(l.id, 'published'); if (p.error) setMsg({ t: 'err', m: p.error }); else { set('status', 'published'); setMsg({ t: 'ok', m: 'اعتُمد الدرس ونُشر للطلاب.' }); } })} className="btn-star">اعتماد ونشر</button>
            : <button disabled={pending} onClick={() => start(async () => { await setLessonStatus(l.id, 'draft'); set('status', 'draft'); })} className="btn-ghost">إلغاء النشر</button>}
        </div>
      </div>
    </div>
  );
}

function SceneEditor({ scene, index, lessonId, onChange, onMove, onDelete }: { scene: Scene; index: number; lessonId: string; onChange: (s: Scene) => void; onMove: (d: number) => void; onDelete: () => void }) {
  const tname = TEMPLATES.find((t) => t.key === scene.template)?.name;
  const data = (patch: object) => onChange({ ...scene, data: { ...scene.data, ...patch } } as Scene);
  return (
    <div className="rounded-2xl border border-ink/10 bg-ink/[.025] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-extrabold">مشهد {index + 1} · <span className="text-star-600">{tname}</span></p>
        <div className="flex gap-2"><button className="chip" onClick={() => onMove(-1)}>▲</button><button className="chip" onClick={() => onMove(1)}>▼</button><button className="chip text-rose-600" onClick={onDelete}>حذف</button></div>
      </div>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <input value={scene.title} onChange={(e) => onChange({ ...scene, title: e.target.value })} className="field" placeholder="عنوان المشهد" />
        <div className="flex items-center gap-2"><label className="text-sm muted">المدة (ث)</label><input type="number" min={3} max={90} value={scene.duration} onChange={(e) => onChange({ ...scene, duration: Number(e.target.value) })} className="field w-24" /></div>
        <textarea rows={2} value={scene.caption} onChange={(e) => onChange({ ...scene, caption: e.target.value })} className="field md:col-span-2" placeholder="النص الذي يظهر أسفل المشهد (ويُقرأ في التسجيل الصوتي)" />
        {scene.template === 'title' && <input value={scene.data.subtitle} onChange={(e) => data({ subtitle: e.target.value })} className="field md:col-span-2" placeholder="عنوان فرعي" />}
        {scene.template === 'cycle' && <textarea rows={4} defaultValue={scene.data.stages.join('\n')} onBlur={(e) => data({ stages: linesToArr(e.target.value).slice(0, 8) })} className="field md:col-span-2" placeholder="مرحلة في كل سطر (2–8)" />}
        {scene.template === 'steps' && <textarea rows={4} defaultValue={scene.data.steps.join('\n')} onBlur={(e) => data({ steps: linesToArr(e.target.value).slice(0, 8) })} className="field md:col-span-2" placeholder="خطوة في كل سطر" />}
        {scene.template === 'number_line' && <>
          <input type="number" value={scene.data.start} onChange={(e) => data({ start: Math.round(Number(e.target.value)) })} className="field" placeholder="نقطة البداية" />
          <input defaultValue={scene.data.moves.join('، ')} onBlur={(e) => data({ moves: e.target.value.split(/[،,]/).map((x) => Math.round(Number(x.trim()))).filter((x) => Number.isFinite(x)).slice(0, 6) })} className="field" dir="ltr" placeholder="الحركات مثل: 5، -8" />
        </>}
        {scene.template === 'balance' && <>
          <input value={scene.data.left} onChange={(e) => data({ left: e.target.value })} className="field" placeholder="الطرف الأول: 2س + 3" />
          <input value={scene.data.right} onChange={(e) => data({ right: e.target.value })} className="field" placeholder="الطرف الثاني: 11" />
          <textarea rows={3} defaultValue={scene.data.steps.map((s) => `${s.left} = ${s.right} | ${s.note}`).join('\n')} className="field md:col-span-2" placeholder="خطوة في كل سطر: 2س = 8 | نطرح 3 من الطرفين"
            onBlur={(e) => data({ steps: linesToArr(e.target.value).slice(0, 6).map((ln) => { const [eq, note = ''] = ln.split('|'); const [left = '', right = ''] = eq.split('=').map((x) => x.trim()); return { left, right, note: note.trim() }; }) })} />
        </>}
        {scene.template === 'percent_grid' && <>
          <input type="number" min={0} max={100} value={scene.data.percent} onChange={(e) => data({ percent: Math.min(100, Math.max(0, Number(e.target.value))) })} className="field" />
          <input value={scene.data.label} onChange={(e) => data({ label: e.target.value })} className="field" placeholder="وصف: 25 من 100" />
        </>}
        {scene.template === 'question' && <>
          <input value={scene.data.prompt} onChange={(e) => data({ prompt: e.target.value })} className="field md:col-span-2" placeholder="نص السؤال" />
          <textarea rows={3} defaultValue={scene.data.options.join('\n')} onBlur={(e) => data({ options: linesToArr(e.target.value).slice(0, 4) })} className="field" placeholder="خيار في كل سطر (2–4)" />
          <div className="space-y-2">
            <select value={scene.data.correct} onChange={(e) => data({ correct: Number(e.target.value) })} className="field">{scene.data.options.map((o, k) => <option key={k} value={k}>الصحيح: {o || `خيار ${k + 1}`}</option>)}</select>
            <input value={scene.data.explain} onChange={(e) => data({ explain: e.target.value })} className="field" placeholder="تفسير قصير" />
          </div>
        </>}
      </div>
      <Recorder lessonId={lessonId} scene={scene} onSaved={(p) => onChange({ ...scene, audio_path: p })} />
    </div>
  );
}

/** تسجيل التعليق بصوت المعلم من المتصفح، ثم رفعه إلى التخزين الخاص */
function Recorder({ lessonId, scene, onSaved }: { lessonId: string; scene: Scene; onSaved: (path: string | null) => void }) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [status, setStatus] = useState('');
  const chunks = useRef<Blob[]>([]);
  const supported = typeof window !== 'undefined' && 'MediaRecorder' in window;

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' });
        setStatus('رفع التسجيل...');
        const ext = (mr.mimeType || 'audio/webm').includes('mp4') ? 'm4a' : 'webm';
        const path = `lessons/${lessonId}/${scene.id}-${Date.now()}.${ext}`;
        const { error } = await supabaseBrowser().storage.from('content').upload(path, blob, { contentType: blob.type });
        if (error) setStatus('تعذر الرفع: ' + error.message); else { onSaved(path); setStatus('حُفظ التسجيل، ويثبت بعد حفظ الدرس.'); }
      };
      mr.start(); setRec(mr); setStatus('جارٍ التسجيل...');
    } catch { setStatus('لم يُسمح باستخدام الميكروفون.'); }
  }

  if (!supported) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      {rec ? <button className="chip bg-rose-500/30 px-3 py-2" onClick={() => { rec.stop(); setRec(null); }}>■ إيقاف التسجيل</button>
        : <button className="chip px-3 py-2" onClick={startRec}>🎙️ {scene.audio_path ? 'إعادة تسجيل التعليق' : 'تسجيل التعليق بصوتي'}</button>}
      {scene.audio_path && !rec && <button className="chip px-3 py-2" onClick={() => onSaved(null)}>حذف التسجيل</button>}
      <span className="muted">{status}</span>
    </div>
  );
}
