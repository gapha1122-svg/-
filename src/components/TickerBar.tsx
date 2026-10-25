import { Volume2, Sparkles, Eye } from 'lucide-react';
import { VisitorStats } from '../types';

interface TickerBarProps {
  announcement: string;
  visitorStats?: VisitorStats;
}

export const TickerBar: React.FC<TickerBarProps> = ({ announcement, visitorStats }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs sm:text-sm py-2 px-3 sm:px-6 flex items-center justify-between gap-3 overflow-hidden select-none">
      <div className="flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-full text-xs shrink-0 shadow-sm animate-pulse">
        <Volume2 className="w-3.5 h-3.5" />
        <span>تنويه مهم</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap text-slate-200 hover:text-white transition-colors cursor-default">
          {announcement}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 shrink-0">
        {visitorStats && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>الزوار:</span>
            <span className="font-mono text-emerald-300 font-bold" dir="ltr">
              {visitorStats.totalVisitors.toLocaleString('ar-SA')}
            </span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>العام الدراسي 1448هـ</span>
        </div>
      </div>
    </div>
  );
};
