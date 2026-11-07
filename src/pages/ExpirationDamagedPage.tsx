import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ArrowUpDown,
  Search,
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { InventoryBatch } from '../types/erp';
import { formatDate, getDaysBetween } from '../utils/date';
import { formatEGP } from '../utils/currency';

export const ExpirationDamagedPage: React.FC = () => {
  const { t, language } = useLanguage();
  const batches = mockDb.getBatches();
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();

  const enriched = batches.map((b) => {
    const expDate = new Date(b.expirationDate);
    const daysLeft = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let statusText = 'صالح للاستخدام';

    if (daysLeft < 0) {
      statusClass = 'bg-red-100 text-red-800 border-red-300';
      statusText = 'منتهي الصلاحية (محظور)';
    } else if (daysLeft <= 30) {
      statusClass = 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse';
      statusText = `حرج (${daysLeft} يوم متبقي)`;
    } else if (daysLeft <= 60) {
      statusClass = 'bg-amber-100 text-amber-800 border-amber-300';
      statusText = `تنبيه مبكر (${daysLeft} يوم)`;
    }

    return {
      ...b,
      daysLeft,
      statusClass,
      statusText,
    };
  });

  const filtered = enriched.filter(b =>
    (b.productName && b.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('expirationDamaged')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            مراقبة تواريخ انتهاء صلاحية الأغذية، الصرف بأولوية الانتهاء (FEFO)، والتوالف
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-red-50 border border-red-300 text-red-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span>نظام الصرف المعتمد: FEFO الإلزامي</span>
          </span>
        </div>
      </div>

      {/* FEFO Policy Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm">سياسة سلامة الغذاء والجودة لشركة الأمل:</div>
          <p className="mt-1 leading-relaxed text-[11px] opacity-90">
            يُحظر تماماً إصدار أي فاتورة بيع لمنتج متبقي على صلاحيته أقل من 15 يوماً دون موافقة الإدارة العامة. يتم تلقائياً اقتراح وصرف التشغيلات الأقرب انتهاءً أولاً لضمان سلامة مخزون السوبرماركت وتفادي الخسائر.
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cream-200 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالصنف أو رقم التشغيلة (Batch)..."
              className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">رقم التشغيلة (Batch #)</th>
                <th className="py-3 px-4">اسم المنتج الغذائي</th>
                <th className="py-3 px-4">تاريخ الإنتاج</th>
                <th className="py-3 px-4">تاريخ انتهاء الصلاحية</th>
                <th className="py-3 px-4">الأيام المتبقية</th>
                <th className="py-3 px-4">الكمية المتبقية</th>
                <th className="py-3 px-4">حالة الصلاحية والتصنيف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold-800">{b.batchNumber}</td>
                  <td className="py-3 px-4 font-bold text-bronze-900">{b.productName}</td>
                  <td className="py-3 px-4 font-mono text-bronze-500">{formatDate(b.manufacturingDate || '', language)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-bronze-800">{formatDate(b.expirationDate, language)}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={b.daysLeft <= 60 ? 'text-red-700' : 'text-emerald-700'}>
                      {b.daysLeft > 0 ? `${b.daysLeft} يوم` : 'منتهي'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-bronze-900">{b.remainingQuantity} عبوة</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${b.statusClass}`}>
                      {b.statusText}
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
