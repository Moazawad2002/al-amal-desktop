import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  BadgeDollarSign,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpRight,
  Filter,
  Users,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { KPICard } from '../components/common/KPICard';
import { formatEGP, formatPercentage } from '../utils/currency';

export const ExecutiveDashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<'thisMonth' | 'last7Days' | 'thisQuarter' | 'thisYear'>('thisMonth');

  const invoices = mockDb.getInvoices(user!);
  const payments = mockDb.getPayments(user!);
  const expenses = mockDb.getExpenses();
  const products = mockDb.getProducts();
  const reps = mockDb.getReps();
  const targets = mockDb.getTargets(user!);
  const batches = mockDb.getBatches();

  // Calculated Metrics
  const totalSales = invoices.reduce((acc, inv) => acc + inv.subtotal, 0);
  const totalDiscounts = invoices.reduce((acc, inv) => acc + inv.discountAmount, 0);
  const netSales = totalSales - totalDiscounts;

  // COGS Calculation
  const cogs = invoices.reduce((acc, inv) => {
    return acc + inv.items.reduce((itemAcc, item) => itemAcc + (item.unitCost * item.quantity), 0);
  }, 0);

  const grossProfit = netSales - cogs;
  const grossProfitMargin = netSales > 0 ? (grossProfit / netSales) * 100 : 0;

  const totalCollections = payments.reduce((acc, p) => acc + p.amount, 0);
  const outstandingReceivables = invoices.reduce((acc, inv) => acc + inv.outstandingBalance, 0);

  // Total inventory valuation at purchase cost
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.purchaseCost * p.stockQuantity), 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockLevel).length;

  // Batches expiring within 60 days
  const now = new Date();
  const nearExpiryCount = batches.filter(b => {
    const exp = new Date(b.expirationDate);
    const diffDays = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60;
  }).length;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Weekly Trend Chart Data
  const trendData = [
    { name: '1-7 أكتوبر', sales: 125000, collections: 95000, profit: 24000 },
    { name: '8-14 أكتوبر', sales: 168000, collections: 142000, profit: 31000 },
    { name: '15-21 أكتوبر', sales: 145000, collections: 130000, profit: 27500 },
    { name: '22-28 أكتوبر', sales: 192000, collections: 175000, profit: 36000 },
  ];

  // Representative Leaderboard Aggregations
  const repStats = reps.map((rep) => {
    const repInvoices = invoices.filter(i => i.representativeId === rep.id);
    const repPayments = payments.filter(p => p.representativeId === rep.id);
    const target = targets.find(t => t.representativeId === rep.id);

    const rSales = repInvoices.reduce((a, b) => a + b.totalAmount, 0);
    const rCollections = repPayments.reduce((a, b) => a + b.amount, 0);
    const rTarget = target?.targetAmount || rep.salesTargetMonthly;
    const rAchieved = target?.achievedAmount || rSales;
    const achievement = rTarget > 0 ? (rAchieved / rTarget) * 100 : 0;
    const avgInvoice = repInvoices.length > 0 ? rSales / repInvoices.length : 0;

    return {
      ...rep,
      invoiceCount: repInvoices.length,
      netSales: rSales,
      collections: rCollections,
      achievement,
      avgInvoice,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gold-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('executiveDashboard')}
            </h1>
            <span className="bg-gold-100 text-gold-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gold-300">
              {language === 'ar' ? 'الإدارة العليا' : 'CEO Overview'}
            </span>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            {language === 'ar'
              ? 'مؤشرات الأداء المالي والبيعي الشاملة لشركة الأمل لتوزيع المواد الغذائية'
              : 'Comprehensive financial, sales, and warehouse performance metrics'}
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-cream-100 p-1 rounded-xl border border-bronze-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-gold-600 ml-1" />
          <button
            onClick={() => setDateFilter('last7Days')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              dateFilter === 'last7Days' ? 'bg-gold-500 text-bronze-900 font-bold' : 'text-bronze-700 hover:bg-cream-200'
            }`}
          >
            {t('last7Days')}
          </button>
          <button
            onClick={() => setDateFilter('thisMonth')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              dateFilter === 'thisMonth' ? 'bg-gold-500 text-bronze-900 font-bold' : 'text-bronze-700 hover:bg-cream-200'
            }`}
          >
            {t('thisMonth')}
          </button>
          <button
            onClick={() => setDateFilter('thisQuarter')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              dateFilter === 'thisQuarter' ? 'bg-gold-500 text-bronze-900 font-bold' : 'text-bronze-700 hover:bg-cream-200'
            }`}
          >
            {t('thisQuarter')}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title={t('netSales')}
          value={formatEGP(netSales, language)}
          subtitle="صافي المبيعات المحققة"
          icon={TrendingUp}
          variant="gold"
          trend={{ value: '14.2%', isPositive: true }}
          tooltip="إجمالي مبيعات الفواتير بعد الخصومات"
        />

        <KPICard
          title={t('grossProfit')}
          value={formatEGP(grossProfit, language)}
          subtitle={`هامش ربح ${formatPercentage(grossProfitMargin, language)}`}
          icon={DollarSign}
          variant="emerald"
          trend={{ value: '8.5%', isPositive: true }}
          tooltip="صافي المبيعات مخصوماً منها تكلفة البضاعة المباعة (COGS)"
        />

        <KPICard
          title={t('totalCollections')}
          value={formatEGP(totalCollections, language)}
          subtitle="المتحصلات النقدية والبنكية"
          icon={BadgeDollarSign}
          variant="emerald"
          trend={{ value: '18.0%', isPositive: true }}
          tooltip="إجمالي سندات التحصيل الصادرة لعملاء السوبرماركت"
        />

        <KPICard
          title={t('outstandingReceivables')}
          value={formatEGP(outstandingReceivables, language)}
          subtitle="ذمم محلات وسوبرماركت مدينة"
          icon={ShoppingBag}
          variant="amber"
          tooltip="أرصدة الفواتير المتبقية المستحقة على العملاء"
        />

        <KPICard
          title={t('inventoryValue')}
          value={formatEGP(totalInventoryValue, language)}
          subtitle="المستودع الرئيسي (العبور)"
          icon={Layers}
          variant="slate"
          tooltip="تقييم المخزون الحالي بسعر التكلفة الفعلية للمشتريات"
        />
      </div>

      {/* Second Row KPIs: Operational Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-bronze-600 font-semibold">{t('lowStockAlerts')}</div>
              <div className="text-lg font-black text-amber-900 mt-0.5">{lowStockCount} أصناف قاربت النفاذ</div>
            </div>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold">
            يتطلب أمر توريد
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-bronze-600 font-semibold">{t('nearExpirationAlerts')}</div>
              <div className="text-lg font-black text-red-900 mt-0.5">{nearExpiryCount} دفعات خلال 60 يوم</div>
            </div>
          </div>
          <span className="text-xs bg-red-50 text-red-800 border border-red-300 px-2 py-0.5 rounded font-bold">
            FEFO أولوية صرف
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-bronze-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cream-200 text-bronze-800">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-bronze-600 font-semibold">{t('operatingExpenses')}</div>
              <div className="text-lg font-black text-bronze-900 mt-0.5">{formatEGP(totalExpenses, language)}</div>
            </div>
          </div>
          <span className="text-xs bg-cream-100 text-bronze-700 px-2 py-0.5 rounded font-medium">
            سولار وصيانة وتشغيل
          </span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Collections Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gold-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-sm text-bronze-900">
                مقارنة المبيعات والتحصيلات النقدية (أكتوبر 2026)
              </h2>
              <p className="text-[11px] text-bronze-500">حركة التوزيع الأسبوعية لشركة الأمل</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" />
                <XAxis dataKey="name" stroke="#8C7F67" />
                <YAxis stroke="#8C7F67" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2B261B', color: '#FAF7EE', borderRadius: 8 }}
                  formatter={(val: any) => [`${formatEGP(Number(val), language)}`, '']}
                />
                <Legend />
                <Bar dataKey="sales" name="المبيعات" fill="#D49B24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" name="التحصيلات" fill="#15803D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-gold-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-sm text-bronze-900 mb-1">
              مبيعات التصنيفات الرئيسية
            </h2>
            <p className="text-[11px] text-bronze-500 mb-4">نسبة توزيع الأغذية حسب الصنف</p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-medium text-bronze-800">
                  <span>زيوت وسمن ومسالي</span>
                  <span className="font-bold text-gold-700">38%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2">
                  <div className="bg-gold-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium text-bronze-800">
                  <span>أرز وبقوليات ومعلبات</span>
                  <span className="font-bold text-gold-700">28%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2">
                  <div className="bg-gold-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium text-bronze-800">
                  <span>مكرونة ريجينا وصلصة</span>
                  <span className="font-bold text-gold-700">18%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium text-bronze-800">
                  <span>ألبان جهينة وشاي العروسة</span>
                  <span className="font-bold text-gold-700">16%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '16%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-cream-50 rounded-xl border border-cream-300 text-[11px] text-bronze-700">
            <span className="font-bold text-gold-800">ملاحظة تنفيذية:</span> أعلى هوامش ربحية مسجلة في أصناف المعلبات ومكرونة ريجينا بنسبة 14.8%.
          </div>
        </div>
      </div>

      {/* Sales Representative Leaderboard */}
      <div className="bg-white rounded-2xl p-5 border border-gold-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base text-bronze-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-600" />
              لوحة متصدري مناديب المبيعات الثلاثة (Sales Reps Leaderboard)
            </h2>
            <p className="text-xs text-bronze-500">
              تقييم الأداء على أساس المبيعات، معدل التحصيل، ونسبة تحقيق التارجت
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-700 border-b border-cream-300 font-semibold">
                <th className="py-3 px-4">المندوب</th>
                <th className="py-3 px-4">منطقة التوزيع</th>
                <th className="py-3 px-4">المستهدف (Target)</th>
                <th className="py-3 px-4">صافي المبيعات</th>
                <th className="py-3 px-4">نسبة الإنجاز</th>
                <th className="py-3 px-4">إجمالي التحصيلات</th>
                <th className="py-3 px-4">متوسط الفاتورة</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {repStats.map((rep, idx) => (
                <tr key={rep.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-bronze-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gold-200 text-gold-900 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{rep.fullNameAr}</span>
                  </td>
                  <td className="py-3 px-4 text-bronze-600">
                    {rep.id === 'rep-01' ? 'القاهرة الشمالية (شبرا والزيتون)' : rep.id === 'rep-02' ? 'الجيزة والشيخ زايد والهرم' : 'شرق القاهرة والمعادي والتجمع'}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{formatEGP(rep.salesTargetMonthly, language)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-gold-700">{formatEGP(rep.netSales, language)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-cream-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            rep.achievement >= 90 ? 'bg-emerald-600' : 'bg-gold-500'
                          }`}
                          style={{ width: `${Math.min(100, rep.achievement)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold font-mono">{formatPercentage(rep.achievement, language)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    {formatEGP(rep.collections, language)}
                  </td>
                  <td className="py-3 px-4 font-mono">{formatEGP(rep.avgInvoice, language)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      أداء متميز
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
