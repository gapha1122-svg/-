import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CalendarDays,
  ListFilter,
  Trash2,
  Edit3,
  Download,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SchoolEvent, UserSession, EventCategory } from '../types';

interface SchoolCalendarProps {
  events: SchoolEvent[];
  currentUser: UserSession | null;
  onOpenAddEvent: () => void;
  onEditEvent: (event: SchoolEvent) => void;
  onDeleteEvent: (id: number) => void;
}

export const SchoolCalendar: React.FC<SchoolCalendarProps> = ({
  events,
  currentUser,
  onOpenAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Month navigation for grid view
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(2026, 10, 1)); // November 2026

  const categories = [
    { id: 'all', label: 'كافة الفعاليات', color: 'bg-slate-100 text-slate-800' },
    { id: 'exam', label: '📝 الاختبارات والتقييم', color: 'bg-rose-100 text-rose-800' },
    { id: 'holiday', label: '🏖️ الإجازات الرسمية', color: 'bg-sky-100 text-sky-800' },
    { id: 'activity', label: '🏆 الأنشطة والبطولات', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'meeting', label: '🤝 اللقاءات والجمعيات', color: 'bg-purple-100 text-purple-800' }
  ];

  const getCategoryConfig = (cat: EventCategory) => {
    switch (cat) {
      case 'exam':
        return {
          label: 'اختبارات وتقييم',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          accent: 'border-r-4 border-r-rose-500'
        };
      case 'holiday':
        return {
          label: 'إجازة رسمية',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
          accent: 'border-r-4 border-r-sky-500'
        };
      case 'activity':
        return {
          label: 'نشاط وفعالية',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          accent: 'border-r-4 border-r-emerald-500'
        };
      case 'meeting':
      default:
        return {
          label: 'لقاء واجتماع',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          accent: 'border-r-4 border-r-purple-500'
        };
    }
  };

  // Sort events chronologically
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((ev) => {
      const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.hijriDate && ev.hijriDate.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [sortedEvents, selectedCategory, searchQuery]);

  // Days countdown helper
  const getDaysDiffText = (dateStr: string) => {
    const today = new Date('2026-10-24');
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'اليوم', color: 'bg-rose-600 text-white animate-pulse' };
    if (diffDays === 1) return { text: 'غداً', color: 'bg-amber-500 text-slate-950 font-black' };
    if (diffDays > 1 && diffDays <= 7)
      return { text: `بعد ${diffDays} أيام`, color: 'bg-amber-100 text-amber-900 font-bold' };
    if (diffDays > 7)
      return { text: `بعد ${diffDays} يوماً`, color: 'bg-slate-100 text-slate-700 font-bold' };
    return { text: 'مضت', color: 'bg-slate-100 text-slate-400' };
  };

  // Share / Copy event
  const handleShareEvent = (ev: SchoolEvent) => {
    const text = `فعالية مدرسية: ${ev.title}\nالموعد: ${ev.date} (${ev.hijriDate || ''})\nالوقت: ${ev.time || 'طوال اليوم'}\nالمكان: ${ev.location || 'مدرسة بالشهم الابتدائية'}\nالتفاصيل: ${ev.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export iCalendar (.ics)
  const handleExportICS = () => {
    let icsContent =
      'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Balshaham Elementary School//Calendar//AR\nCALSCALE:GREGORIAN\n';
    filteredEvents.forEach((ev) => {
      const cleanDate = ev.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.description}\nDTSTART;VALUE=DATE:${cleanDate}\nLOCATION:${ev.location || 'مدرسة بالشهم الابتدائية'}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'جدول_فعاليات_مدرسة_بالشهم.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Month navigation helpers for Grid view
  const monthNames = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ];

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>التقويم الدراسي المعتمد 1448هـ / 2026م</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            التقويم والفعاليات المدرسية
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            دليل المواعيد الهامة للاختبارات، الإجازات الرسمية، الأنشطة المدرسية، ولقاءات أولياء
            الأمور
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportICS}
            title="تصدير للتقويم الرقمي"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">حفظ في التقويم (.ics)</span>
          </button>

          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فعالية جديدة</span>
          </button>
        </div>
      </div>

      {/* Controls & Category Filter */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الفعالية، المكان، أو التاريخ..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full md:w-auto justify-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>عرض القائمة</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>عرض التقويم الشهري</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Cards List */}
      {viewMode === 'cards' ? (
        filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 mb-1">
              لا توجد فعاليات مطابقة لخيارات البحث
            </h3>
            <p className="text-xs text-slate-500">
              يمكنك اختيار تصنيف مختلف من الأعلى أو إضافة فعالية جديدة.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((ev) => {
              const cfg = getCategoryConfig(ev.category);
              const countdown = getDaysDiffText(ev.date);

              return (
                <div
                  key={ev.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 relative group ${cfg.accent}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>

                      {ev.isImportant && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>تنبيه مهم وعاجل</span>
                        </span>
                      )}

                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full ${countdown.color}`}
                      >
                        {countdown.text}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {ev.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-3xl">
                      {ev.description}
                    </p>

                    {/* Metadata details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span dir="ltr">{ev.date}</span>
                        {ev.hijriDate && (
                          <span className="text-slate-400">({ev.hijriDate})</span>
                        )}
                      </div>

                      {ev.time && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>{ev.time}</span>
                        </div>
                      )}

                      {ev.location && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{ev.location}</span>
                        </div>
                      )}

                      {ev.targetAudience && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          <span>المستهدف: {ev.targetAudience}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleShareEvent(ev)}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      title="نسخ تفاصيل الفعالية"
                    >
                      {copiedId === ev.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-[11px] text-emerald-700">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span className="text-[11px]">مشاركة</span>
                        </>
                      )}
                    </button>

                    {/* Teacher/Admin Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditEvent(ev)}
                        title="تعديل الفعالية"
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف فعالية "${ev.title}"؟`)) {
                            onDeleteEvent(ev.id);
                          }
                        }}
                        title="حذف الفعالية"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* View Mode: Month Grid */
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
              <span>
                {monthNames[month]} {year}م
              </span>
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                title="الشهر السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                title="الشهر القادم"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
            <div>الأحد</div>
            <div>الإثنين</div>
            <div>الثلاثاء</div>
            <div>الأربعاء</div>
            <div>الخميس</div>
            <div className="text-rose-500">الجمعة</div>
            <div className="text-rose-500">السبت</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before start of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-24 bg-slate-50/50 rounded-xl" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;

              const dayEvents = sortedEvents.filter((e) => e.date === formattedDateStr);
              const isToday = formattedDateStr === '2026-10-24';

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-24 p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-emerald-50/80 border-emerald-400 font-bold'
                      : dayEvents.length > 0
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-slate-100 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center'
                          : 'text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {/* Day Events preview */}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                    {dayEvents.map((ev) => {
                      const cfg = getCategoryConfig(ev.category);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => onEditEvent(ev)}
                          title={`${ev.title} (${ev.time || ''})`}
                          className={`text-[10px] p-1 rounded-md truncate cursor-pointer font-bold ${cfg.badge}`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
