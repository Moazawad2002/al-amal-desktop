import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, Globe, UserCheck, Shield, Database } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import logoImg from '../../assets/logo.png';

interface DesktopTitleBarProps {
  onOpenSetup: () => void;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({ onOpenSetup }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, switchDemoUser, availableDemoUsers } = useAuth();
  const [isMaximized, setIsMaximized] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const electronAPI = (window as any).electronAPI;
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    if (electronAPI?.isMaximized) {
      electronAPI.isMaximized().then(setIsMaximized);
    }
  }, [electronAPI]);

  const handleMinimize = () => {
    electronAPI?.minimizeWindow?.();
  };

  const handleMaximize = () => {
    electronAPI?.maximizeWindow?.();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    electronAPI?.closeWindow?.();
  };

  return (
    <header className="h-10 bg-bronze-900 text-cream-100 flex items-center justify-between px-3 select-none border-b border-bronze-800 relative z-50">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src={logoImg}
          alt="Al Amal Logo"
          className="h-6 w-6 object-contain rounded-full bg-cream-100 p-0.5 border border-gold-500 shadow-sm"
        />
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs sm:text-sm tracking-wide text-gold-400">
            {language === 'ar' ? 'شركة الأمل للتوزيع' : 'Al Amal Distribution'}
          </span>
          <span className="text-bronze-400 text-xs hidden md:inline">|</span>
          <span className="text-bronze-300 text-xs hidden md:inline font-medium">
            {language === 'ar' ? 'نظام إدارة توزيع الأغذية (ERP)' : 'Food Distribution ERP'}
          </span>
        </div>

        {/* Database Status Pill */}
        <button
          onClick={onOpenSetup}
          title={isSupabaseLive ? 'Connected to live Supabase backend' : 'Running on Al Amal offline demo engine. Click to connect Supabase.'}
          className={`ml-2 px-2 py-0.5 text-[10px] font-semibold rounded flex items-center gap-1 transition-all ${
            isSupabaseLive
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 hover:bg-emerald-900'
              : 'bg-gold-950 text-gold-300 border border-gold-600 hover:bg-gold-900'
          }`}
        >
          <Database className="w-3 h-3" />
          <span>{isSupabaseLive ? 'Supabase Live' : 'Demo DB (Local)'}</span>
        </button>
      </div>

      {/* Right Controls: Role Switcher, Language & Window buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick User / Role Switcher for Pairing & Review */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-bronze-800 hover:bg-bronze-700 text-xs text-cream-200 transition-colors border border-bronze-700"
              title="تبديل المستخدم لاختبار صلاحيات RLS"
            >
              {user.role === 'manager' ? (
                <Shield className="w-3.5 h-3.5 text-gold-400" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="max-w-[120px] truncate font-medium text-[11px]">{user.fullName.split(' ')[0]}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                user.role === 'manager' ? 'bg-gold-500/20 text-gold-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {user.role === 'manager' ? 'مدير' : 'مندوب'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute top-9 left-0 sm:right-0 bg-bronze-800 border border-bronze-600 rounded-lg shadow-xl w-64 py-1 text-xs text-cream-100 z-50">
                <div className="px-3 py-1.5 border-b border-bronze-700 font-semibold text-gold-400 text-[11px]">
                  اختبار صلاحيات الحسابات الأربعة (RLS):
                </div>
                {availableDemoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchDemoUser(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 flex items-center justify-between hover:bg-bronze-700 transition-colors ${
                      user.id === u.id ? 'bg-gold-600/30 text-gold-300 font-bold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs">{u.fullName}</div>
                      <div className="text-[10px] text-bronze-400">{u.email}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      u.role === 'manager' ? 'bg-gold-900 text-gold-400 border border-gold-700' : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                    }`}>
                      {u.role === 'manager' ? 'مدير' : 'مندوب'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Language Selector */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-bronze-800 hover:bg-bronze-700 text-cream-200 text-xs border border-bronze-700 transition-colors"
          title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
        >
          <Globe className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-bold text-[11px]">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Native Electron Window Controls */}
        <div className="flex items-center ml-1 border-r border-bronze-700 pr-1">
          <button
            onClick={handleMinimize}
            className="w-7 h-7 flex items-center justify-center hover:bg-bronze-800 rounded text-cream-300 hover:text-cream-100 transition-colors"
            title="تصغير"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-7 h-7 flex items-center justify-center hover:bg-bronze-800 rounded text-cream-300 hover:text-cream-100 transition-colors"
            title={isMaximized ? 'استعادة' : 'تكبير'}
          >
            {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-red-600 rounded text-cream-300 hover:text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
