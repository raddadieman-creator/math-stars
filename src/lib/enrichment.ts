// المراجع الإثرائية: مواقع رسمية ومنصات تعليمية معروفة، بروابط صفحاتها الرئيسية.
export interface Ref { name: string; by: string; what: string; url: string; tag: string; color: string }

export const REFS: { group: string; items: Ref[] }[] = [
  { group: 'عن اختبارات TIMSS', items: [
    { name: 'نتائج TIMSS 2023 الدولية', by: 'الرابطة الدولية لتقييم التحصيل التربوي (IEA)', what: 'النتائج الدولية، ومجالات المحتوى والمجالات المعرفية لرياضيات الصف الثامن.', url: 'https://timss2023.org', tag: 'رسمي', color: '#0284c7' },
    { name: 'مركز دراسات TIMSS وPIRLS', by: 'كلية بوسطن', what: 'أُطر التقييم والتقارير الدولية والأسئلة المنشورة من الدورات السابقة.', url: 'https://timssandpirls.bc.edu', tag: 'رسمي', color: '#0284c7' },
    { name: 'هيئة تقويم التعليم والتدريب', by: 'المملكة العربية السعودية', what: 'الجهة الوطنية المشرفة على الاختبارات الدولية وتقارير أداء المملكة.', url: 'https://www.etec.gov.sa', tag: 'رسمي', color: '#0284c7' },
  ] },
  { group: 'دروس وشروحات', items: [
    { name: 'منصة عين', by: 'وزارة التعليم', what: 'المحتوى التعليمي الرقمي للمناهج السعودية، ودروس الرياضيات للصف الثاني المتوسط.', url: 'https://ien.edu.sa', tag: 'وزارة التعليم', color: '#0d9488' },
    { name: 'أكاديمية خان بالعربية', by: 'Khan Academy', what: 'دروس وتمارين مجانية في الأعداد والجبر والهندسة والإحصاء.', url: 'https://ar.khanacademy.org', tag: 'مجاني', color: '#16a34a' },
  ] },
  { group: 'أدوات تفاعلية', items: [
    { name: 'جيوجبرا', by: 'GeoGebra', what: 'رسم الدوال والأشكال الهندسية واستكشاف التحويلات والزوايا.', url: 'https://www.geogebra.org', tag: 'أداة', color: '#7c3aed' },
    { name: 'ديزموس', by: 'Desmos', what: 'حاسبة بيانية لتمثيل المعادلات الخطية والميل والمقطع.', url: 'https://www.desmos.com/calculator?lang=ar', tag: 'أداة', color: '#7c3aed' },
    { name: 'بوليباد', by: 'Mathigon', what: 'قطع رقمية للكسور والجبر والأشكال والاحتمالات.', url: 'https://mathigon.org/polypad', tag: 'أداة', color: '#7c3aed' },
  ] },
];
