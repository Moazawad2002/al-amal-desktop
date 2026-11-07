import React, { useState } from 'react';
import { Settings, Building, Globe, DollarSign, Warehouse, Shield, Check, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

interface SettingsPageProps {
  onOpenSetup: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenSetup }) => {
  const { t, language, setLanguage } = useLanguage();
  const [saved, setSaved] = useState(false);

  // Settings State
  const [companyNameAr, setCompanyNameAr] = useState('شركة الأمل لتوزيع المنتجات الغذائية');
  const [companyNameEn, setCompanyNameEn] = useState('Al Amal Food Distribution Co.');
  const [currency, setCurrency] = useState('EGP (ج.م)');
  const [warehouseLocation, setWarehouseLocation] = useState('المنطقة الصناعية الأولى - مدينة العبور - بلوك 12004');
  const [nearExpiryDays, setNearExpiryDays] = useState(60);
  const [defaultCreditLimit, setDefaultCreditLimit] = useState(30000);
  const [vatRate, setVatRate] = useState(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('settings')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            إعدادات هوية المنشأة، معايير الرقابة والائتمان، وخيارات النظام المكتبي
          </p>
        </div>

        <button
          onClick={onOpenSetup}
          className="px-3.5 py-2 rounded-xl bg-bronze-800 hover:bg-bronze-700 text-cream-100 text-xs font-bold transition-colors"
        >
          تهيئة سيرفر Supabase
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white p-6 rounded-2xl border border-gold-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain rounded-full bg-cream-100 p-1 border border-gold-400" />
            <div>
              <h2 className="font-bold text-sm text-bronze-900">بيانات وهوية شركة الأمل</h2>
              <span className="text-[11px] text-bronze-500">تظهر في ترويسة الفواتير والتقارير الرسمية وسندات القبض</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">اسم المنشأة باللغة العربية:</label>
              <input
                type="text"
                value={companyNameAr}
                onChange={(e) => setCompanyNameAr(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Company Name in English:</label>
              <input
                type="text"
                value={companyNameEn}
                onChange={(e) => setCompanyNameEn(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">موقع المستودع المركزي الوحيد (العبور):</label>
            <input
              type="text"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Financial & Inventory Rules */}
        <div className="bg-white p-6 rounded-2xl border border-gold-200 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-sm text-bronze-900 border-b pb-2">
            سياسات الائتمان ومحددات الصلاحية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">العملة الافتراضية:</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 font-bold font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">تنبيه انتهاء الصلاحية المسبق (أيام):</label>
              <input
                type="number"
                min="15"
                value={nearExpiryDays}
                onChange={(e) => setNearExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">سقف الائتمان الافتراضي للعميل الجديد (ج.م):</label>
              <input
                type="number"
                min="5000"
                step="5000"
                value={defaultCreditLimit}
                onChange={(e) => setDefaultCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1 border border-emerald-300">
              <Check className="w-4 h-4" />
              <span>تم حفظ وتطبيق الإعدادات بنجاح</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
