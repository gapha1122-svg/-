import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Users, AlertTriangle, Save, Check } from 'lucide-react';
import { SchoolEvent, EventCategory } from '../types';

interface EventModalProps {
  isOpen: boolean;
  eventToEdit: SchoolEvent | null;
  onClose: () => void;
  onSaveEvent: (event: SchoolEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  eventToEdit,
  onClose,
  onSaveEvent
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('exam');
  const [date, setDate] = useState('2026-11-01');
  const [hijriDate, setHijriDate] = useState('');
  const [time, setTime] = useState('07:30 ص');
  const [location, setLocation] = useState('قاعات المدرسة');
  const [targetAudience, setTargetAudience] = useState('جميع الطلاب');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setCategory(eventToEdit.category);
      setDate(eventToEdit.date);
      setHijriDate(eventToEdit.hijriDate || '');
      setTime(eventToEdit.time || '');
      setLocation(eventToEdit.location || '');
      setTargetAudience(eventToEdit.targetAudience || 'جميع الطلاب');
      setDescription(eventToEdit.description);
      setIsImportant(Boolean(eventToEdit.isImportant));
    } else {
      setTitle('');
      setCategory('exam');
      setDate(new Date().toISOString().split('T')[0]);
      setHijriDate('1448/05/25هـ');
      setTime('07:30 ص');
      setLocation('مدرسة بالشهم الابتدائية');
      setTargetAudience('جميع الطلاب');
      setDescription('');
      setIsImportant(false);
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const eventData: SchoolEvent = {
      id: eventToEdit ? eventToEdit.id : Date.now(),
      title: title.trim(),
      category,
      date,
      hijriDate: hijriDate.trim() || undefined,
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      description: description.trim() || title.trim(),
      isImportant
    };

    onSaveEvent(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {eventToEdit ? 'تعديل فعالية بالتقويم المدرسي' : 'إضافة موعد أو فعالية جديدة'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              متاح لمعلمي وإدارة مدرسة بالشهم الابتدائية لتحديث الجدول الدراسي
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              عنوان الفعالية / الموعد:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الاختبارات النصفية، إجازة مطولة، دوري البراعم، اجتماع أولياء الأمور..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تصنيف الفعالية:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              >
                <option value="exam">📝 اختبارات وتقييم</option>
                <option value="holiday">🏖️ إجازة رسمية ومطولة</option>
                <option value="activity">🏆 نشاط ومسابقة طلابية</option>
                <option value="meeting">🤝 لقاء واجتماع جمعية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المستهدفون:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="مثال: جميع الطلاب، أولياء الأمور، المعلمون"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                التاريخ الميلادي:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                التاريخ الهجري (اختياري):
              </label>
              <input
                type="text"
                value={hijriDate}
                onChange={(e) => setHijriDate(e.target.value)}
                placeholder="مثال: 1448/06/03هـ"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>الوقت:</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="مثال: 07:30 ص أو طوال اليوم"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>المكان / القاعة:</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: قاعات المدرسة، المسرح، الملعب"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تفاصيل وتوجيهات الفعالية:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب نبذة عن الفعالية، تعليمات الحضور، أو تفاصيل الموعد..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <input
              type="checkbox"
              id="isImportantCheck"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="isImportantCheck"
              className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>تمييز الفعالية كتنبيه هام وعاجل لأولياء الأمور والطلاب</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{eventToEdit ? 'حفظ التعديلات' : 'إضافة للتقويم المعتمد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
