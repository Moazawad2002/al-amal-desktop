import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Users,
  Target,
  PlusCircle,
  BadgeDollarSign,
  CheckCircle,
  Clock,
  Phone,
  Store,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { KPICard } from '../components/common/KPICard';
import { formatEGP, formatPercentage } from '../utils/currency';
import { formatDate } from '../utils/date';
import { AppPage } from '../components/layout/Sidebar';

interface RepresentativeDashboardProps {
  onNavigate: (page: AppPage) => void;
}

export const RepresentativeDashboardPage: React.FC<RepresentativeDashboardProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const myInvoices = mockDb.getInvoices(user!);
  const myCustomers = mockDb.getCustomers(user!);
  const myPayments = mockDb.getPayments(user!);
  const myTargets = mockDb.getTargets(user!);

  const target = myTargets[0];
  const netSales = myInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const myCollections = myPayments.reduce((acc, p) => acc + p.amount, 0);
  const myReceivables = myCustomers.reduce((acc, c) => acc + c.currentBalance, 0);
  const avgInvoiceValue = myInvoices.length > 0 ? netSales / myInvoices.length : 0;
  const targetAmount = target?.targetAmount || 600000;
  const achievementRate = targetAmount > 0 ? (netSales / targetAmount) * 100 : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bronze-900 via-bronze-800 to-gold-900 text-cream-100 p-5 rounded-2xl shadow-md border border-gold-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-bronze-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              مندوب مبيعات معتمد
            </span>
            <span className="text-xs text-gold-300 font-mono">
              {user?.representativeId?.toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1 text-gold-300 tracking-tight">
            {t('welcome')}، {user?.fullName}
          </h1>
          <p className="text-xs text-cream-200 mt-1">
            لوحة العمل الميدانية ومتابعة فواتير وتحصيلات خط السير المصرح لك
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('sales-invoices')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 font-bold text-xs shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('createInvoice')}</span>
          </button>
          <button
            onClick={() => onNavigate('collections-receivables')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-bronze-700 hover:bg-bronze-600 text-cream-100 font-medium text-xs border border-bronze-600 transition-colors"
          >
            <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
            <span>{t('recordCollection')}</span>
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="مبيعاتي المحققة"
          value={formatEGP(netSales, language)}
          subtitle={`${myInvoices.length} فاتورة مسجلة`}
          icon={FileText}
          variant="gold"
          trend={{ value: `${formatPercentage(achievementRate, language)} التارجت`, isPositive: true }}
        />

        <KPICard
          title="متحصلاتي النقدية"
          value={formatEGP(myCollections, language)}
          subtitle={`${myPayments.length} سند قبض`}
          icon={BadgeDollarSign}
          variant="emerald"
        />

        <KPICard
          title="الذمم المدينة لعملائي"
          value={formatEGP(myReceivables, language)}
          subtitle={`${myCustomers.length} عميل سوبرماركت`}
          icon={Users}
          variant="amber"
        />

        <KPICard
          title="متوسط قيمة الفاتورة"
          value={formatEGP(avgInvoiceValue, language)}
          subtitle="معدل سلة الشراء"
          icon={DollarSign}
          variant="slate"
        />
      </div>

      {/* Target Progress Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gold-600" />
            <h2 className="font-bold text-sm text-bronze-900">
              المستهدف البيعي لشهر أكتوبر 2026 (Monthly Sales Target)
            </h2>
          </div>
          <span className="font-bold font-mono text-sm text-gold-700">
            {formatPercentage(achievementRate, language)}
          </span>
        </div>

        <div className="w-full bg-cream-200 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-gold-500 to-gold-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, achievementRate)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-bronze-600 font-mono">
          <span>المحقق: {formatEGP(netSales, language)}</span>
          <span>المستهدف: {formatEGP(targetAmount, language)}</span>
        </div>
      </div>

      {/* Assigned Customers & Invoices Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Customers */}
        <div className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-bronze-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-gold-600" />
                عملاء خط السير المسندين لي ({myCustomers.length} عميل)
              </h2>
              <button
                onClick={() => onNavigate('customers')}
                className="text-xs text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-cream-200 space-y-2">
              {myCustomers.slice(0, 5).map((cust) => (
                <div key={cust.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-bronze-900">{cust.nameAr}</div>
                    <div className="text-[11px] text-bronze-500 flex items-center gap-2 mt-0.5">
                      <span>{cust.address}</span>
                      <span className="font-mono">{cust.phone}</span>
                    </div>
                  </div>
                  <div className="text-left font-mono">
                    <div className="font-bold text-amber-700">{formatEGP(cust.currentBalance, language)}</div>
                    <div className="text-[10px] text-bronze-400">سقف: {formatEGP(cust.creditLimit, language)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-bronze-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold-600" />
                أحدث فواتير المبيعات الصادرة
              </h2>
              <button
                onClick={() => onNavigate('sales-invoices')}
                className="text-xs text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1"
              >
                <span>سجل الفواتير</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-cream-200 space-y-2">
              {myInvoices.map((inv) => (
                <div key={inv.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-bronze-900">{inv.customerName}</div>
                    <div className="text-[11px] text-bronze-500 font-mono mt-0.5">
                      {inv.invoiceNumber} • {formatDate(inv.invoiceDate, language)}
                    </div>
                  </div>
                  <div className="text-left font-mono">
                    <div className="font-bold text-bronze-900">{formatEGP(inv.totalAmount, language)}</div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.paymentStatus === 'partially_paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(inv.paymentStatus)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
