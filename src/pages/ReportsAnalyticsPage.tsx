import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileText,
  DollarSign,
  TrendingUp,
  Package,
  Store,
  Layers,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { formatEGP, formatPercentage } from '../utils/currency';
import { formatDate } from '../utils/date';
import * as XLSX from 'xlsx';

export const ReportsAnalyticsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [reportType, setReportType] = useState<
    'sales_summary' | 'sales_by_rep' | 'sales_by_product' | 'customer_balances' | 'inventory_valuation'
  >('sales_summary');

  const invoices = mockDb.getInvoices(user!);
  const products = mockDb.getProducts();
  const reps = mockDb.getReps();
  const customers = mockDb.getCustomers(user!);
  const payments = mockDb.getPayments(user!);

  const handleExportExcel = () => {
    let exportData: any[] = [];
    let fileName = `Al_Amal_Report_${reportType}`;

    if (reportType === 'sales_summary') {
      exportData = invoices.map(i => ({
        'رقم الفاتورة': i.invoiceNumber,
        'العميل': i.customerName,
        'المندوب': i.representativeName,
        'التاريخ': i.invoiceDate,
        'الإجمالي': i.totalAmount,
        'المدفوع': i.paidAmount,
        'المتبقي': i.outstandingBalance,
      }));
    } else if (reportType === 'sales_by_rep') {
      exportData = reps.map(r => {
        const rInvs = invoices.filter(i => i.representativeId === r.id);
        const total = rInvs.reduce((a, b) => a + b.totalAmount, 0);
        return {
          'المندوب': r.fullNameAr,
          'كود المندوب': r.code,
          'عدد الفواتير': rInvs.length,
          'إجمالي المبيعات': total,
        };
      });
    } else if (reportType === 'inventory_valuation') {
      exportData = products.map(p => ({
        'كود الصنف': p.sku,
        'اسم الصنف': p.nameAr,
        'التصنيف': p.categoryName,
        'الوحدة': p.unit,
        'الكمية': p.stockQuantity,
        'سعر التكلفة': p.purchaseCost,
        'إجمالي القيمة': p.purchaseCost * p.stockQuantity,
      }));
    } else {
      exportData = customers.map(c => ({
        'كود العميل': c.code,
        'اسم العميل': c.nameAr,
        'المندوب': c.assignedRepName,
        'الرصيد المدين': c.currentBalance,
        'سقف الائتمان': c.creditLimit,
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI?.printPage) {
      electronAPI.printPage();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('reportsAnalytics')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            مركز التقارير الرقابية والمالية الموحدة لشركة الأمل لتوزيع الأغذية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bronze-300 hover:bg-cream-100 text-bronze-800 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{t('exportExcel')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{t('print')}</span>
          </button>
        </div>
      </div>

      {/* Report Selection Pills */}
      <div className="bg-white p-3 rounded-xl border border-gold-200/60 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
        {[
          { id: 'sales_summary', label: 'سجل المبيعات الشامل', icon: FileText },
          { id: 'sales_by_rep', label: 'مبيعات المناديب والمستهدف', icon: Users },
          { id: 'customer_balances', label: 'أرصدة وذمم العملاء', icon: Store },
          { id: 'inventory_valuation', label: 'تقييم مخزون المستودع المركزي', icon: Layers },
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = reportType === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setReportType(rep.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                isActive ? 'bg-gold-500 text-bronze-900 shadow-sm' : 'bg-cream-100 text-bronze-700 hover:bg-cream-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Table Based on Report Type */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {reportType === 'sales_summary' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <tr>
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">المندوب</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">قيمة الفاتورة</th>
                  <th className="py-3 px-4">المسدد</th>
                  <th className="py-3 px-4">المتبقي</th>
                  <th className="py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-cream-50">
                    <td className="py-3 px-4 font-mono font-bold text-gold-800">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold">{inv.customerName}</td>
                    <td className="py-3 px-4">{inv.representativeName}</td>
                    <td className="py-3 px-4 font-mono">{formatDate(inv.invoiceDate, language)}</td>
                    <td className="py-3 px-4 font-mono font-bold">{formatEGP(inv.totalAmount, language)}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">{formatEGP(inv.paidAmount, language)}</td>
                    <td className="py-3 px-4 font-mono text-amber-800">{formatEGP(inv.outstandingBalance, language)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t(inv.paymentStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'sales_by_rep' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <tr>
                  <th className="py-3 px-4">المندوب</th>
                  <th className="py-3 px-4">الكود</th>
                  <th className="py-3 px-4">الفواتير المحررة</th>
                  <th className="py-3 px-4">المستهدف (Target)</th>
                  <th className="py-3 px-4">صافي المبيعات</th>
                  <th className="py-3 px-4">نسبة الإنجاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {reps.map((rep) => {
                  const rInvs = invoices.filter(i => i.representativeId === rep.id);
                  const total = rInvs.reduce((a, b) => a + b.totalAmount, 0);
                  const ach = (total / rep.salesTargetMonthly) * 100;
                  return (
                    <tr key={rep.id} className="hover:bg-cream-50">
                      <td className="py-3 px-4 font-bold text-bronze-900">{rep.fullNameAr}</td>
                      <td className="py-3 px-4 font-mono text-gold-800 font-bold">{rep.code}</td>
                      <td className="py-3 px-4 font-mono">{rInvs.length}</td>
                      <td className="py-3 px-4 font-mono">{formatEGP(rep.salesTargetMonthly, language)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-gold-700">{formatEGP(total, language)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{formatPercentage(ach, language)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'customer_balances' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <tr>
                  <th className="py-3 px-4">كود العميل</th>
                  <th className="py-3 px-4">اسم المحل / السوبر ماركت</th>
                  <th className="py-3 px-4">المندوب المسؤول</th>
                  <th className="py-3 px-4">الرصيد المدين المستحق</th>
                  <th className="py-3 px-4">سقف الائتمان</th>
                  <th className="py-3 px-4">فترة الائتمان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50">
                    <td className="py-3 px-4 font-mono font-bold text-gold-800">{c.code}</td>
                    <td className="py-3 px-4 font-bold text-bronze-900">{c.nameAr}</td>
                    <td className="py-3 px-4 text-bronze-700">{c.assignedRepName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800 text-sm">{formatEGP(c.currentBalance, language)}</td>
                    <td className="py-3 px-4 font-mono">{formatEGP(c.creditLimit, language)}</td>
                    <td className="py-3 px-4 font-mono">{c.paymentTermsDays} يوم</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'inventory_valuation' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <tr>
                  <th className="py-3 px-4">كود الصنف SKU</th>
                  <th className="py-3 px-4">اسم الصنف الغذائي</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">الكمية بالمستودع</th>
                  <th className="py-3 px-4">سعر التكلفة</th>
                  <th className="py-3 px-4">القيمة الإجمالية بالمخزن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50">
                    <td className="py-3 px-4 font-mono font-bold text-gold-800">{p.sku}</td>
                    <td className="py-3 px-4 font-bold text-bronze-900">{p.nameAr}</td>
                    <td className="py-3 px-4 text-bronze-600">{p.categoryName}</td>
                    <td className="py-3 px-4 font-mono font-bold">{p.stockQuantity} {p.unit}</td>
                    <td className="py-3 px-4 font-mono">{formatEGP(p.purchaseCost, language)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gold-700">{formatEGP(p.purchaseCost * p.stockQuantity, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
