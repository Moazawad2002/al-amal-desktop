import React, { useState } from 'react';
import { Database, Key, CheckCircle2, AlertCircle, RefreshCw, X, Shield } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { mockDb } from '../../services/mockDatabase';

interface SetupScreenProps {
  onClose: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose }) => {
  const [url, setUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });
  const [resetDone, setResetDone] = useState(false);

  const isLive = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setTestResult({ status: 'idle', message: 'جاري فحص الاتصال بقاعدة البيانات...' });
    try {
      if (!url || !anonKey || url.includes('your-project-id')) {
        setTestResult({
          status: 'error',
          message: 'برجاء إدخال رابط مشروع Supabase ومفتاح Anon Key الصحيح.',
        });
        return;
      }
      const response = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: anonKey },
      });
      if (response.ok || response.status === 200) {
        setTestResult({
          status: 'success',
          message: 'تم التحقق من الاتصال بنجاح مع Supabase REST API!',
        });
      } else {
        setTestResult({
          status: 'error',
          message: `فشل الاتصال: رمز الاستجابة ${response.status}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `خطأ في الاتصال بالشبكة: ${err.message || 'تعذر الوصول'}`,
      });
    }
  };

  const handleResetDemoData = () => {
    mockDb.resetToDemo();
    setResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-xl w-full overflow-hidden text-right">
        {/* Header */}
        <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-gold-400" />
            <h2 className="font-bold text-base text-gold-300">
              إعدادات الاتصال وقاعدة البيانات | Supabase Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bronze-800 text-cream-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-bronze-800">
          {/* Current Status Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isLive
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-gold-50 border-gold-300 text-gold-950'
          }`}>
            <Shield className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">
                {isLive ? 'النظام متصل حالياً بسيرفر Supabase السحابي' : 'يعمل النظام حالياً بمحرك العرض التوضيحي المكتبي (Local Demo Engine)'}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                {isLive
                  ? 'تم التحقق من بيانات الاتصال مع Supabase وتفعيل سياسات الأمان RLS.'
                  : 'يمكنك استخدام التطبيق بالكامل وتجربة كافة العمليات والتقارير والمناديب والمخزون، أو إدخال مفاتيح Supabase أدناه للربط الحي.'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block font-semibold text-bronze-700 mb-1">
                Supabase Project URL (رابط المشروع):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 border border-bronze-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono text-left text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-bronze-700 mb-1">
                Supabase Public Anon Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  className="w-full px-3 py-2 border border-bronze-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono text-left text-xs"
                />
              </div>
            </div>
          </div>

          {/* Test Status feedback */}
          {testResult.message && (
            <div className={`p-3 rounded-lg border flex items-center gap-2 ${
              testResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : testResult.status === 'error'
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-blue-50 border-blue-300 text-blue-800'
            }`}>
              {testResult.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : testResult.status === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-bronze-200">
            <button
              onClick={handleResetDemoData}
              className="px-3 py-2 rounded-lg border border-bronze-300 bg-cream-50 hover:bg-cream-200 text-bronze-800 transition-colors flex items-center gap-1.5 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{resetDone ? 'تمت إعادة الضبط! جاري التحديث...' : 'إعادة ضبط البيانات التوضيحية'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-bronze-300 text-bronze-700 hover:bg-cream-100 font-medium"
              >
                إغلاق
              </button>
              <button
                onClick={handleTestConnection}
                className="px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-700 text-white font-bold transition-colors shadow-sm"
              >
                فحص الاتصال
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
