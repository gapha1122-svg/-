import React, { useState } from 'react';
import { X, Flame, Bot, BookOpen, Trophy, Mic, Compass, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({ isOpen, onClose }) => {
  const [registeredClubId, setRegisteredClubId] = useState<number | null>(null);

  if (!isOpen) return null;

  const clubs = [
    {
      id: 1,
      title: 'نادي الروبوت والذكاء الاصطناعي',
      sub: 'برمجة الروبوتات وتصميم النماذج التفاعلية وبناء التفكير الخوارزمي.',
      icon: Bot,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'ابتكار وتقنية'
    },
    {
      id: 2,
      title: 'نادي الخط العربي والفنون التشكيلية',
      sub: 'صقل مهارات الخط الكوفي والنسخ والرقعة وإبراز المواهب الفنية.',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'أصالة وهوية'
    },
    {
      id: 3,
      title: 'دوري أبطال بالشهم الرياضي',
      sub: 'كرة القدم، كرة السلة، اللياقة البدنية ومهرجان ألعاب البراعم.',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'نشاط وصحة'
    },
    {
      id: 4,
      title: 'نادي الإلقاء والخطابة والإذاعة المدرسية',
      sub: 'بناء الشخصية القيادية والجرأة الأدبية وفنون الحوار الهادف.',
      icon: Mic,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'فصاحة وثقة'
    },
    {
      id: 5,
      title: 'جماعة الكشافة والأشبال',
      sub: 'الاعتماد على النفس، التعاون، وغرس قيم خدمة المجتمع والوطن.',
      icon: Compass,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'انضباط وريادة'
    }
  ];

  const handleRegisterClub = (id: number) => {
    setRegisteredClubId(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setRegisteredClubId(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                الأنشطة المدرسية والأندية الطلابية
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مساحات إثرائية لصقل مهارات ومواهب فرسان مدرسة بالشهم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clubs List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {clubs.map((club) => {
            const Icon = club.icon;
            const isRegistered = registeredClubId === club.id;

            return (
              <div
                key={club.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${club.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-extrabold text-base text-slate-900">{club.title}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {club.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{club.sub}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRegisterClub(club.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                    isRegistered
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isRegistered ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>تم تسجيلك بنجاح!</span>
                    </span>
                  ) : (
                    'طلب الانضمام للنادي'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          يبدأ تفعيل الأندية وحصص النشاط بعد الطابور الصباحي وفق الجدول المعتمد من رائد النشاط.
        </div>
      </div>
    </div>
  );
};
