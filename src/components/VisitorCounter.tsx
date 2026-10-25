import React from 'react';
import { Eye, TrendingUp, Users, Activity, Sparkles } from 'lucide-react';
import { VisitorStats } from '../types';

interface VisitorCounterProps {
  stats: VisitorStats;
  variant?: 'full' | 'footer' | 'badge';
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ stats, variant = 'full' }) => {
  const digits = String(stats.totalVisitors).padStart(6, '0').split('');

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Eye className="w-3.5 h-3.5 text-emerald-400" />
        <span>زوار البوابة:</span>
        <span className="font-mono text-emerald-300 font-extrabold" dir="ltr">
          {stats.totalVisitors.toLocaleString('ar-SA')}
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Title & Live indicator */}
          <div className="flex items-center gap-3.5 text-right w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-white">
                  عداد زوار البوابة الإلكترونية
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>مباشر</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                إحصائية دقيقة لعدد الزيارات الموثقة لموقع مدرسة بالشهم الابتدائية
              </p>
            </div>
          </div>

          {/* Digital Odometer Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
            {/* Digits Display */}
            <div className="flex items-center gap-1 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner">
              {digits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-7 h-10 sm:w-8 sm:h-11 rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center text-lg sm:text-xl font-mono font-black text-emerald-400 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80"></div>
                  <span className="relative z-10">{digit}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 text-xs">
              <div className="bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/60 text-center min-w-[90px]">
                <div className="text-[11px] text-slate-400 font-bold flex items-center justify-center gap-1 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-sky-400" />
                  <span>زوار اليوم</span>
                </div>
                <div className="font-mono text-sm font-black text-sky-300">
                  +{stats.todayVisitors.toLocaleString('ar-SA')}
                </div>
              </div>

              <div className="bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/60 text-center min-w-[90px]">
                <div className="text-[11px] text-slate-400 font-bold flex items-center justify-center gap-1 mb-0.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>متصل الآن</span>
                </div>
                <div className="font-mono text-sm font-black text-emerald-300 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{stats.onlineNow}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full / Featured Widget Variant (For Home / Stats)
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl mb-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>الرصد الإحصائي التفاعلي</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>تحديث تلقائي</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-emerald-400" />
            <span>عداد زوار بوابة مدرسة بالشهم الابتدائية</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            مؤشر حي يعكس تفاعل أولياء الأمور والطلاب والمعلمين مع الأنشطة والمستجدات التعليمية.
          </p>
        </div>

        {/* Counter and badges */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Odometer numbers */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shadow-2xl">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className="w-8 h-12 sm:w-10 sm:h-14 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 flex items-center justify-center text-xl sm:text-2xl font-mono font-black text-emerald-400 shadow-inner relative"
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700/50"></div>
                <span className="relative z-10">{digit}</span>
              </div>
            ))}
          </div>

          {/* Sub statistics */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[100px]">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-sky-400" />
                <span>زيارات اليوم</span>
              </span>
              <span className="block font-mono text-base font-black text-sky-300 mt-0.5">
                +{stats.todayVisitors.toLocaleString('ar-SA')}
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[100px]">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>متواجدون الآن</span>
              </span>
              <span className="block font-mono text-base font-black text-emerald-300 mt-0.5 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{stats.onlineNow}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
