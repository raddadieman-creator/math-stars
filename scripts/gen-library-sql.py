# يولّد ملفي الترحيل 0005 و0006 من src/lib/library-models.json
import json
models=json.load(open('src/lib/library-models.json',encoding='utf-8'))
off=json.load(open('/home/claude/library/official.json',encoding='utf-8')) if __import__('os').path.exists('/home/claude/library/official.json') else []
COG={'المعرفة':'knowing','التطبيق':'applying','الاستدلال':'reasoning'}
QT={'mcq':'mcq','num':'numeric','tf':'true_false'}
DOM={'num':'number','alg':'algebra','geo':'geometry_measurement','data':'data_probability'}
def q(v): return "'" + str(v).replace("'","''") + "'"
def qrow(it, skill, akey, extra_cols='', extra_vals=''):
    if it['t']=='mcq': opts=[{"id":chr(97+i),"text":o} for i,o in enumerate(it['o'])]; ans=chr(97+it['a'])
    else: opts=[]; ans=it['a']
    return f"""with s as (select id from skills where code = '{skill}'), a as (select id from assessments where kind = 'model' and form_label = {q(akey)}),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank{extra_cols})
  select s.id, '{COG[it['cog']]}', 2, '{QT[it['t']]}', {q(it['p'])}, {q(json.dumps(opts,ensure_ascii=False))}::jsonb, {q(json.dumps({'value':ans},ensure_ascii=False))}::jsonb, {q(json.dumps(it['steps'],ensure_ascii=False))}::jsonb, 'published', 'library'{extra_vals}
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, POS from a, qi;"""
out=["""-- =====================================================================
-- محتوى مكتبة النماذج: 4 نماذج × 6 أسئلة + نموذج شامل يختار 8 أسئلة عشوائيًا
-- الأسئلة من إعداد المنصة على نمط TIMSS للصف الثامن، وليست أسئلة TIMSS رسمية.
-- (مولَّد بالأمر: python3 scripts/gen-library-sql.py)
-- =====================================================================
insert into skills (domain_id, topic_id, code, name_ar, sort_order)
select t.domain_id, t.id, x.code, x.name_ar, 100
from (values
  ('integers', 'LIB-NUM', 'نماذج الأعداد'),
  ('expressions_equations', 'LIB-ALG', 'نماذج الجبر'),
  ('geometry_measurement', 'LIB-GEO', 'نماذج الهندسة والقياس'),
  ('data', 'LIB-DATA', 'نماذج البيانات والاحتمالات')
) as x(topic, code, name_ar)
join topic_areas t on t.code = x.topic
on conflict (code) do nothing;
"""]
order=0
for m in models:
    if m['key']=='iea': continue
    order+=1
    out.append(f"insert into assessments (kind, form_label, title, domain_code, is_open, sort_order) values ('model', {q(m['key'])}, {q(m['title'])}, {q(DOM[m['key']])}, true, {order});")
    for pos,it in enumerate(m['items']):
        out.append(qrow(it, 'LIB-'+m['key'].upper(), m['key'], ", source_label", ", 'إعداد المنصة (على نمط TIMSS)'").replace('POS',str(pos+1)))
out.append("insert into assessments (kind, form_label, title, is_open, sort_order, description) values ('model', 'mix', 'نموذج شامل', true, 5, 'ثمانية أسئلة عشوائية من جميع النماذج في كل محاولة');")
open('supabase/migrations/0005_library_content.sql','w',encoding='utf-8').write('\n'.join(out)+'\n')

iea=[m for m in models if m['key']=='iea'][0]
p='supabase/migrations/0006_library_files_official.sql'; s=open(p,encoding='utf-8').read()
head=s[:s.index("insert into skills (domain_id, topic_id, code, name_ar, sort_order)\nselect t.domain_id, t.id, 'LIB-IEA'")]
tail=[f"""insert into skills (domain_id, topic_id, code, name_ar, sort_order)
select t.domain_id, t.id, 'LIB-IEA', 'أسئلة TIMSS المقتبسة', 101 from topic_areas t where t.code = 'integers'
on conflict (code) do nothing;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 'iea', {q(iea['title'])}, true, 0, {q(iea['source'])}, {q(iea['source_url'])});"""]
for pos,it in enumerate(iea['items']):
    tail.append(qrow(it,'LIB-IEA','iea',", source_label, source_url, international_pct", f", {q(iea['source'])}, {q(iea['source_url'])}, {it['pct']}").replace("'published', 'library', ","'published', 'library', ",1).replace('POS',str(pos+1)))
open(p,'w',encoding='utf-8').write(head+'\n'.join(tail)+'\n')
print('sql ok')
