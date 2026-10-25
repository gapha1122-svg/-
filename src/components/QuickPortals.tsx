import React from 'react';
import {
  ExternalLink,
  Laptop,
  GraduationCap,
  BookOpen,
  UserPlus,
  Flame,
  CloudUpload,
  Compass,
  MapPin
} from 'lucide-react';

interface QuickPortalsProps {
  onOpenAddTeacher: () => void;
  onOpenActivities: () => void;
  onNavigate: (tab: string) => void;
}

export const QuickPortals: React.FC<QuickPortalsProps> = ({
  onOpenAddTeacher,
  onOpenActivities,
  onNavigate
}) => {
  const portals = [
    {
      title: 'منصة مدرستي',
      sub: 'الواجبات، الجداول المدرسية، والحصص الافتراضية',
      href: 'https://schools.madrasati.sa',
      isExternal: true,
      icon: Laptop,
      color: 'from-emerald-500 to-teal-600',
      badge: 'المنصة الرسمية'
    },
    {
      title: 'نظام نور',
      sub: 'رصد الدرجات والتقارير الأكاديمية وشهادات الطلاب',
      href: 'https://noor.moe.gov.sa',
      isExternal: true,
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
      badge: 'النتائج والقبول'
    },
    {
      title: 'منصة سهل التعليمية',
      sub: 'شروحات المناهج السعودية لكافة المواد والمراحل',
      href: 'https://sahl.io/sa',
      isExternal: true,
      icon: BookOpen,
      color: 'from-cyan-600 to-sky-700',
      badge: 'شروحات فيديو'
    },
    {
      title: 'تسجيل المعلمين',
      sub: 'الانضمام إلى الكادر التعليمي في مدرسة بالشهم',
      onClick: onOpenAddTeacher,
      icon: UserPlus,
      color: 'from-amber-500 to-orange-600',
      badge: 'التقديم المباشر'
    },
    {
      title: 'النشاط الطلابي والأندية',
      sub: 'الروبوت، الخط العربي، الإلقاء، والأنشطة الرياضية',
      onClick: onOpenActivities,
      icon: Flame,
      color: 'from-rose-500 to-pink-600',
      badge: 'أندية المدرسة'
    },
    {
      title: 'المزامنة مع مدرستي / نور',
      sub: 'رفع وتحديث كشف الطلاب الفوري عبر ملف Excel',
      onClick: () => onNavigate('dashboard'),
      icon: CloudUpload,
      color: 'from-slate-700 to-slate-900',
      badge: 'للإدارة المدرسية'
    }
  ];

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>بوابات وخدمات تهمك</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            روابط سريعة لأهم المنصات التعليمية والخدمات المدرسية المعتمدة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {portals.map((portal, idx) => {
          const Icon = portal.icon;
          const CardContent = (
            <div className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${portal.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    {portal.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5 flex items-center gap-1.5">
                  <span>{portal.title}</span>
                  {portal.isExternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                  )}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{portal.sub}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>الانتقال للخدمة &larr;</span>
              </div>
            </div>
          );

          if (portal.href) {
            return (
              <a
                key={idx}
                href={portal.href}
                target="_blank"
                rel="noreferrer"
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all block cursor-pointer"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <div
              key={idx}
              onClick={portal.onClick}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
            >
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
};
