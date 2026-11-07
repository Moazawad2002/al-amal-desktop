import React, { useState } from 'react';
import {
  Users,
  Target,
  Trophy,
  Award,
  Phone,
  BarChart,
  Edit2,
  CheckCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { formatEGP, formatPercentage } from '../utils/currency';

export const SalesRepsPerformancePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const reps = mockDb.getReps();
  const invoices = mockDb.getInvoices(user!);
  const payments = mockDb.getPayments(user!);
  const customers = mockDb.getCustomers(user!);
  const targets = mockDb.getTargets(user!);

  const [selectedRep, setSelectedRep] = useState<any | null>(null);
  const [newTarget, setNewTarget] = useState(600000);

  const repDetails = reps.map((rep, idx) => {
    const rInvoices = invoices.filter(i => i.representativeId === rep.id);
    const rPayments = payments.filter(p => p.representativeId === rep.id);
    const rCustomers = customers.filter(c => c.assignedRepId === rep.id);
    const tgt = targets.find(t => t.representativeId === rep.id);

    const netSales = rInvoices.reduce((a, b) => a + b.totalAmount, 0);
    const collections = rPayments.reduce((a, b) => a + b.amount, 0);
    const targetAmt = tgt?.targetAmount || rep.salesTargetMonthly;
    const achievement = targetAmt > 0 ? (netSales / targetAmt) * 100 : 0;
    const commission = (netSales * rep.commissionRate) / 100;
    const collectionRate = netSales > 0 ? (collections / netSales) * 100 : 0;

    return {
      ...rep,
      rank: idx + 1,
      invoiceCount: rInvoices.length,
      customerCount: rCustomers.length,
      netSales,
      collections,
      targetAmt,
      achievement,
      commission,
      collectionRate,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('salesReps')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            متابعة إنجاز التارجت الشهري، عمولات البيع، ومعدلات التحصيل لمناديب الشركة الثلاثة
          </p>
        </div>
      </div>

      {/* Rep Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {repDetails.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gold-500 text-bronze-900 font-black text-[11px] px-3 py-1 rounded-bl-xl shadow">
              المركز {rep.rank}
            </div>

            <div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-900 font-black text-base flex items-center justify-center border-2 border-gold-400">
                  {rep.fullNameAr.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-sm text-bronze-900">{rep.fullNameAr}</h2>
                  <div className="text-[11px] text-bronze-500 font-mono mt-0.5">{rep.phone}</div>
                </div>
              </div>

              {/* Target & Progress */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-bronze-600 font-medium">نسبة تحقيق التارجت:</span>
                  <span className="font-bold font-mono text-gold-700">{formatPercentage(rep.achievement, language)}</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${rep.achievement >= 90 ? 'bg-emerald-600' : 'bg-gold-500'}`}
                    style={{ width: `${Math.min(100, rep.achievement)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-bronze-500 font-mono">
                  <span>المحقق: {formatEGP(rep.netSales, language)}</span>
                  <span>المستهدف: {formatEGP(rep.targetAmt, language)}</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="mt-4 p-3 bg-cream-50 rounded-xl border border-cream-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-bronze-600">المحصل الفعلي:</span>
                  <span className="font-bold font-mono text-emerald-800">{formatEGP(rep.collections, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bronze-600">العملاء النشطين:</span>
                  <span className="font-bold font-mono">{rep.customerCount} سوبرماركت</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bronze-600">العمولة المستحقة ({rep.commissionRate}%):</span>
                  <span className="font-bold font-mono text-gold-700">{formatEGP(rep.commission, language)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                معدل تحصيل {formatPercentage(rep.collectionRate, language)}
              </span>
              <button
                onClick={() => {
                  setSelectedRep(rep);
                  setNewTarget(rep.targetAmt);
                }}
                className="text-gold-700 hover:text-gold-900 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل التارجت</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Target Modal */}
      {selectedRep && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-sm w-full p-5 text-right space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-bold text-sm text-bronze-900">تعديل المستهدف الشهري</span>
              <button onClick={() => setSelectedRep(null)}><X className="w-4 h-4" /></button>
            </div>

            <div>
              <span className="text-bronze-600 block">المندوب:</span>
              <span className="font-bold text-sm text-gold-800">{selectedRep.fullNameAr}</span>
            </div>

            <div>
              <label className="block font-semibold mb-1">المستهدف الجديد (ج.م):</label>
              <input
                type="number"
                min="10000"
                step="10000"
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRep(null)}
                className="px-3 py-1.5 border rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  selectedRep.targetAmt = newTarget;
                  setSelectedRep(null);
                }}
                className="px-4 py-1.5 bg-gold-600 text-white font-bold rounded-lg shadow"
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
