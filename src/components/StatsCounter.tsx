import React from 'react';
import { Users, UserCheck, School, Trophy } from 'lucide-react';
import { SchoolStats } from '../types';

interface StatsCounterProps {
  stats: SchoolStats;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'طالباً مسجلاً',
      count: `${stats.students}+`,
      subtitle: 'مسجلون بانتظام وفق نظام نور',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'معلماً ومربياً',
      count: stats.teachers,
      subtitle: 'كفاءات تعليمية وتربوية مؤهلة',
      icon: UserCheck,
      color: 'bg-sky-50 text-sky-700 border-sky-100 group-hover:border-sky-300',
      iconBg: 'bg-sky-600 text-white'
    },
    {
      title: 'فصلاً تعليمياً',
      count: stats.classes,
      subtitle: 'بيئات صفية مجهزة بأحدث التقنيات',
      icon: School,
      color: 'bg-amber-50 text-amber-700 border-amber-100 group-hover:border-amber-300',
      iconBg: 'bg-amber-600 text-white'
    },
    {
      title: 'جائزة تميز وتفوق',
      count: stats.awards,
      subtitle: 'إنجازات على مستوى المنطقة والوزارة',
      icon: Trophy,
      color: 'bg-purple-50 text-purple-700 border-purple-100 group-hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`group bg-white rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.color}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm transition-transform group-hover:scale-105 ${item.iconBg}`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {item.count}
                </div>
                <div className="text-sm font-bold text-slate-700">{item.title}</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
