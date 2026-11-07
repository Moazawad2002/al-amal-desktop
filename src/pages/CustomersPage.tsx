import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  UserCheck,
  ShieldAlert,
  Download,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { Customer } from '../types/erp';
import { formatEGP } from '../utils/currency';
import * as XLSX from 'xlsx';

export const CustomersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isManager } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>(() => mockDb.getCustomers(user!));
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (user) {
      setCustomers(mockDb.getCustomers(user));
    }
  }, [user]);

  // New Customer Form State
  const reps = mockDb.getReps();
  const [nameAr, setNameAr] = useState('');
  const [customerType, setCustomerType] = useState<Customer['customerType']>('supermarket');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [assignedRepId, setAssignedRepId] = useState(isManager ? reps[0]?.id : user?.representativeId);
  const [creditLimit, setCreditLimit] = useState(30000);
  const [paymentTermsDays, setPaymentTermsDays] = useState(15);

  const refreshCustomers = () => {
    setCustomers(mockDb.getCustomers(user!));
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesType = typeFilter === 'all' || c.customerType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mockDb.saveCustomer(
        {
          id: '',
          code: '',
          nameAr,
          customerType,
          phone,
          address,
          governorate,
          assignedRepId: assignedRepId || 'rep-01',
          creditLimit,
          paymentTermsDays,
          openingBalance: 0,
          currentBalance: 0,
          status: 'active',
        },
        user!
      );

      setIsAddOpen(false);
      setNameAr('');
      setPhone('');
      setAddress('');
      refreshCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportExcel = () => {
    const data = filtered.map(c => ({
      'كود العميل': c.code,
      'اسم العميل': c.nameAr,
      'النوع': c.customerType,
      'الهاتف': c.phone,
      'العنوان': c.address,
      'المحافظة': c.governorate,
      'المندوب المسند': c.assignedRepName,
      'الرصيد المدين': c.currentBalance,
      'سقف الائتمان': c.creditLimit,
      'فترة السداد (أيام)': c.paymentTermsDays,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, `Al_Amal_Customers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('customers')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            {isManager
              ? 'إدارة حسابات محلات السوبر ماركت، سقوف الائتمان، وإسناد خطوط سير المناديب'
              : 'قائمة العملاء المعتمدين والمخصصين لحسابك الميداني فقط (RLS Protected)'}
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
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gold-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم المحل، الكود، أو رقم الهاتف..."
            className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gold-600 ml-1 shrink-0" />
          {['all', 'supermarket', 'hypermarket', 'grocery', 'wholesaler'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                typeFilter === tp ? 'bg-gold-500 text-bronze-900 font-bold' : 'bg-cream-100 text-bronze-700 hover:bg-cream-200'
              }`}
            >
              {tp === 'all' ? 'جميع الفئات' : tp === 'supermarket' ? 'سوبر ماركت' : tp === 'hypermarket' ? 'هايبر ماركت' : tp === 'grocery' ? 'بقالة' : 'جملة'}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cust) => {
          const isNearLimit = cust.creditLimit > 0 && (cust.currentBalance / cust.creditLimit) >= 0.85;

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded">
                      {cust.code}
                    </span>
                    <h2 className="text-sm font-bold text-bronze-900 mt-1.5 line-clamp-1">{cust.nameAr}</h2>
                  </div>
                  <span className="text-[10px] bg-cream-100 text-bronze-700 px-2 py-0.5 rounded-full font-medium">
                    {cust.customerType === 'supermarket' ? 'سوبر ماركت' : cust.customerType === 'hypermarket' ? 'هايبر ماركت' : cust.customerType === 'grocery' ? 'بقالة' : 'جملة'}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-bronze-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span className="truncate">{cust.address} • {cust.governorate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span className="font-mono">{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>المندوب: <strong className="text-bronze-800">{cust.assignedRepName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Financial Box */}
              <div className="mt-4 pt-3 border-t border-cream-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-bronze-500">الرصيد المدين الحالي:</span>
                  <span className="font-mono font-bold text-amber-800 text-sm">
                    {formatEGP(cust.currentBalance, language)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-bronze-500 font-mono">
                  <span>سقف الائتمان: {formatEGP(cust.creditLimit, language)}</span>
                  <span>{cust.paymentTermsDays} يوم أجل</span>
                </div>

                {isNearLimit && (
                  <div className="mt-2 text-[10px] font-bold text-red-700 bg-red-50 p-1.5 rounded flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>تنبيه: اقترب العميل من سقف الائتمان المصرح به</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-lg w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">إضافة عميل تجاري جديد | Add Customer</span>
              <button onClick={() => setIsAddOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">اسم المحل أو السوبر ماركت:</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="سوبر ماركت الإخلاص - شبرا..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">نوع النشاط:</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="supermarket">سوبر ماركت</option>
                    <option value="hypermarket">هايبر ماركت</option>
                    <option value="grocery">بقالة</option>
                    <option value="wholesaler">تاجر جملة</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">المحافظة:</label>
                  <input
                    type="text"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">العنوان التفصيلي:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الشارع، رقم العقار، علامة مميزة..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">رقم الهاتف / الواتساب:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">المندوب المسند:</label>
                  <select
                    disabled={!isManager}
                    value={assignedRepId}
                    onChange={(e) => setAssignedRepId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-cream-50"
                  >
                    {reps.map((r) => (
                      <option key={r.id} value={r.id}>{r.fullNameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">سقف الائتمان (ج.م):</label>
                  <input
                    type="number"
                    min="0"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">أجل السداد (أيام):</label>
                  <input
                    type="number"
                    min="1"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
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
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
