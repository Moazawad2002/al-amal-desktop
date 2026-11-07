import React, { useState } from 'react';
import { RotateCcw, Plus, Search, AlertCircle, CheckCircle, Package, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { formatEGP } from '../utils/currency';
import { formatDate } from '../utils/date';

export const ReturnsDiscountsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [returns, setReturns] = useState([
    {
      id: 'ret-01',
      returnNumber: 'RET-2026-001',
      invoiceNumber: 'INV-2026-0101',
      customerName: 'خير زمان - فرع روض الفرج',
      repName: 'أحمد حسن',
      date: '2026-10-06',
      amount: 1950,
      disposition: 'restock_saleable',
      reason: 'زيادة عن احتياج المحل (عبوات سليمة ومغلقة)',
      status: 'approved',
    },
    {
      id: 'ret-02',
      returnNumber: 'RET-2026-002',
      invoiceNumber: 'INV-2026-0102',
      customerName: 'هايبر وان - فرع الشيخ زايد',
      repName: 'محمود علي',
      date: '2026-10-09',
      amount: 880,
      disposition: 'writeoff_damaged',
      reason: 'شرخ في كرتونة زيت أثناء التعتيق والتنزيل',
      status: 'approved',
    }
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('returnsDiscounts')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            إدارة مرتجعات العملاء، فحص سلامة العبوات الغذائية، وتوجيه المخزون (صالح للبيع / هالك)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">رقم إشعار المرتجع</th>
                <th className="py-3 px-4">رقم الفاتورة الأصلية</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">المندوب</th>
                <th className="py-3 px-4">تاريخ الإرجاع</th>
                <th className="py-3 px-4">قيمة المرتجع</th>
                <th className="py-3 px-4">توجيه البضاعة المرتجعة</th>
                <th className="py-3 px-4">السبب</th>
                <th className="py-3 px-4">حالة الاعتماد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold-800">{ret.returnNumber}</td>
                  <td className="py-3 px-4 font-mono text-bronze-600">{ret.invoiceNumber}</td>
                  <td className="py-3 px-4 font-bold text-bronze-900">{ret.customerName}</td>
                  <td className="py-3 px-4 text-bronze-700">{ret.repName}</td>
                  <td className="py-3 px-4 font-mono text-bronze-500">{formatDate(ret.date, language)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-red-700">{formatEGP(ret.amount, language)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ret.disposition === 'restock_saleable'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {ret.disposition === 'restock_saleable' ? 'إعادة للمخزون الصالح' : 'إعدام وتوالف نقل'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-bronze-700 max-w-xs truncate">{ret.reason}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      معتمد رسمياً
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
