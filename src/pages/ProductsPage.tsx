import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  Download,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { Product } from '../types/erp';
import { formatEGP } from '../utils/currency';
import * as XLSX from 'xlsx';

export const ProductsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isManager } = useAuth();

  const [products, setProducts] = useState<Product[]>(() => mockDb.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [nameAr, setNameAr] = useState('');
  const [sku, setSku] = useState('');
  const [categoryName, setCategoryName] = useState('زيوت وسمن');
  const [unit, setUnit] = useState('كرتونة');
  const [sellingPrice, setSellingPrice] = useState(100);
  const [purchaseCost, setPurchaseCost] = useState(85);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [minStockLevel, setMinStockLevel] = useState(20);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    const matchesCat = categoryFilter === 'all' || p.categoryName === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newP = mockDb.saveProduct({
      id: '',
      sku: sku || `PRD-${Date.now()}`,
      nameAr,
      categoryId: 'cat-general',
      categoryName,
      unit,
      purchaseCost,
      sellingPrice,
      minStockLevel,
      reorderPoint: minStockLevel * 2,
      status: 'active',
      stockQuantity,
    });
    setProducts(mockDb.getProducts());
    setIsAddOpen(false);
  };

  const handleExportExcel = () => {
    const data = filtered.map(p => ({
      'كود الصنف (SKU)': p.sku,
      'الباركود': p.barcode || '-',
      'اسم الصنف': p.nameAr,
      'التصنيف': p.categoryName,
      'الوحدة': p.unit,
      'سعر البيع': p.sellingPrice,
      ...(isManager ? { 'تكلفة الشراء': p.purchaseCost, 'هامش الربح': p.sellingPrice - p.purchaseCost } : {}),
      'المخزون بالمستودع المركزي': p.stockQuantity,
      'حد إعادة الطلب': p.minStockLevel,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, `Al_Amal_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('products')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            دليل الأصناف الغذائية، أسعار البيع المعتمدة، ومراقبة التكلفة والمخزون
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
          {isManager && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-bronze-900 text-xs font-black shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنف غذائي</span>
            </button>
          )}
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
            placeholder="بحث باسم الصنف أو الباركود أو الكود..."
            className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gold-600 ml-1 shrink-0" />
          {['all', 'زيوت وسمن', 'حبوب وبقوليات', 'مكرونة وصلصة', 'معلبات وتونة', 'شاي ومشروبات', 'ألبان وأجبان'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat ? 'bg-gold-500 text-bronze-900 font-bold' : 'bg-cream-100 text-bronze-700 hover:bg-cream-200'
              }`}
            >
              {cat === 'all' ? 'جميع التصنيفات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">كود الصنف (SKU)</th>
                <th className="py-3 px-4">الصنف والعبوة الغذائية</th>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">الوحدة</th>
                <th className="py-3 px-4">سعر البيع للعميل</th>
                {isManager && <th className="py-3 px-4 text-amber-900">تكلفة الشراء</th>}
                {isManager && <th className="py-3 px-4 text-emerald-900">هامش الربح</th>}
                <th className="py-3 px-4">المتاح بالمستودع</th>
                <th className="py-3 px-4">حالة التوفر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((prod) => {
                const margin = prod.sellingPrice - prod.purchaseCost;
                const isLow = prod.stockQuantity <= prod.minStockLevel;

                return (
                  <tr key={prod.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold-800">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-bronze-900">{prod.nameAr}</div>
                      <div className="text-[10px] text-bronze-500 font-mono mt-0.5">{prod.barcode || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-bronze-600">
                      {prod.categoryName}
                    </td>
                    <td className="py-3 px-4 text-bronze-700 font-medium">
                      {prod.unit}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-bronze-900">
                      {formatEGP(prod.sellingPrice, language)}
                    </td>
                    {isManager && (
                      <td className="py-3 px-4 font-mono text-bronze-600">
                        {formatEGP(prod.purchaseCost, language)}
                      </td>
                    )}
                    {isManager && (
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        +{formatEGP(margin, language)}
                      </td>
                    )}
                    <td className="py-3 px-4 font-mono font-bold text-bronze-800">
                      {prod.stockQuantity} {prod.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isLow
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {isLow ? 'مخزون حرج' : 'متوفر للبيع'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-bronze-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-bronze-200 max-w-lg w-full text-right">
            <div className="bg-bronze-900 text-cream-100 p-4 flex items-center justify-between rounded-t-2xl">
              <span className="font-bold text-sm text-gold-300">إضافة صنف غذائي جديد | Add Product</span>
              <button onClick={() => setIsAddOpen(false)} className="text-cream-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">اسم الصنف الغذائي باللغة العربية:</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مكرونة ريجينا شعرية 400 جم (كرتونة 20 كيس)..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">التصنيف:</label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="زيوت وسمن">زيوت وسمن</option>
                    <option value="حبوب وبقوليات">حبوب وبقوليات</option>
                    <option value="مكرونة وصلصة">مكرونة وصلصة</option>
                    <option value="معلبات وتونة">معلبات وتونة</option>
                    <option value="شاي ومشروبات">شاي ومشروبات</option>
                    <option value="ألبان وأجبان">ألبان وأجبان</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">الوحدة:</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="كرتونة">كرتونة</option>
                    <option value="باكت">باكت / ربطة</option>
                    <option value="قطعة">قطعة / عبوة</option>
                    <option value="كيلوجرام">كيلوجرام</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">سعر البيع المعتمد (ج.م):</label>
                  <input
                    type="number"
                    min="1"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">تكلفة الشراء (ج.م):</label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">الرصيد الافتتاحي بالمستودع:</label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">حد المخزون الحرج:</label>
                  <input
                    type="number"
                    min="1"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(Number(e.target.value))}
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
                  حفظ الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
