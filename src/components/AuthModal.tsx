import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('salemsaleh');
  const [password, setPassword] = useState('Qewr1324*');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'salemsaleh' && password === 'Qewr1324*') ||
      (username === 'admin' && password === 'admin123')
    ) {
      onLoginSuccess({
        username,
        name: username === 'salemsaleh' ? 'سالم صالح (مدير النظام)' : 'مدير مدرسة بالشهم',
        role: 'admin'
      });
      setError(null);
      onClose();
    } else {
      setError('عذراً، اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('salemsaleh');
    setPassword('Qewr1324*');
    onLoginSuccess({
      username: 'salemsaleh',
      name: 'سالم صالح (مدير النظام)',
      role: 'admin'
    });
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">تسجيل الدخول لإدارة المدرسة</h3>
          <p className="text-xs text-slate-500 mt-1">
            أدخل بيانات حسابك للوصول إلى لوحة المزامنة والإدارة
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المستخدم:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
            بيانات مدير النظام: <strong>salemsaleh</strong> / <strong>Qewr1324*</strong>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            دخول النظام
          </button>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            الدخول المباشر لحساب مدير النظام (salemsaleh)
          </button>
        </form>
      </div>
    </div>
  );
};
