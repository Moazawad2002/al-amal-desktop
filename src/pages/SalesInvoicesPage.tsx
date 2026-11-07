import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { SalesInvoice, SalesInvoiceItem, Product } from '../types/erp';
import { formatEGP } from '../utils/currency';
import { formatDate } from '../utils/date';
import logoImg from '../assets/logo.png';
import * as XLSX from 'xlsx';

export const SalesInvoicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isManager } = useAuth();

  const [invoices, setInvoices] = useState<SalesInvoice[]>(() => mockDb.getInvoices(user!));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const customers = mockDb.getCustomers(user!);
  const products = mockDb.getProducts();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 10 }
  ]);

  const refreshInvoices = () => {
    setInvoices(mockDb.getInvoices(user!));
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      inv.paymentStatus === statusFilter ||
      inv.invoiceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { productId: products[0]?.id || '', quantity: 5 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const selectedCust = customers.find(c => c.id === customerId);
      if (!selectedCust) throw new Error('برجاء اختيار العميل');

      const items: SalesInvoiceItem[] = invoiceItems.map((item, idx) => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) throw new Error('المنتج غير موجود');
        const total = prod.sellingPrice * item.quantity;
        return {
          id: `item-${Date.now()}-${idx}`,
          productId: prod.id,
          productName: prod.nameAr,
          sku: prod.sku,
          unit: prod.unit,
          quantity: item.quantity,
          unitPrice: prod.sellingPrice,
          unitCost: prod.purchaseCost,
          discountPercent: 0,
          discountAmount: 0,
          totalPrice: total,
        };
      });

      const newInv = mockDb.createInvoice(
        {
          customerId,
          items,
          discountAmount,
          notes,
        },
        user!
      );

      // Auto-post for seamless operational workflow
      mockDb.postSalesInvoice(newInv.id, user!);

      setSuccessMessage(`تم إنشاء وترحيل الفاتورة بنجاح: ${newInv.invoiceNumber}`);
      setIsCreateOpen(false);
      refreshInvoices();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء حفظ الفاتورة');
    }
  };

  const handlePostInvoice = (invId: string) => {
    try {
      setErrorMessage('');
      mockDb.postSalesInvoice(invId, user!);
      setSuccessMessage('تم ترحيل الفاتورة وخصم المخزون بنجاح!');
      refreshInvoices();
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل ترحيل الفاتورة');
    }
  };

  const handleExportExcel = () => {
    const dataToExport = filteredInvoices.map((inv) => ({
      'رقم الفاتورة': inv.invoiceNumber,
      'العميل': inv.customerName,
      'المندوب': inv.representativeName,
      'التاريخ': inv.invoiceDate,
      'الإجمالي': inv.totalAmount,
      'المدفوع': inv.paidAmount,
      'المتبقي': inv.outstandingBalance,
      'حالة السداد': inv.paymentStatus,
      'حالة الفاتورة': inv.invoiceStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, `Al_Amal_Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('salesManagement')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            إصدار فواتير البيع الرسمية، مراقبة المخزون المخصوم، وسداد العملاء
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bronze-300 hover:bg-cream-100 text-bronze-800 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={() => {
              setErrorMessage('');
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createInvoice')}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gold-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gold-600 ml-1 shrink-0" />
          {['all', 'posted', 'paid', 'partially_paid', 'unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === st ? 'bg-gold-500 text-bronze-900 font-bold' : 'bg-cream-100 text-bronze-700 hover:bg-cream-200'
              }`}
            >
              {st === 'all' ? t('all') : t(st as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">رقم الفاتورة</th>
                <th className="py-3 px-4">اسم العميل (سوبرماركت)</th>
                <th className="py-3 px-4">المندوب المصرح</th>
                <th className="py-3 px-4">تاريخ التحرير</th>
                <th className="py-3 px-4">الإجمالي</th>
                <th className="py-3 px-4">المدفوع</th>
                <th className="py-3 px-4">المتبقي</th>
                <th className="py-3 px-4">حالة السداد</th>
                <th className="py-3 px-4">حالة الترحيل</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-bronze-900">
                    {inv.customerName}
                  </td>
                  <td className="py-3 px-4 text-bronze-700">
                    {inv.representativeName}
                  </td>
                  <td className="py-3 px-4 text-bronze-600 font-mono">
                    {formatDate(inv.invoiceDate, language)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-bronze-900">
                    {formatEGP(inv.totalAmount, language)}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                    {formatEGP(inv.paidAmount, language)}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-800 font-bold">
                    {formatEGP(inv.outstandingBalance, language)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : inv.paymentStatus === 'partially_paid'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {t(inv.paymentStatus)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.invoiceStatus === 'posted'
                        ? 'bg-gold-100 text-gold-900 border border-gold-300'
                        : 'bg-cream-200 text-bronze-800'
                    }`}>
                      {t(inv.invoiceStatus)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1 rounded bg-cream-100 hover:bg-gold-100 text-bronze-800 hover:text-gold-900 transition-colors"
                        title="عرض الفاتورة والطباعة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.invoiceStatus === 'draft' && (
                        <button
                          onClick={() => handlePostInvoice(inv.id)}
                          className="px-2 py-1 rounded bg-gold-500 hover:bg-gold-600 text-bronze-900 text-[10px] font-bold transition-colors"
                        >
                          {t('post')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-400" />
                <h2 className="font-bold text-sm text-gold-300">
                  إنشاء فاتورة مبيعات جديدة | New Sales Invoice
                </h2>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 text-xs">
              {/* Customer Selection */}
              <div>
                <label className="block font-semibold text-bronze-700 mb-1">
                  اختر العميل (سوبر ماركت / بقالة):
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-bronze-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr} - {c.address} (رصيد حالي: {formatEGP(c.currentBalance, language)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div className="border border-cream-300 rounded-xl p-3 bg-cream-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-bronze-900">بنود الفاتورة والمنتجات الغذائية:</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] font-bold text-gold-700 hover:text-gold-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة صنف</span>
                  </button>
                </div>

                {invoiceItems.map((item, idx) => {
                  const prod = products.find(p => p.id === item.productId);
                  const lineTotal = (prod?.sellingPrice || 0) * item.quantity;

                  return (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-cream-200">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const updated = [...invoiceItems];
                          updated[idx].productId = e.target.value;
                          setInvoiceItems(updated);
                        }}
                        className="flex-1 px-2 py-1.5 border border-bronze-300 rounded text-xs"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameAr} ({formatEGP(p.sellingPrice, language)} / {p.unit}) - متاح: {p.stockQuantity}
                          </option>
                        ))}
                      </select>

                      <div className="w-24 flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].quantity = Math.max(1, Number(e.target.value));
                            setInvoiceItems(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-bronze-300 rounded text-center text-xs font-mono"
                        />
                        <span className="text-[10px] text-bronze-500 shrink-0">{prod?.unit}</span>
                      </div>

                      <div className="w-24 text-left font-mono font-bold text-gold-700 shrink-0">
                        {formatEGP(lineTotal, language)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="حذف البند"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Discount & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-bronze-700 mb-1">
                    خصم تجاري معتمد (ج.م):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-bronze-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-bronze-700 mb-1">
                    ملاحظات الفاتورة:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="توريد دوري، عروض..."
                    className="w-full px-3 py-2 border border-bronze-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-bronze-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-bronze-300 text-bronze-700 hover:bg-cream-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold shadow-md"
                >
                  حفظ وترحيل الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & PRINT OFFICIAL INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between sticky top-0 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-gold-400" />
                <span className="font-bold text-sm text-gold-300">
                  فاتورة مبيعات رسمية | {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-bronze-900 font-bold text-xs hover:bg-gold-400"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('print')}</span>
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="text-cream-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Invoice Sheet */}
            <div className="p-8 space-y-6 text-xs text-bronze-900 bg-white" id="printable-invoice">
              {/* Header with Company Logo */}
              <div className="flex items-center justify-between border-b-2 border-gold-500 pb-4">
                <div className="flex items-center gap-3">
                  <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain" />
                  <div>
                    <h1 className="text-base font-black text-bronze-900">
                      شركة الأمل لتوزيع المنتجات الغذائية
                    </h1>
                    <p className="text-[11px] text-bronze-600">
                      Al Amal Food Distribution Co. S.A.E
                    </p>
                    <p className="text-[10px] text-bronze-500">
                      المستودع الرئيسي: المنطقة الصناعية الأولى - مدينة العبور - مصر
                    </p>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <div className="text-sm font-black text-gold-800">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-xs text-bronze-600">التاريخ: {formatDate(selectedInvoice.invoiceDate, language)}</div>
                  <div className="text-[11px] text-bronze-500">الاستحقاق: {formatDate(selectedInvoice.dueDate, language)}</div>
                </div>
              </div>

              {/* Customer & Rep Details */}
              <div className="grid grid-cols-2 gap-4 bg-cream-50 p-4 rounded-xl border border-cream-200">
                <div>
                  <div className="font-bold text-gold-900 mb-1">بيانات العميل:</div>
                  <div className="font-bold text-sm text-bronze-900">{selectedInvoice.customerName}</div>
                  <div className="text-[11px] text-bronze-600">شروط السداد: {selectedInvoice.paymentTerms}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gold-900 mb-1">المندوب المعتمد:</div>
                  <div className="font-semibold text-bronze-900">{selectedInvoice.representativeName}</div>
                  <div className="text-[11px] text-bronze-600">حالة الفاتورة: {selectedInvoice.invoiceStatus.toUpperCase()}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-right border border-cream-300">
                <thead className="bg-cream-100 text-bronze-800 font-bold border-b border-cream-300">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">الصنف الغذائي</th>
                    <th className="py-2.5 px-3">الوحدة</th>
                    <th className="py-2.5 px-3">الكمية</th>
                    <th className="py-2.5 px-3">سعر الوحدة</th>
                    <th className="py-2.5 px-3 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {selectedInvoice.items.map((it, i) => (
                    <tr key={it.id}>
                      <td className="py-2 px-3 text-bronze-500">{i + 1}</td>
                      <td className="py-2 px-3 font-semibold text-bronze-900">{it.productName}</td>
                      <td className="py-2 px-3 text-bronze-600">{it.unit}</td>
                      <td className="py-2 px-3 font-mono font-bold">{it.quantity}</td>
                      <td className="py-2 px-3 font-mono">{formatEGP(it.unitPrice, language)}</td>
                      <td className="py-2 px-3 font-mono font-bold text-left">{formatEGP(it.totalPrice, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-bronze-700">
                    <span>المجموع الفرعي:</span>
                    <span>{formatEGP(selectedInvoice.subtotal, language)}</span>
                  </div>
                  {selectedInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>الخصم الممنوح:</span>
                      <span>-{formatEGP(selectedInvoice.discountAmount, language)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-bronze-900 pt-2 border-t border-bronze-300">
                    <span>إجمالي الفاتورة:</span>
                    <span className="text-gold-700">{formatEGP(selectedInvoice.totalAmount, language)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>المسدد نقداً / بنك:</span>
                    <span>{formatEGP(selectedInvoice.paidAmount, language)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-800">
                    <span>المتبقي ذمة مدينة:</span>
                    <span>{formatEGP(selectedInvoice.outstandingBalance, language)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-cream-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="font-bold text-bronze-800">توقيع واستلام العميل / الختم:</div>
                  <div className="mt-8 border-b border-dashed border-bronze-400 w-48 mx-auto"></div>
                </div>
                <div>
                  <div className="font-bold text-bronze-800">مندوب شركة الأمل:</div>
                  <div className="mt-8 border-b border-dashed border-bronze-400 w-48 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
