#!/usr/bin/env bash
# اختبار الترحيلات وسياسات RLS على PostgreSQL محلي (يتطلب psql وصلاحية إنشاء قاعدة)
set -euo pipefail
DB=${DB:-ms_test}
cd "$(dirname "$0")/../.."
psql -q -c "drop database if exists $DB" -c "create database $DB"
for f in supabase/test/stub_supabase.sql supabase/migrations/0001_schema.sql supabase/migrations/0002_security.sql \
         supabase/migrations/0003_reference_data.sql supabase/migrations/0004_library.sql supabase/migrations/0005_library_content.sql supabase/migrations/0006_library_files_official.sql supabase/migrations/0007_grade8_standards.sql supabase/migrations/0008_timss_released_and_practice.sql supabase/demo/seed_demo.sql supabase/test/rls_test.sql supabase/demo/purge_demo.sql; do
  echo "== $f"; psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f"
done
