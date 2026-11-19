# يولّد ملف الترحيل 0010 من src/lib/booklet-items.json (أسئلة كراسة تدريبات المعلمات)
import json
items = json.load(open('src/lib/booklet-items.json', encoding='utf-8'))
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
