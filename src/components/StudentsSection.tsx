import React, { useState, useMemo } from 'react';
import { Trophy, Search, Plus, Sparkles, Trash2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, UserSession } from '../types';

interface StudentsSectionProps {
  students: Student[];
  currentUser: UserSession | null;
  onOpenAddStudent: () => void;
  onDeleteStudent: (id: number) => void;
}

export const StudentsSection: React.FC<StudentsSectionProps> = ({
  students,
  currentUser,
  onOpenAddStudent,
  onDeleteStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [celebratedId, setCelebratedId] = useState<number | null>(null);

  const gradeOptions = [
    { id: 'all', label: 'كافة الصفوف العليا (الرابع - الخامس - السادس)' },
    { id: 'الصف السادس', label: '🎓 الصف السادس' },
    { id: 'الصف الخامس', label: '📘 الصف الخامس' },
    { id: 'الصف الرابع', label: '📗 الصف الرابع' }
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchGrade = selectedGrade === 'all' || s.role.includes(selectedGrade);
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q || s.name.toLowerCase().includes(q) || s.info.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [students, selectedGrade, searchQuery]);

  const triggerCelebration = (id: number) => {
    setCelebratedId(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCelebratedId(null), 1500);
  };

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>لوحة الشرف والتكريم • الصفوف العليا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            فرسان التميز والتفوق العلمي
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            تكريم فرسان الصف السادس، الصف الخامس، والصف الرابع في التحصيل الدراسي، الأنشطة، والسلوك القويم
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب متفوق</span>
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
            placeholder="ابحث باسم الطالب أو الإنجاز..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-amber-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 shrink-0">الصف:</span>
          {gradeOptions.map((g) => {
            const count =
              g.id === 'all'
                ? students.filter((s) =>
                    ['الصف السادس', 'الصف الخامس', 'الصف الرابع'].some((r) => s.role.includes(r))
                  ).length
                : students.filter((s) => s.role.includes(g.id)).length;

            return (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedGrade === g.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{g.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedGrade === g.id
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Students Cards */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">لا يوجد طلاب متفوقون مطابقون لخيارات البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 relative group text-center"
            >
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  title="حذف الطالب (صلاحية الإدارة)"
                  className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div>
                <div className="w-20 h-20 rounded-full mx-auto mb-3.5 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 text-amber-900 flex items-center justify-center font-black text-2xl shadow-inner border-2 border-white">
                  <Trophy className="w-9 h-9 text-amber-700" />
                </div>

                <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 inline-block mb-1.5">
                  {student.role}
                </span>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors mb-2">
                  {student.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                  {student.info}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => triggerCelebration(student.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    celebratedId === student.id
                      ? 'bg-amber-500 text-slate-950 scale-105 shadow-md shadow-amber-500/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/80'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {celebratedId === student.id ? 'تهانينا الحارة! 🎉' : 'احتفال بالإنجاز'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
