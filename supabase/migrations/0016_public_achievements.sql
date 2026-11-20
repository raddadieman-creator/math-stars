-- قسم «المنجزات والنجوم» في الصفحة الرئيسية: الاسم المختصر (الاسم الأول واسم الأب) والفصل والنجوم والشارات.
-- تتحكم الإدارة والمعلمات في إظهاره من الإعدادات. لا تُعرض الدرجات ولا تفاصيل الإجابات.
alter table school_settings add column if not exists show_public_achievements boolean not null default true;

create or replace function public_achievements(lim int default 12)
returns table (name text, class_name text, stars bigint, badges text[])
language sql stable security definer set search_path = public as $$
  with st as (
    select s.id, s.nickname, c.name as class_name,
      coalesce((select sum(l.amount) from star_ledger l where l.student_id = s.id), 0) as stars,
      coalesce((select array_agg(distinct b.code) from student_badges sb join badges b on b.id = sb.badge_id where sb.student_id = s.id), '{}') as badges
    from students s join classes c on c.id = s.class_id
    where s.is_active and not s.is_demo
  )
  select nickname, class_name, stars, badges from st
  where (select show_public_achievements from school_settings where id = 1)
    and (stars > 0 or cardinality(badges) > 0)
  order by stars desc, cardinality(badges) desc, nickname
  limit least(greatest(lim, 1), 30)
$$;

create or replace function public_recent_badges(lim int default 8)
returns table (name text, class_name text, badge text, awarded_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.nickname, c.name, b.code, sb.awarded_at
  from student_badges sb join students s on s.id = sb.student_id join classes c on c.id = s.class_id join badges b on b.id = sb.badge_id
  where (select show_public_achievements from school_settings where id = 1) and s.is_active and not s.is_demo
  order by sb.awarded_at desc
  limit least(greatest(lim, 1), 20)
$$;

revoke all on function public_achievements(int) from public;
revoke all on function public_recent_badges(int) from public;
grant execute on function public_achievements(int) to anon, authenticated;
grant execute on function public_recent_badges(int) to anon, authenticated;
