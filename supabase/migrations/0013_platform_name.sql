-- اسم المنصة الجديد: «معًا نحو القمة – TIMSS»
alter table school_settings alter column platform_name set default 'معًا نحو القمة – TIMSS';
update school_settings set platform_name = 'معًا نحو القمة – TIMSS' where platform_name = 'نجوم الرياضيات | Math Stars';
