import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const LoginPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { login, availableDemoUsers } = useAuth();

  const [email, setEmail] = useState('manager@alamal-eg.com');
  const [password, setPassword] = useState('AlAmal#2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ok = await login(email, password);
      if (!ok) {
        setError('بيانات الدخول غير صحيحة أو الحساب غير مصرح له.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (uEmail: string) => {
    setEmail(uEmail);
    setPassword('AlAmal#2026!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 select-none">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gold-200 overflow-hidden text-right">
        {/* Top Company Branding Banner */}
        <div className="bg-gradient-to-b from-bronze-900 to-bronze-800 text-cream-100 p-8 text-center border-b-4 border-gold-500 relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-cream-100 p-2 shadow-lg border-2 border-gold-500 mb-3 flex items-center justify-center">
            <img src={logoImg} alt="Al Amal Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-black text-gold-300 tracking-tight">
            شركة الأمل لتوزيع المنتجات الغذائية
          </h1>
          <p className="text-xs text-bronze-300 mt-1 font-medium">
            نظام إدارة المبيعات والمستودعات والتحصيلات | Desktop ERP
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8 space-y-5 text-xs text-bronze-800">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-semibold text-bronze-700 mb-1">
                {t('email')}:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 border border-bronze-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-left font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-bronze-700 mb-1">
                {t('password')}:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-9 pl-9 py-2.5 border border-bronze-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-left font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-bronze-400 hover:text-bronze-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <span className="text-bronze-600 font-medium">{t('rememberMe')}</span>
              </label>
              <span className="text-bronze-400">نظام مشفر ومحمي بـ RLS</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>

          {/* Quick-Access Authorized Accounts */}
          <div className="pt-4 border-t border-cream-300">
            <span className="block text-[11px] font-bold text-bronze-600 mb-2.5">
              الدخول السريع بالحسابات الأربعة المصرح بها (تجربة الصلاحيات):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {availableDemoUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u.email)}
                  className={`p-2 rounded-xl border text-right transition-colors ${
                    email === u.email
                      ? 'border-gold-500 bg-gold-50 text-gold-900 font-bold'
                      : 'border-cream-300 bg-cream-50 hover:bg-cream-100 text-bronze-700'
                  }`}
                >
                  <div className="truncate">{u.fullName.split(' ')[0]} {u.fullName.split(' ')[1] || ''}</div>
                  <div className="text-[10px] text-bronze-400 mt-0.5">
                    {u.role === 'manager' ? 'المدير العام' : 'مندوب مبيعات'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
