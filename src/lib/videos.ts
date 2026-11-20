// شروحات الفيديو: روابط بحث مباشرة في يوتيوب باسم المعلم والموضوع، ورابط منصة عين الرسمية.
// لا تُخزَّن روابط مقاطع بعينها حتى لا يتعطل الرابط عند حذف مقطع أو تغييره.

export interface VideoSource { id: string; name: string; note: string; url: (topic: string) => string }

const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const VIDEO_SOURCES: VideoSource[] = [
  { id: 'manal', name: 'أ. منال التويجري', note: 'شروحات يوتيوب', url: (t) => yt(`منال التويجري ${t} رياضيات ثاني متوسط`) },
  { id: 'asmari', name: 'أ. علي الأسمري', note: 'شروحات يوتيوب', url: (t) => yt(`علي الأسمري ${t} رياضيات ثاني متوسط`) },
  { id: 'ien-yt', name: 'قنوات عين', note: 'دروس عين على يوتيوب', url: (t) => yt(`قنوات عين رياضيات ثاني متوسط ${t}`) },
  { id: 'ien', name: 'منصة عين', note: 'المنصة الوطنية للمحتوى التعليمي', url: () => 'https://ien.edu.sa' },
];

/** أزرار الشروحات بصيغة HTML (للأجزاء التي تعمل دون React) */
export function videoLinksHTML(topic: string): string {
  return VIDEO_SOURCES.map((s) => `<a class="rv-vid rv-vid-${s.id}" href="${s.url(topic)}" target="_blank" rel="noopener noreferrer">▶ ${s.name}</a>`).join('');
}

export const VIDEO_TOPICS: { domain: string; topics: string[] }[] = [
  { domain: 'الأعداد', topics: ['الأعداد النسبية', 'العمليات على الأعداد الصحيحة', 'الكسور', 'النسبة المئوية', 'النسبة والتناسب', 'الأسس والصيغة العلمية', 'الجذور التربيعية'] },
  { domain: 'الجبر', topics: ['حل المعادلات', 'حل المتباينات', 'العبارات الجبرية', 'الميل', 'الدالة الخطية', 'التغير الطردي', 'المتتابعات'] },
  { domain: 'الهندسة والقياس', topics: ['الزوايا والمستقيمات المتوازية', 'المضلعات', 'نظرية فيثاغورس', 'المساحة', 'محيط الدائرة ومساحتها', 'الحجم', 'المساحة السطحية', 'التحويلات الهندسية', 'التشابه'] },
  { domain: 'البيانات والاحتمالات', topics: ['مقاييس النزعة المركزية', 'المدى والربيعات', 'الاحتمال', 'مبدأ العد', 'الحوادث المستقلة', 'التمثيلات البيانية'] },
];
