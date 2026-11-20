/** الرؤية والرسالة: تصميم داكن أنيق بزخرفة هندسية ولمسات ذهبية، مختلف عن بقية الصفحة */
const PATTERN = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="#d4a64a" stroke-opacity=".13" stroke-width="1"><path d="M32 4l8 20 20 8-20 8-8 20-8-20-20-8 20-8z"/><circle cx="32" cy="32" r="9"/><path d="M0 0l12 12M64 0L52 12M0 64l12-12M64 64L52 52"/></g></svg>')}")`;

function Panel({ label, text, icon, delay }: { label: string; text: string; icon: React.ReactNode; delay: string }) {
  return (
    <article className="vm-panel relative flex flex-col gap-5 p-8 md:p-10" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-[#d4a64a]/50 bg-[#d4a64a]/10 text-[#e9c46a]">{icon}</span>
        <div>
          <p className="text-xs font-bold text-[#d4a64a]/80">معًا نحو القمة</p>
          <h2 className="vm-gold text-3xl font-black">{label}</h2>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute left-6 top-4 select-none font-serif text-[9rem] leading-none text-[#d4a64a]/10">”</span>
      <p className="relative text-xl leading-[2.1] text-white/90 md:text-[1.35rem]">{text}</p>
      <span className="mt-auto h-px w-24 bg-gradient-to-l from-[#d4a64a] to-transparent" />
    </article>
  );
}

export function VisionMission({ vision, mission, goals }: { vision: string | null; mission: string | null; goals: string[] }) {
  if (!vision && !mission && !goals.length) return null;
  return (
    <section className="relative mt-14 overflow-hidden rounded-[2.25rem] text-white shadow-2xl" style={{ background: 'radial-gradient(900px 400px at 85% 0%, rgba(212,166,74,.22), transparent 60%), radial-gradient(700px 380px at 0% 100%, rgba(56,189,248,.16), transparent 60%), linear-gradient(160deg,#0b1026,#151a3d 55%,#0f1530)' }}>
      <div aria-hidden className="absolute inset-0 opacity-100" style={{ backgroundImage: PATTERN }} />
      <div className="relative grid md:grid-cols-2">
        {vision && <Panel label="الرؤية" text={vision} delay="0s" icon={<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>} />}
        {mission && <div className="relative md:border-r md:border-[#d4a64a]/25"><Panel label="الرسالة" text={mission} delay=".15s" icon={<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>} /></div>}
      </div>
      {goals.length > 0 && (
        <div className="relative border-t border-[#d4a64a]/25 p-8 md:p-10">
          <h2 className="vm-gold text-2xl font-black">الأهداف</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">{goals.map((g, i) => <li key={g} className="flex gap-3 text-white/90"><span className="vm-gold font-black">{String(i + 1).padStart(2, '0')}</span>{g}</li>)}</ol>
        </div>
      )}
    </section>
  );
}
