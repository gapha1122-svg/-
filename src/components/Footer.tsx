import React from 'react';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  PhoneCall,
  ShieldAlert,
  Flame,
  Ambulance,
  Building2,
  Heart,
  ExternalLink
} from 'lucide-react';
import { emergencyHotlines } from '../data/initialData';
import { VisitorStats } from '../types';
import { VisitorCounter } from './VisitorCounter';

interface FooterProps {
  onNavigate: (tab: string) => void;
  visitorStats?: VisitorStats;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, visitorStats }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'Ambulance':
        return <Ambulance className="w-4 h-4 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-sky-400" />;
      case 'PhoneCall':
      default:
        return <PhoneCall className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight">
                  مدرسة بالشهم الابتدائية
                </h3>
                <span className="text-xs font-semibold text-emerald-400">
                  المملكة العربية السعودية
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              صرح تعليمي يعنى بتنشئة أجيال المستقبل على حب المعرفة، والتمسك بالقيم الإسلامية
              والوطنية الراسخة، والمساهمة الفاعلة في مسيرة رؤية السعودية 2030.
            </p>
            <a
              href="https://maps.app.goo.gl/GXvQQP7sAzkgHEJo6"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="عرض موقع المدرسة على الخريطة"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>منطقة الباحة، المملكة العربية السعودية</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-300 font-bold"
                >
                  التقويم والفعاليات المدرسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('strategies')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  استراتيجيات التعلم النشط
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teachers')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  نخبة المعلمين والمربين
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('students')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  لوحة شرف المتفوقين
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  المعرض التوثيقي
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('board')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  منبر إبداع الطلاب
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>تواصل مع إدارة المدرسة</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">017-7220000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@balshaham.edu.sa</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/GXvQQP7sAzkgHEJo6"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 underline decoration-emerald-500/40 underline-offset-2"
                  title="فتح موقع المدرسة على خرائط Google"
                >
                  <span>منطقة الباحة - المملكة العربية السعودية</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الأحد - الخميس (7:00 ص - 1:30 م)</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Official Saudi Hotlines */}
          <div>
            <h4 className="text-sm font-black text-amber-400 mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>أرقام الطوارئ والتواصل الرسمية</span>
            </h4>
            <ul className="space-y-2">
              {emergencyHotlines.map((hotline, idx) => (
                <li key={idx}>
                  <a
                    href={`tel:${hotline.number}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white">
                      {getIcon(hotline.iconName)}
                      <span>{hotline.title}</span>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${hotline.badgeColor}`}
                      dir="ltr"
                    >
                      {hotline.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official Visitor Counter */}
        {visitorStats && <VisitorCounter stats={visitorStats} variant="footer" />}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مدرسة بالشهم الابتدائية • وزارة
            التعليم
          </div>
          <div className="flex items-center gap-1">
            <span>صُمم بكل</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>لخدمة التعليم بالمملكة العربية السعودية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
