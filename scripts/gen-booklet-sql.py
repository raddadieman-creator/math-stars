# يولّد ملف الترحيل 0010 من src/lib/booklet-items.json (أسئلة كراسة تدريبات المعلمات)
import json
all_items = json.load(open('src/lib/booklet-items.json', encoding='utf-8'))
# سؤالان لكل معيار يُحجزان للقياس القبلي والبعدي ولا يدخلان التدريب (آخر سؤالين للمعيار في الكراسة)
MEASURE = {}
for st in range(1, 20):
    ix = [k for k, x in enumerate(all_items) if x['std'] == st]
    MEASURE[ix[-1]] = 'pre'; MEASURE[ix[-2]] = 'post'
items = [x for k, x in enumerate(all_items) if k not in MEASURE]
COG = {'المعرفة': 'knowing', 'التطبيق': 'applying', 'الاستدلال': 'reasoning'}
DOM = {'num': ('number', 'الأعداد'), 'alg': ('algebra', 'الجبر'), 'geo': ('geometry_measurement', 'الهندسة والقياس'), 'data': ('data_probability', 'البيانات والاحتمالات')}
SRC = 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)'
def q(v): return "'" + str(v).replace("'", "''") + "'"
out = ["""-- =====================================================================
-- كراسة تدريبات الصف الثاني متوسط التي أعدّتها معلمات الرياضيات بالمدرسة:
-- كل «تدريب» في الكراسة نموذج في المكتبة، وأسئلته تدخل أيضًا في بنك التدريب حسب المعيار.
-- الأسئلة المفتوحة في الكراسة أُعيدت صياغتها اختيارًا من متعدد (adapted).
-- (مولَّد بالأمر: python3 scripts/gen-booklet-sql.py)
-- ====================================================================="""]
sheets = []
for it in items:
    if it['sheet'] not in sheets: sheets.append(it['sheet'])
for order, sh in enumerate(sheets):
    dom, n = sh.split('-')[1], sh.split('-')[2]
    out.append(f"insert into assessments (kind, form_label, title, domain_code, is_open, sort_order, source_label, description) values ('model', {q(sh)}, {q(f'{DOM[dom][1]} · تدريب {n}')}, {q(DOM[dom][0])}, true, {100 + order}, {q(SRC)}, 'كراسة المعلمات');")
pos = {}
for it in items:
    pos[it['sheet']] = pos.get(it['sheet'], 0) + 1
    opts = [{"id": chr(97 + i), "text": o} for i, o in enumerate(it['o'])]
    label = f"{SRC}، ص {it['page']}، س {it['no']}" + (' (بتصرف: حُوّل إلى اختيار من متعدد)' if it['adapted'] else '')
    media = q('/booklet/' + it['fig'] + '.png') if it.get('fig') else 'null'
    out.append(f"""with s as (select id from skills where code = 'G8-S{it['std']:02d}'), a as (select id from assessments where kind = 'model' and form_label = {q(it['sheet'])}),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, '{COG[it['cog']]}', {it['d']}, 'mcq', {q(it['p'])}, {media}, {q(json.dumps(opts, ensure_ascii=False))}::jsonb, {q(json.dumps({'value': chr(97 + it['a'])}))}::jsonb, {q(json.dumps(it['steps'], ensure_ascii=False))}::jsonb, 'published', 'library', {q(label)}
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, {pos[it['sheet']]} from a, qi;""")
open('supabase/migrations/0010_teacher_booklet.sql', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('0010 ok', len(sheets), 'sheets', len(items), 'items')

m = ['''-- =====================================================================
-- القياس القبلي والبعدي: نموذجان متكافئان، سؤال لكل معيار من المعايير الـ19.
-- أسئلتهما في بنك منفصل (measure) لا يظهر في التدريب ولا في المكتبة.
-- يُفتح القبلي مباشرة، ويفتح المعلم البعدي في نهاية البرنامج. محاولة واحدة لكل طالب.
-- (مولَّد بالأمر: python3 scripts/gen-booklet-sql.py)
-- =====================================================================
alter table questions drop constraint if exists questions_bank_check;
alter table questions add constraint questions_bank_check check (bank in ('practice', 'library', 'measure'));
alter table assessments add column if not exists description text;
insert into assessments (kind, form_label, title, is_open, sort_order, description) values
  ('pre', 'نموذج أ', 'القياس القبلي', true, 0, 'تحديد المستوى قبل بدء التدريب'),
  ('post', 'نموذج ب', 'القياس البعدي', false, 1, 'قياس التقدم في نهاية البرنامج');''']
pos = {'pre': 0, 'post': 0}
for k, kind in sorted(MEASURE.items(), key=lambda t: (all_items[t[0]]['std'], t[1])):
    it = all_items[k]; pos[kind] += 1
    opts = [{"id": chr(97 + i), "text": o} for i, o in enumerate(it['o'])]
    media = q('/booklet/' + it['fig'] + '.png') if it.get('fig') else 'null'
    m.append(f"""with s as (select id from skills where code = 'G8-S{it['std']:02d}'), a as (select id from assessments where kind = '{kind}' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, '{COG[it['cog']]}', {it['d']}, 'mcq', {q(it['p'])}, {media}, {q(json.dumps(opts, ensure_ascii=False))}::jsonb, {q(json.dumps({'value': chr(97 + it['a'])}))}::jsonb, {q(json.dumps(it['steps'], ensure_ascii=False))}::jsonb, 'published', 'measure', {q(SRC + '، ص ' + str(it['page']))}
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, {pos[kind]} from a, qi;""")
open('supabase/migrations/0011_measurement.sql', 'w', encoding='utf-8').write('\n'.join(m) + '\n')
print('0011 ok', pos)
