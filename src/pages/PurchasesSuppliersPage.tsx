import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Building,
  Phone,
  Mail,
  DollarSign,
  Download,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { Supplier } from '../types/erp';
import { formatEGP } from '../utils/currency';
import * as XLSX from 'xlsx';

export const PurchasesSuppliersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => mockDb.getSuppliers(user!));
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Supplier Form
  const [nameAr, setNameAr] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTermsDays, setPaymentTermsDays] = useState(30);

  const filtered = suppliers.filter(s =>
    s.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      code: `SUP-${Date.now()}`,
      nameAr,
      contactPerson,
      phone,
      email,
      address,
      openingBalance: 0,
      currentBalance: 0,
      paymentTermsDays,
      status: 'active',
    };
    setSuppliers([...suppliers, newSup]);
    setIsAddOpen(false);
  };

  const handleExportExcel = () => {
    const data = filtered.map(s => ({
      'كود المورد': s.code,
      'اسم المورد': s.nameAr,
      'المسؤول': s.contactPerson,
      'الهاتف': s.phone,
      'البريد الإلكتروني': s.email || '-',
      'العنوان': s.address,
      'رصيد المورد الدائن': s.currentBalance,
      'فترة السداد (أيام)': s.paymentTermsDays,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suppliers');
    XLSX.writeFile(wb, `Al_Amal_Suppliers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('purchasesSuppliers')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            إدارة كبار موردي الأغذية (صافولا، جهينة، ريجينا، أمريكانا) وأوامر التوريد الواردة للمستودع
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
            <span>إضافة مورد غذائي</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gold-200/60 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بكود أو اسم المورد..."
            className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sup) => (
          <div key={sup.id} className="bg-white rounded-2xl p-5 border border-gold-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded">
                    {sup.code}
                  </span>
                  <h2 className="text-sm font-bold text-bronze-900 mt-1.5">{sup.nameAr}</h2>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  مورد معتمد
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-bronze-600">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>المسؤول: <strong>{sup.contactPerson}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span className="font-mono">{sup.phone}</span>
                </div>
                {sup.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{sup.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-bronze-500">مستحقات المورد (دائن):</span>
                <span className="font-mono font-bold text-red-800 text-sm">
                  {formatEGP(sup.currentBalance, language)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-bronze-500 font-mono">
                <span>أجل التوريد: {sup.paymentTermsDays} يوم</span>
                <span className="text-emerald-700 font-bold">حساب نشط</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-lg w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">إضافة شركة موردة جديدة | Add Supplier</span>
              <button onClick={() => setIsAddOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">اسم الشركة الموردة:</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="شركة صافولا للأغذية مصر..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">اسم مسؤول المبيعات:</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="أ. عادل النجار..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">رقم الهاتف:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">العنوان / المصنع:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
