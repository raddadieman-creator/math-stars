-- =====================================================================
-- نجوم الرياضيات | Math Stars — المخطط الأساسي لقاعدة البيانات
-- يُنفَّذ في Supabase (SQL Editor) أو عبر supabase db push
-- =====================================================================
create extension if not exists pgcrypto;

-- ---------- الأنواع ----------
create type staff_role as enum ('teacher', 'admin');
create type cognitive_domain as enum ('knowing', 'applying', 'reasoning');
create type question_type as enum ('mcq', 'true_false', 'numeric', 'ordering', 'matching', 'drag_drop', 'image_mcq');
create type content_status as enum ('draft', 'review', 'published', 'archived');
create type session_mode as enum ('practice', 'game', 'pretest', 'posttest', 'lesson_check');
create type mastery_status as enum ('not_started', 'developing', 'needs_support', 'mastered');
create type assessment_kind as enum ('pre', 'post');

-- ---------- إعدادات المدرسة والمنصة (صف واحد) ----------
create table school_settings (
  id smallint primary key default 1 check (id = 1),
  platform_name text not null default 'نجوم الرياضيات | Math Stars',
  slogan text not null default 'أتعلم، أتحدى، أتقدم، وأتألق.',
  school_name text,
  school_logo_url text,
  principal_name text,
  teacher_names text[] not null default '{}',
  vision text,
  mission text,
  goals text[] not null default '{}',
  timss_intro text,
  timss_logo_url text,               -- ترفعه الإدارة من لوحة الإعدادات
  program_weeks int not null default 20 check (program_weeks between 1 and 52),
  program_start_date date,           -- بداية البرنامج (أسبوع 1)
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into school_settings (id) values (1);

-- قواعد محرك التدريب التكيفي (تراها المعلمة وتعدلها)
create table adaptive_rules (
  id smallint primary key default 1 check (id = 1),
  promote_after_independent_correct int not null default 3 check (promote_after_independent_correct between 1 and 10),
  demote_after_errors int not null default 2 check (demote_after_errors between 1 and 10),
  mastery_min_items int not null default 5 check (mastery_min_items between 3 and 30),
  mastery_threshold numeric(3,2) not null default 0.80 check (mastery_threshold between 0.5 and 1),
  support_threshold numeric(3,2) not null default 0.40 check (support_threshold between 0 and 0.8),
  max_tries_before_reveal int not null default 2 check (max_tries_before_reveal between 1 and 4),
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into adaptive_rules (id) values (1);

-- قواعد المكافآت
create table reward_rules (
  id smallint primary key default 1 check (id = 1),
  stars_first_try int not null default 3,
  stars_after_hint int not null default 2,
  stars_after_reveal int not null default 0,
  stars_session_complete int not null default 2,
  stars_skill_mastered int not null default 10,
  stars_personal_improvement int not null default 5,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into reward_rules (id) values (1);

-- ---------- المعلمات والإدارة (مرتبطة بـ Supabase Auth) ----------
create table staff (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'teacher',
  created_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,                     -- مثال: ثاني متوسط / 1
  grade text not null default 'الثاني المتوسط',
  academic_year text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table class_teachers (
  class_id uuid references classes(id) on delete cascade,
  teacher_id uuid references staff(id) on delete cascade,
  primary key (class_id, teacher_id)
);

-- ---------- الطالبات ----------
-- رمز الدخول لا يُخزَّن نصًا، بل بصمة HMAC يحسبها الخادم بمفتاح سري.
create table students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nickname text not null,               -- اسم مستعار يظهر في لوحة التميز العامة
  avatar text not null default 'star',
  class_id uuid not null references classes(id) on delete restrict,
  login_code_hash text not null unique,
  is_active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index on students (class_id);

create table student_login_failures (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index on student_login_failures (ip, created_at);

-- ---------- إطار TIMSS والمهارات ----------
create table content_domains (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,            -- number / algebra / geometry_measurement / data_probability
  name_ar text not null,
  target_percent int,                   -- النسبة المستهدفة في إطار TIMSS 2027 للصف الثامن
  name_en text not null,
  description text,
  sort_order int not null default 0
);

create table topic_areas (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references content_domains(id) on delete cascade,
  code text unique not null,
  name_ar text not null,
  name_en text not null,
  target_percent int,
  sort_order int not null default 0
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references content_domains(id) on delete restrict,
  code text unique not null,
  name_ar text not null,
  topic_id uuid references topic_areas(id),
  description text,
  sort_order int not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- بنك الأسئلة ----------
create table questions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references skills(id) on delete restrict,
  cognitive cognitive_domain not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  objective text,
  qtype question_type not null,
  prompt text not null,
  media_url text,
  options jsonb not null default '[]',          -- [{id, text, image?}]
  correct_answer jsonb not null,                -- {"value": ...}
  explanation text,
  hint text,
  solution_steps jsonb not null default '[]',   -- ["خطوة 1", ...]
  common_errors jsonb not null default '[]',    -- [{answer, error_type, note}]
  remedial_activity text,
  status content_status not null default 'draft',
  is_demo boolean not null default false,
  created_by uuid references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on questions (skill_id, status, difficulty);

-- ---------- جلسات التدريب والمحاولات ----------
create table practice_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  mode session_mode not null,
  game_key text,
  skill_id uuid references skills(id),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
create index on practice_sessions (student_id, started_at);

-- كل محاولة إجابة سجل مستقل
create table attempts (
  id bigserial primary key,
  session_id uuid not null references practice_sessions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  question_id uuid not null references questions(id) on delete restrict,
  try_no smallint not null,
  answer jsonb not null,
  is_correct boolean not null,
  hint_shown boolean not null default false,     -- هل رأت التلميح قبل هذه المحاولة
  solution_revealed boolean not null default false, -- هل كُشف الحل قبل هذه المحاولة
  error_type text,
  time_ms int,
  created_at timestamptz not null default now()
);
create index on attempts (student_id, created_at);
create index on attempts (question_id);

-- نتيجة كل سؤال داخل الجلسة (ملخص يحدّثه الخادم)
create table item_outcomes (
  session_id uuid not null references practice_sessions(id) on delete cascade,
  question_id uuid not null references questions(id) on delete restrict,
  student_id uuid not null references students(id) on delete cascade,
  skill_id uuid not null references skills(id),
  tries smallint not null,
  outcome text not null check (outcome in ('independent', 'with_hint', 'after_reveal', 'not_solved')),
  total_time_ms int,
  created_at timestamptz not null default now(),
  primary key (session_id, question_id)
);
create index on item_outcomes (student_id, skill_id);

-- حالة إتقان المهارة لكل طالبة
create table skill_mastery (
  student_id uuid references students(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  level smallint not null default 1 check (level between 1 and 3),
  independent_streak int not null default 0,
  error_streak int not null default 0,
  items_seen int not null default 0,
  independent_correct int not null default 0,
  recent_outcomes text[] not null default '{}',   -- آخر النتائج (نافذة الحكم على الإتقان)
  status mastery_status not null default 'not_started',
  updated_at timestamptz not null default now(),
  primary key (student_id, skill_id)
);

-- ---------- التعزيز ----------
create table badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_ar text not null,
  kind text not null check (kind in ('mastery', 'persistence', 'improvement', 'achievement')),
  description text,
  icon text not null default 'star'
);

create table student_badges (
  id bigserial primary key,
  student_id uuid not null references students(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  skill_id uuid references skills(id),          -- لأوسمة الإتقان فقط؛ فارغ لبقية الشارات
  awarded_at timestamptz not null default now()
);
create unique index student_badges_once on student_badges
  (student_id, badge_id, coalesce(skill_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table star_ledger (
  id bigserial primary key,
  student_id uuid not null references students(id) on delete cascade,
  amount int not null,
  reason text not null,
  session_id uuid references practice_sessions(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on star_ledger (student_id);

-- ---------- القياس القبلي والبعدي ----------
create table assessments (
  id uuid primary key default gen_random_uuid(),
  kind assessment_kind not null,
  form_label text not null,              -- النموذج أ / ب
  title text not null,
  class_id uuid references classes(id),
  is_open boolean not null default false,
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);

create table assessment_items (
  assessment_id uuid references assessments(id) on delete cascade,
  question_id uuid references questions(id) on delete restrict,
  position int not null,
  is_anchor boolean not null default false,   -- بند ربط مشترك بين النموذجين
  primary key (assessment_id, question_id)
);

create table assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score int,
  max_score int,
  unique (assessment_id, student_id)
);

create table assessment_responses (
  attempt_id uuid references assessment_attempts(id) on delete cascade,
  question_id uuid references questions(id) on delete restrict,
  answer jsonb not null,
  is_correct boolean not null,
  primary key (attempt_id, question_id)
);

-- ---------- الدروس المرئية (تحويل صفحات الكتاب) ----------
create table lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skill_id uuid references skills(id),
  source_file_path text,                 -- مسار صفحة الكتاب في التخزين
  extracted_text text,                   -- النص المستخرج (تراجعه المعلمة)
  concept_summary text,
  scenario jsonb not null default '{"scenes": []}', -- مشاهد الرسوم المتحركة البرمجية
  scenario_source text not null default 'manual' check (scenario_source in ('manual', 'ai_draft')),
  status content_status not null default 'draft',
  approved_by uuid references staff(id),
  approved_at timestamptz,
  created_by uuid references staff(id),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- سجل التعديلات الإدارية ----------
create table audit_log (
  id bigserial primary key,
  actor_id uuid,
  action text not null,
  table_name text not null,
  row_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
