import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  Search,
  Clock,
  Target,
  BookOpen,
  X,
  CheckCircle2,
  UserCheck,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { LearningStrategy } from '../types';

interface StrategiesSectionProps {
  strategies: LearningStrategy[];
}

export const StrategiesSection: React.FC<StrategiesSectionProps> = ({ strategies }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalStrategy, setActiveModalStrategy] = useState<LearningStrategy | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: '🌟 كافة الاستراتيجيات' },
    { id: 'team', label: '👥 العمل الجماعي والتعاوني' },
    { id: 'thinking', label: '🧠 التفكير الناقد والإبداع' },
    { id: 'summary', label: '📊 الاستكشاف وتلخيص المفاهيم' },
    { id: 'assessment', label: '⏱️ التقويم الختامي والغلق' }
  ];

  const filteredStrategies = useMemo(() => {
    return strategies.filter((item) => {
      const matchCat = selectedCat === 'all' || item.cat === selectedCat;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brief.toLowerCase().includes(q) ||
        item.bestFor.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [strategies, selectedCat, searchQuery]);

  const handleCopySteps = (strategy: LearningStrategy) => {
    const text = `استراتيجية: ${strategy.name}\nالوقت: ${strategy.time}\nالأنسب لـ: ${strategy.bestFor}\n\nخطوات التطبيق:\n${strategy.steps.join('\n')}\n\nدور المعلم:\n${strategy.teacherRole}\n\nنصيحة:\n${strategy.tip}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 mb-3">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>المرجع التربوي المعتمد</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          دليل استراتيجيات التعلم النشط
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl">
          مرجع شامل ومفصل لمعلمي مدرسة بالشهم الابتدائية لاختيار وتطبيق أحدث استراتيجيات
          التدريس التفاعلية بما يناسب طبيعة المرحلة الابتدائية.
        </p>
      </div>

      {/* Controls & Search */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الاستراتيجية، المادة، أو نوع النشاط (مثال: عصف ذهني، عمل جماعي، تقويم)..."
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies Grid */}
      {filteredStrategies.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            لم يتم العثور على استراتيجية مطابقة
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            جرب كلمات بحث أخرى أو اختر تصنيفاً آخر من الأعلى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {strategy.catLabel}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white flex items-center justify-center transition-colors">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {strategy.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {strategy.brief}
                </p>

                {/* Meta details */}
                <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 mb-6 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      الزمن المقدر: <strong className="text-slate-900">{strategy.time}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 font-semibold">
                    <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      الأنسب لـ: <strong className="text-slate-900">{strategy.bestFor}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalStrategy(strategy)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>دليل التطبيق وخطوات المعلم</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Strategy Detail Modal */}
      {activeModalStrategy && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {activeModalStrategy.catLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span>{activeModalStrategy.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {activeModalStrategy.brief}
                </p>
              </div>
              <button
                onClick={() => setActiveModalStrategy(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
                <h4 className="font-extrabold text-emerald-950 mb-1.5 flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>متى تختار هذه الاستراتيجية في درسك؟</span>
                </h4>
                <p className="text-emerald-900 text-xs sm:text-sm leading-relaxed">
                  {activeModalStrategy.bestFor} — تستغرق عادةً{' '}
                  <strong>{activeModalStrategy.time}</strong> خلال الحصة الدراسية.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>خطوات التطبيق العملي خطوة بخطوة:</span>
                </h4>
                <div className="space-y-2.5">
                  {activeModalStrategy.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                <h4 className="font-extrabold text-sky-950 mb-1.5 flex items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>دور المعلم أثناء التنفيذ والمتابعة:</span>
                </h4>
                <p className="text-sky-900 text-xs sm:text-sm leading-relaxed">
                  {activeModalStrategy.teacherRole}
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <h4 className="font-extrabold text-amber-950 mb-1.5 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>نصيحة ذهبية لطلاب المرحلة الابتدائية:</span>
                </h4>
                <p className="text-amber-900 text-xs sm:text-sm leading-relaxed">
                  {activeModalStrategy.tip}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopySteps(activeModalStrategy)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>نسخ الخطوات للمفكرة</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModalStrategy(null)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
