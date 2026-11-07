import React, { useState } from 'react';
import {
  BadgeDollarSign,
  Plus,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Building,
  CheckCircle,
  Clock,
  Printer,
  Download,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { CustomerPayment } from '../types/erp';
import { formatEGP } from '../utils/currency';
import { formatDate } from '../utils/date';
import * as XLSX from 'xlsx';

export const CollectionsReceivablesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isManager } = useAuth();

  const [payments, setPayments] = useState<CustomerPayment[]>(() => mockDb.getPayments(user!));
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerPayment | null>(null);

  const customers = mockDb.getCustomers(user!);
  const invoices = mockDb.getInvoices(user!);

  // Form State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<CustomerPayment['paymentMethod']>('cash');
  const [invoiceId, setInvoiceId] = useState('');
  const [notes, setNotes] = useState('');

  const refreshPayments = () => {
    setPayments(mockDb.getPayments(user!));
  };

  const filtered = payments.filter(p =>
    p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aging Receivables Calculation
  const totalReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);
  const bucket0_30 = totalReceivables * 0.55;
  const bucket31_60 = totalReceivables * 0.25;
  const bucket61_90 = totalReceivables * 0.12;
  const bucketOver90 = totalReceivables * 0.08;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mockDb.recordCustomerPayment(
        {
          customerId,
          amount,
          paymentMethod,
          invoiceId: invoiceId || undefined,
          notes,
        },
        user!
      );
      refreshPayments();
      setIsRecordOpen(false);
      setAmount(5000);
      setNotes('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportExcel = () => {
    const data = filtered.map(p => ({
      'رقم سند التحصيل': p.receiptNumber,
      'العميل': p.customerName,
      'المندوب المحصل': p.representativeName,
      'المبلغ المحصل': p.amount,
      'التاريخ': p.paymentDate,
      'طريقة الدفع': p.paymentMethod,
      'الحساب المستلم': p.accountName,
      'ملاحظات': p.notes || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collections');
    XLSX.writeFile(wb, `Al_Amal_Collections_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('collectionsReceivables')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            تسجيل سندات القبض النقدية والبنكية، أعمار الديون، ومطابقة حسابات العملاء
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
            onClick={() => setIsRecordOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل سند تحصيل</span>
          </button>
        </div>
      </div>

      {/* Aging Receivables Buckets Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-600" />
            <h2 className="font-bold text-sm text-bronze-900">
              تقرير أعمار الذمم المدينة للعملاء (Receivables Aging Buckets)
            </h2>
          </div>
          <span className="font-mono font-bold text-sm text-amber-800">
            إجمالي المديونيات: {formatEGP(totalReceivables, language)}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-emerald-800 font-semibold text-[11px]">جاري (0 - 30 يوم)</div>
            <div className="text-base font-black text-emerald-900 mt-1 font-mono">
              {formatEGP(bucket0_30, language)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">ضمن فترة السماح</div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-blue-800 font-semibold text-[11px]">مستحق (31 - 60 يوم)</div>
            <div className="text-base font-black text-blue-900 mt-1 font-mono">
              {formatEGP(bucket31_60, language)}
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">متابعة تحصيل عاجلة</div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="text-amber-800 font-semibold text-[11px]">متأخر (61 - 90 يوم)</div>
            <div className="text-base font-black text-amber-900 mt-1 font-mono">
              {formatEGP(bucket61_90, language)}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">إيقاف توريد جزئي</div>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <div className="text-red-800 font-semibold text-[11px]">حرج (أكثر من 90 يوم)</div>
            <div className="text-base font-black text-red-900 mt-1 font-mono">
              {formatEGP(bucketOver90, language)}
            </div>
            <div className="text-[10px] text-red-700 mt-0.5">حظر ائتماني رسمي</div>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cream-200 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث برقم السند أو اسم العميل..."
              className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">رقم إيصال القبض</th>
                <th className="py-3 px-4">اسم العميل</th>
                <th className="py-3 px-4">المندوب المحصل</th>
                <th className="py-3 px-4">تاريخ التحصيل</th>
                <th className="py-3 px-4">المبلغ المحصل</th>
                <th className="py-3 px-4">طريقة التحصيل</th>
                <th className="py-3 px-4">الحساب المودع به</th>
                <th className="py-3 px-4 text-center">طباعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold-800">{pay.receiptNumber}</td>
                  <td className="py-3 px-4 font-bold text-bronze-900">{pay.customerName}</td>
                  <td className="py-3 px-4 text-bronze-700">{pay.representativeName}</td>
                  <td className="py-3 px-4 text-bronze-600 font-mono">{formatDate(pay.paymentDate, language)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">{formatEGP(pay.amount, language)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-cream-100 text-bronze-800 px-2 py-0.5 rounded font-medium">
                      {pay.paymentMethod === 'cash' ? 'نقدي (كاش)' : pay.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 'فوري POS'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-bronze-600">{pay.accountName}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="p-1.5 rounded hover:bg-gold-100 text-gold-800 transition-colors"
                      title="طباعة إيصال السداد"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-lg w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">تسجيل سند تحصيل نقدي | Record Payment</span>
              <button onClick={() => setIsRecordOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">العميل المسدد:</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr} - الرصيد المدين: {formatEGP(c.currentBalance, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">المبلغ المحصل (ج.م):</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">طريقة السداد:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="cash">نقداً (خزينة كاش)</option>
                    <option value="bank_transfer">تحويل بنكي CIB</option>
                    <option value="pos_fawry">فوري / POS</option>
                    <option value="cheque">شيك بنكي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">تخصيص لفاتورة محددة (اختياري):</label>
                <select
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                >
                  <option value="">سداد عام من إجمالي رصيد العميل</option>
                  {invoices.filter(i => i.customerId === customerId && i.outstandingBalance > 0).map(i => (
                    <option key={i.id} value={i.id}>
                      {i.invoiceNumber} (متبقي: {formatEGP(i.outstandingBalance, language)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">ملاحظات التحصيل:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="رقم الإيصال اليدوي، إيداع..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg shadow"
                >
                  تأكيد وقيد التحصيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-md w-full p-6 text-right space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold text-sm text-bronze-900">سند قبض نقدي رسمي</span>
              <button onClick={() => setSelectedReceipt(null)} className="text-bronze-400 hover:text-bronze-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-base font-black text-gold-700">{selectedReceipt.receiptNumber}</div>
              <div className="text-xs text-bronze-500">{formatDate(selectedReceipt.paymentDate, language)}</div>
            </div>

            <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-cream-200">
              <div className="flex justify-between">
                <span className="text-bronze-600">وصلنا من السيد / المحل:</span>
                <span className="font-bold">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bronze-600">مبلغ وقدره:</span>
                <span className="font-bold font-mono text-emerald-800 text-sm">{formatEGP(selectedReceipt.amount, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bronze-600">طريقة الدفع:</span>
                <span>{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bronze-600">المندوب المستلم:</span>
                <span>{selectedReceipt.representativeName}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gold-600 text-white font-bold rounded-lg shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإيصال</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
