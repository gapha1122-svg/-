import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  Users,
  Trophy,
  Lightbulb,
  Image as ImageIcon,
  MessageSquare,
  Sliders,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'calendar', label: 'التقويم المدرسي', icon: Calendar },
    { id: 'teachers', label: 'المعلمون', icon: Users },
    { id: 'students', label: 'لوحة الشرف', icon: Trophy },
    { id: 'strategies', label: 'استراتيجيات التعلم', icon: Lightbulb },
    { id: 'gallery', label: 'المعرض', icon: ImageIcon },
    { id: 'board', label: 'منبر الطلاب', icon: MessageSquare },
    ...(currentUser?.role === 'admin'
      ? [{ id: 'dashboard', label: 'لوحة الإدارة', icon: Sliders }]
      : [])
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Location Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-right group focus:outline-hidden text-slate-900 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  مدرسة بالشهم الابتدائية
                </h1>

                {/* المميز: دبوس الموقع التفاعلي مع تأثير النبض */}
                <a
                  href="https://maps.app.goo.gl/GXvQQP7sAzkgHEJo6"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/pin relative inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-115 active:scale-95 transition-all duration-200 cursor-pointer"
                  title="موقع المدرسة على الخريطة (انقر للانتقال المباشر)"
                  aria-label="موقع المدرسة على الخريطة"
                >
                  {/* نبض حيوي حول الدبوس */}
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-300"></span>
                  </span>
                  <MapPin className="w-4 h-4 fill-white text-white drop-shadow-xs group-hover/pin:animate-bounce" />
                </a>
              </div>

              <div className="mt-0.5">
                <span className="text-xs font-semibold text-emerald-700">
                  بيئة تعليمية محفزة للريادة والإبداع
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Auth / Admin actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold">{currentUser.name}</span>
              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول الإدارة</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-right ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2">
            {currentUser ? (
              <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل دخول الإدارة</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
