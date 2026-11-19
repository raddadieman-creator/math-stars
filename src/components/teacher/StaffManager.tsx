'use client';
import { useState, useTransition } from 'react';
import { addStaff, deleteStaff, resetStaffCode, updateStaff } from '@/app/teacher/(panel)/staff-actions';

type Person = { id: string; full_name: string; role: 'teacher' | 'admin'; classIds: string[] };
type Cls = { id: string; name: string };

function ClassPicks({ classes, value, onChange, name }: { classes: Cls[]; value?: string[]; onChange?: (v: string[]) => void; name?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {classes.map((c) => (
        <label key={c.id} className="chip cursor-pointer gap-1 px-3 py-1.5 text-sm">
          <input type="checkbox" name={name} value={c.id} defaultChecked={value?.includes(c.id)}
            onChange={onChange ? (e) => onChange(e.target.checked ? [...(value ?? []), c.id] : (value ?? []).filter((x) => x !== c.id)) : undefined} />
          {c.name}
        </label>
      ))}
      {!classes.length && <span className="text-sm muted">لا توجد فصول بعد.</span>}
    </div>
  );
}

function Row({ p, me, classes }: { p: Person; me: string; classes: Cls[] }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(p.full_name), [role, setRole] = useState(p.role), [cls, setCls] = useState(p.classIds);
  const [msg, setMsg] = useState<{ code?: string; error?: string; ok?: string } | null>(null);
  const [pending, start] = useTransition();
  const clsNames = classes.filter((c) => p.classIds.includes(c.id)).map((c) => c.name).join('، ');
  return (
    <div className="panel">
      {!edit ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold">{p.full_name} {p.id === me && <span className="chip mr-1 text-xs">حسابك</span>}</p>
            <p className="text-sm muted">{p.role === 'admin' ? 'الإدارة (جميع الفصول)' : `الفصول: ${clsNames || 'لم تُحدَّد'}`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="chip" onClick={() => setEdit(true)}>تعديل</button>
            <button className="chip" disabled={pending} onClick={() => { if (confirm(`إصدار رمز دخول جديد لـ ${p.full_name}؟ يتوقف الرمز الحالي.`)) start(async () => { const r = await resetStaffCode(p.id); setMsg({ code: r.code, error: r.error }); }); }}>رمز جديد</button>
            {p.id !== me && <button className="chip text-rose-600" disabled={pending} onClick={() => { if (confirm(`حذف حساب ${p.full_name} نهائيًا؟ تبقى الفصول وبيانات الطالبات كما هي.`)) start(async () => { const r = await deleteStaff(p.id); setMsg(r.error ? { error: r.error } : { ok: 'حُذف الحساب.' }); }); }}>حذف</button>}
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="label">الاسم</label><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="label">الصلاحية</label>
              <select className="field" value={role} onChange={(e) => setRole(e.target.value as Person['role'])}><option value="teacher">معلم</option><option value="admin">إدارة</option></select></div>
          </div>
          <div><label className="label">الفصول</label><ClassPicks classes={classes} value={cls} onChange={setCls} /></div>
          <div className="flex gap-2">
            <button className="btn-star" disabled={pending} onClick={() => start(async () => { const r = await updateStaff(p.id, name, role, cls); if (r.error) setMsg({ error: r.error }); else { setMsg({ ok: 'حُفظت التعديلات.' }); setEdit(false); } })}>حفظ</button>
            <button className="btn-ghost" onClick={() => setEdit(false)}>إلغاء</button>
          </div>
        </div>
      )}
      {msg?.code && <p className="mt-3 rounded-xl bg-sky-50 p-3">رمز الدخول الجديد: <b dir="ltr" className="text-2xl tracking-widest text-sky-700">{msg.code}</b>. يظهر مرة واحدة، ويمكن للمعلم تغييره من «الإعدادات».</p>}
      {msg?.ok && <p className="mt-3 text-teal-700">{msg.ok}</p>}
      {msg?.error && <p className="mt-3 text-rose-600">{msg.error}</p>}
    </div>
  );
}

export function StaffManager({ me, people, classes }: { me: string; people: Person[]; classes: Cls[] }) {
  const [res, setRes] = useState<{ code?: string; error?: string; name?: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-4">
      <form className="panel grid gap-3" action={(f) => start(async () => { const r = await addStaff(f); setRes({ ...r, name: String(f.get('full_name')) }); })}>
        <h2 className="text-lg font-extrabold">إضافة معلم</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="label">الاسم كما يظهر في شاشة الدخول</label><input name="full_name" required className="field" placeholder="الاسم الأول واسم العائلة" /></div>
          <div><label className="label">الصلاحية</label><select name="role" className="field"><option value="teacher">معلم</option><option value="admin">إدارة</option></select></div>
        </div>
        <div><label className="label">الفصول</label><ClassPicks classes={classes} name="class_ids" /></div>
        <div><button disabled={pending} className="btn-star">إضافة وإصدار رمز الدخول</button></div>
        {res?.code && <p className="rounded-xl bg-sky-50 p-3">رمز دخول {res.name}: <b dir="ltr" className="text-2xl tracking-widest text-sky-700">{res.code}</b>. يظهر مرة واحدة، ويمكن تغييره بعد الدخول.</p>}
        {res?.error && <p className="text-rose-600">{res.error}</p>}
      </form>
      {people.map((p) => <Row key={p.id + p.full_name + p.role + p.classIds.join()} p={p} me={me} classes={classes} />)}
    </div>
  );
}
