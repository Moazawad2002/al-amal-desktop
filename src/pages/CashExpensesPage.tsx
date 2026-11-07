import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  DollarSign,
  TrendingDown,
  Building,
  CheckCircle,
  FileText,
  Download,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { Expense, FinancialAccount } from '../types/erp';
import { formatEGP } from '../utils/currency';
import { formatDate } from '../utils/date';
import * as XLSX from 'xlsx';

export const CashExpensesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => mockDb.getAccounts());
  const [expenses, setExpenses] = useState<Expense[]>(() => mockDb.getExpenses());
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<Expense['category']>('fuel');
  const [amount, setAmount] = useState(2500);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [receiptRef, setReceiptRef] = useState('');

  const refreshData = () => {
    setAccounts(mockDb.getAccounts());
    setExpenses(mockDb.getExpenses());
  };

  const totalCashAndBank = accounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mockDb.recordExpense(
        {
          category,
          amount,
          description,
          accountId,
          receiptRef,
        },
        user!
      );
      refreshData();
      setIsAddOpen(false);
      setDescription('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportExcel = () => {
    const data = expenses.map(e => ({
      'رقم إذن الصرف': e.expenseNumber,
      'البند': e.category,
      'المبلغ': e.amount,
      'الحساب المسحوب منه': e.accountName,
      'التاريخ': e.expenseDate,
      'البيان والتفاصيل': e.description,
      'رقم الفاتورة / الإيصال': e.receiptRef || '-',
      'المعتمد': e.approvedBy || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, `Al_Amal_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('cashExpenses')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            إدارة الخزائن البنكية والنقدية، حركة السيولة، ومصروفات أسطول النقل والتشغيل
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
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل إذن صرف</span>
          </button>
        </div>
      </div>

      {/* Financial Accounts Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl p-4 border border-gold-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-bronze-500">
                <span className="font-mono font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded">{acc.code}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">نشط</span>
              </div>
              <h2 className="text-xs font-bold text-bronze-900 mt-2">{acc.nameAr}</h2>
            </div>
            <div className="mt-4 pt-2 border-t border-cream-200">
              <span className="text-[10px] text-bronze-500 block">الرصيد الدفتري الحالي:</span>
              <span className="text-base font-black font-mono text-bronze-900">{formatEGP(acc.currentBalance, language)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cream-200 flex items-center justify-between">
          <h2 className="font-bold text-sm text-bronze-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            سجل المصروفات التشغيلية المعتمدة (إجمالي: {formatEGP(totalExpenses, language)})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">رقم الإذن</th>
                <th className="py-3 px-4">البند والتصنيف</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">الحساب المسحوب منه</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">البيان والتفاصيل</th>
                <th className="py-3 px-4">المسؤول والمصرح</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold-800">{exp.expenseNumber}</td>
                  <td className="py-3 px-4 font-bold text-bronze-900">
                    {exp.category === 'fuel' ? 'وقود وسولار سيارات' : exp.category === 'vehicle_maintenance' ? 'صيانة شاحنات' : exp.category === 'warehouse' ? 'مستلزمات مستودع' : 'مصروفات إدارة'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-red-700">{formatEGP(exp.amount, language)}</td>
                  <td className="py-3 px-4 text-bronze-600">{exp.accountName}</td>
                  <td className="py-3 px-4 font-mono text-bronze-500">{formatDate(exp.expenseDate, language)}</td>
                  <td className="py-3 px-4 text-bronze-800">{exp.description}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      معتمد ({exp.approvedBy})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-md w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">تسجيل إذن صرف نقدي | Record Expense</span>
              <button onClick={() => setIsAddOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">بند المصروف:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="fuel">سولار وبنزين فانات التوزيع</option>
                  <option value="vehicle_maintenance">صيانة دورية وزيوت سيارات</option>
                  <option value="warehouse">أدوات وبالتات المستودع المركزي</option>
                  <option value="packaging">تغليف وكراتين وتأمين شحنات</option>
                  <option value="salaries">سلف ومرتبات وبدلات مناديب</option>
                  <option value="administration">مصروفات إدارية ونثريات</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">المبلغ (ج.م):</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">الخزينة المسحوب منها:</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">البيان والشرح:</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="صيانة الفرامل وفحص دوري..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">رقم الفاتورة / الإيصال:</label>
                <input
                  type="text"
                  value={receiptRef}
                  onChange={(e) => setReceiptRef(e.target.value)}
                  placeholder="INV-9921 / بون محطة وقود"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg shadow"
                >
                  اعتماد وصرف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
