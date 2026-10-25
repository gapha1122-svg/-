import React, { useState } from 'react';
import { Award, Lightbulb, Compass, RotateCcw, ArrowLeft, BookOpenCheck } from 'lucide-react';
import { motivationalQuotes } from '../data/initialData';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
  onOpenActivities: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, onOpenActivities }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
      setIsAnimating(false);
    }, 150);
  };

  const current = motivationalQuotes[quoteIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-emerald-800/30 mb-10">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>صرح تعليمي رائد ومتميز</span>
          </span>

          <button
            onClick={nextQuote}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors backdrop-blur-md cursor-pointer"
            title="تبديل العبارة التحفيزية"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>عبارة تحفيزية جديدة</span>
          </button>
        </div>

        {/* Dynamic Title & Quote */}
        <div
          className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-snug mb-4 text-white">
            {current.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
            {current.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('strategies')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>دليل استراتيجيات التدريس</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>

          <button
            onClick={onOpenActivities}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>أندية وأنشطة الطلاب</span>
          </button>

          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-emerald-300 hover:text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>لوحة الشرف والتفوق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
