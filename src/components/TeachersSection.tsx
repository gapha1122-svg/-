import React, { useState, useMemo } from 'react';
import { Users, Search, Phone, Plus, Trash2, Award, BookOpen } from 'lucide-react';
import { Teacher, UserSession } from '../types';

interface TeachersSectionProps {
  teachers: Teacher[];
  currentUser: UserSession | null;
  onOpenAddTeacher: () => void;
  onDeleteTeacher: (id: number) => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  currentUser,
  onOpenAddTeacher,
  onDeleteTeacher
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    return ['all', ...Array.from(set)];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSubject = selectedSubject === 'all' || t.subject === selectedSubject;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.info.toLowerCase().includes(q);
      return matchSubject && matchQuery;
    });
  }, [teachers, selectedSubject, searchQuery]);

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>الهيئة التعليمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            نخبة المعلمين والمربين
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            كفاءات تعليمية وتربوية متميزة تسعى لبناء جيل طموح مبدع وواثق
          </p>
        </div>

        <button
          onClick={onOpenAddTeacher}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل معلم جديد</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المعلم أو التخصص..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 shrink-0">التخصص:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub === 'all' ? 'كافة التخصصات' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">لا يوجد معلمون مطابقون لخيارات البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 relative group"
            >
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onDeleteTeacher(teacher.id)}
                  title="حذف المعلم (صلاحية الإدارة)"
                  className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-800 flex items-center justify-center font-black text-xl shadow-xs border border-emerald-200/60 shrink-0">
                    {teacher.name.split(' ')[0]?.charAt(0) || 'م'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 inline-block mb-1">
                      {teacher.role}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {teacher.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {teacher.info}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {teacher.phone ? (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-colors border border-slate-200/80"
                    dir="ltr"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{teacher.phone}</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>الكادر الرسمي</span>
                  </span>
                )}

                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Award className="w-3 h-3" />
                  <span>معتمد</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
