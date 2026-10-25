import React, { useState } from 'react';
import { X, UserPlus, Phone, Award, BookOpen } from 'lucide-react';
import { Teacher, Student } from '../types';

interface AddPersonModalProps {
  isOpen: boolean;
  type: 'teacher' | 'student';
  onClose: () => void;
  onAddTeacher: (teacher: Teacher) => void;
  onAddStudent: (student: Student) => void;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({
  isOpen,
  type,
  onClose,
  onAddTeacher,
  onAddStudent
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(type === 'teacher' ? 'معلم لغتي الجميلة' : 'الصف السادس');
  const [phone, setPhone] = useState('');
  const [info, setInfo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    if (type === 'teacher') {
      onAddTeacher({
        id: Date.now(),
        name: name.trim(),
        role: role.trim(),
        info: info.trim() || 'كادر تعليمي معتمد بمدرسة بالشهم الابتدائية',
        phone: phone.trim() || undefined,
        subject: role.trim().replace('معلم ', '')
      });
    } else {
      onAddStudent({
        id: Date.now(),
        name: name.trim(),
        role: role.trim(),
        info: info.trim() || 'طالب متميز في التحصيل والمواظبة'
      });
    }

    setName('');
    setPhone('');
    setInfo('');
    onClose();
  };

  const isTeacher = type === 'teacher';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isTeacher ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {isTeacher ? 'تسجيل معلم جديد بالكادر' : 'إضافة طالب متميز للوحة الشرف'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTeacher
                ? 'إدراج بيانات المعلم والتخصص في الدليل الرسمي'
                : 'تكريم الطالب وتسجيل إنجازه المميز'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الثلاثي أو الرباعي"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isTeacher ? 'التخصص التعليمي / الدور:' : 'الصف الدراسي:'}
            </label>
            {isTeacher ? (
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="مثال: معلم لغتي الجميلة، معلم الرياضيات، وكيل المدرسة"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
            ) : (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              >
                <option value="الصف السادس">الصف السادس</option>
                <option value="الصف الخامس">الصف الخامس</option>
                <option value="الصف الرابع">الصف الرابع</option>
              </select>
            )}
          </div>

          {isTeacher && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>رقم الجوال (اختياري للتواصل):</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900 text-right"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>{isTeacher ? 'الخبرة والإنجازات:' : 'مجال التميز أو الإنجاز:'}</span>
            </label>
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={3}
              placeholder={
                isTeacher
                  ? 'نبذة عن الخبرة، الدورات التخصصية، أو الإشراف على الأندية...'
                  : 'مثال: الأول في مسابقة القرآن، الفائز بأولمبياد الرياضيات، الطالب المثالي...'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer ${
                isTeacher
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
              }`}
            >
              حفظ وإدراج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
