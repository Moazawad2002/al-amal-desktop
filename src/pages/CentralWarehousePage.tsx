import React, { useState } from 'react';
import {
  Warehouse,
  Plus,
  Search,
  Filter,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Building,
  CheckCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { Product } from '../types/erp';
import { formatEGP } from '../utils/currency';

export const CentralWarehousePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isManager, user } = useAuth();

  const [products, setProducts] = useState<Product[]>(() => mockDb.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'balances' | 'movements'>('balances');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [reason, setReason] = useState('جرد دوري للمستودع');

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.purchaseCost * p.stockQuantity), 0);
  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);

  const filtered = products.filter(p =>
    p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Realistic movements ledger
  const movements = [
    { id: 'mov-1', number: 'MOV-20261012-001', type: 'sales_deduction', product: 'زيت ذرة كريستال 1.6 لتر', qty: -20, unit: 'كرتونة', ref: 'فاتورة INV-2026-0101', date: '2026-10-12 11:20' },
    { id: 'mov-2', number: 'MOV-20261011-002', type: 'purchase_receipt', product: 'أرز مصري الساعة عريض الحبة', qty: +150, unit: 'باكت', ref: 'توريد مضارب الأرز', date: '2026-10-11 14:00' },
    { id: 'mov-3', number: 'MOV-20261010-003', type: 'sales_deduction', product: 'تونة أمريكانا قطع 185 جم', qty: -12, unit: 'كرتونة', ref: 'فاتورة INV-2026-0102', date: '2026-10-10 09:45' },
    { id: 'mov-4', number: 'MOV-20261009-004', type: 'customer_return', product: 'مكرونة ريجينا فرن 400 جم', qty: +5, unit: 'كرتونة', ref: 'مرتجع رقم RET-002', date: '2026-10-09 16:30' },
  ];

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    selectedProduct.stockQuantity = newQuantity;
    mockDb.saveProduct(selectedProduct);
    setProducts(mockDb.getProducts());
    setIsAdjustOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('centralWarehouse')}
            </h1>
            <span className="bg-gold-100 text-gold-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gold-300">
              مستودع مركزي وحيد (العبور)
            </span>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            الرقابة اللوجستية، أرصدة البضائع الصالحة للبيع، وسجل حركات الإدخال والإخراج
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              setSelectedProduct(products[0]);
              setNewQuantity(products[0]?.stockQuantity || 0);
              setIsAdjustOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>تسوية جردية للمخزون</span>
          </button>
        )}
      </div>

      {/* Warehouse Info Banner */}
      <div className="bg-bronze-900 text-cream-100 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs border border-bronze-800">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-gold-400" />
          <div>
            <div className="font-bold text-sm text-gold-300">المستودع الرئيسي - شركة الأمل (Al Amal Central Hub)</div>
            <div className="text-bronze-300 text-[11px]">المنطقة الصناعية الأولى - مدينة العبور - بلوك 12004</div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div>
            <span className="text-bronze-400 block text-[10px]">إجمالي العبوات:</span>
            <span className="text-sm font-bold text-cream-100">{totalUnits} طرد</span>
          </div>
          <div>
            <span className="text-bronze-400 block text-[10px]">قيمة المخزون الإجمالية (تكلفة):</span>
            <span className="text-sm font-bold text-gold-400">{formatEGP(totalInventoryValue, language)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('balances')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'balances' ? 'bg-gold-500 text-bronze-900 shadow-sm' : 'text-bronze-700 hover:bg-cream-100'
          }`}
        >
          أرصدة الأصناف بالمستودع
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'movements' ? 'bg-gold-500 text-bronze-900 shadow-sm' : 'text-bronze-700 hover:bg-cream-100'
          }`}
        >
          سجل حركات المخزون (Ledger)
        </button>
      </div>

      {/* Tab 1: Balances Table */}
      {activeTab === 'balances' && (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-xl border border-gold-200/60 shadow-sm flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث باسم الصنف أو الكود..."
                className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                    <th className="py-3 px-4">كود SKU</th>
                    <th className="py-3 px-4">اسم الصنف الغذائي</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">الوحدة</th>
                    <th className="py-3 px-4">الكمية الصالحة للبيع</th>
                    <th className="py-3 px-4">متوسط التكلفة</th>
                    <th className="py-3 px-4">إجمالي القيمة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gold-800">{prod.sku}</td>
                      <td className="py-3 px-4 font-bold text-bronze-900">{prod.nameAr}</td>
                      <td className="py-3 px-4 text-bronze-600">{prod.categoryName}</td>
                      <td className="py-3 px-4 text-bronze-700">{prod.unit}</td>
                      <td className="py-3 px-4 font-mono font-bold text-bronze-900">
                        <span className={`px-2 py-0.5 rounded ${prod.stockQuantity <= prod.minStockLevel ? 'bg-amber-100 text-amber-900' : ''}`}>
                          {prod.stockQuantity} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-bronze-600">{formatEGP(prod.purchaseCost, language)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-gold-700">
                        {formatEGP(prod.purchaseCost * prod.stockQuantity, language)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isManager && (
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setNewQuantity(prod.stockQuantity);
                              setIsAdjustOpen(true);
                            }}
                            className="text-xs text-gold-700 hover:text-gold-900 font-bold underline"
                          >
                            تعديل الجرد
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Movements Ledger */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                  <th className="py-3 px-4">رقم الحركة</th>
                  <th className="py-3 px-4">نوع الحركة</th>
                  <th className="py-3 px-4">الصنف</th>
                  <th className="py-3 px-4">الكمية</th>
                  <th className="py-3 px-4">المرجع</th>
                  <th className="py-3 px-4">تاريخ ووقت الحركة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-bronze-600">{mov.number}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mov.type === 'purchase_receipt'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mov.type === 'customer_return'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mov.type === 'purchase_receipt' ? 'استلام مشتريات' : mov.type === 'customer_return' ? 'مرتجع عميل' : 'صرف فاتورة مبيعات'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-bronze-900">{mov.product}</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={mov.qty > 0 ? 'text-emerald-700' : 'text-red-700'}>
                        {mov.qty > 0 ? `+${mov.qty}` : mov.qty} {mov.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-bronze-600">{mov.ref}</td>
                    <td className="py-3 px-4 font-mono text-bronze-500">{mov.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {isAdjustOpen && selectedProduct && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-md w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">تسوية رصيد الجرد الفعلي | Inventory Adjustment</span>
              <button onClick={() => setIsAdjustOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-bronze-500 block">الصنف المختار:</span>
                <span className="text-sm font-bold text-bronze-900">{selectedProduct.nameAr}</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">الكمية الفعلية الجديدة بالمستودع:</label>
                <input
                  type="number"
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">سبب التسوية الجردية:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg shadow"
                >
                  اعتماد التسوية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
