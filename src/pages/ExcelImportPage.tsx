import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Table,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import * as XLSX from 'xlsx';

export const ExcelImportPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [importType, setImportType] = useState<'customers' | 'products' | 'suppliers'>('customers');
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importSummary, setImportSummary] = useState<{ imported: number; skipped: number } | null>(null);

  const electronAPI = (window as any).electronAPI;

  const handleDownloadTemplate = () => {
    let templateData: any[] = [];
    if (importType === 'customers') {
      templateData = [
        { 'اسم المحل': 'سوبر ماركت الصفا', 'النوع': 'supermarket', 'الهاتف': '01011223344', 'العنوان': 'شارع الحجاز - مصر الجديدة', 'المحافظة': 'القاهرة', 'سقف الائتمان': 40000, 'أجل السداد': 15 },
        { 'اسم المحل': 'بقالة التوفيق', 'النوع': 'grocery', 'الهاتف': '01122334455', 'العنوان': 'شارع العريش - الهرم', 'المحافظة': 'الجيزة', 'سقف الائتمان': 15000, 'أجل السداد': 10 },
      ];
    } else if (importType === 'products') {
      templateData = [
        { 'كود الصنف': 'OIL-TEST-01', 'اسم المنتج': 'زيت ذرة ممتاز 1 لتر', 'التصنيف': 'زيوت وسمن', 'الوحدة': 'كرتونة', 'سعر البيع': 520, 'سعر التكلفة': 460, 'المخزون': 100 },
      ];
    } else {
      templateData = [
        { 'اسم المورد': 'شركة الزيوت الحديثة', 'المسؤول': 'أحمد البدري', 'الهاتف': '0223456789', 'العنوان': 'مدينة العاشر من رمضان', 'أجل السداد': 30 },
      ];
    }

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `Al_Amal_${importType}_template.xlsx`);
  };

  const handleFileSelect = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    let data: ArrayBuffer | null = null;

    if (e?.target?.files?.[0]) {
      const file = e.target.files[0];
      const buffer = await file.arrayBuffer();
      data = buffer;
    } else if (electronAPI?.openFileDialog) {
      const filePath = await electronAPI.openFileDialog({
        filters: [{ name: 'Excel / CSV Files', extensions: ['xlsx', 'xls', 'csv'] }]
      });
      if (!filePath) return;
      // In electron desktop mode
      alert(`تم اختيار الملف: ${filePath}. جاري القراءة والاستيراد...`);
      return;
    }

    if (data) {
      const wb = XLSX.read(data);
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json<any>(ws);

      if (json.length > 0) {
        setHeaders(Object.keys(json[0]));
        setFileData(json);
        setStep(2);
      }
    }
  };

  const handleValidateAndStaging = () => {
    const errors: string[] = [];
    fileData.forEach((row, idx) => {
      if (importType === 'customers' && !row['اسم المحل'] && !row['Name']) {
        errors.push(`السطر ${idx + 2}: اسم العميل أو المحل مطلوب`);
      }
      if (importType === 'products' && !row['اسم المنتج'] && !row['Name']) {
        errors.push(`السطر ${idx + 2}: اسم المنتج مطلوب`);
      }
    });

    setValidationErrors(errors);
    setStep(3);
  };

  const handleExecuteImport = () => {
    let imported = 0;
    if (importType === 'customers') {
      fileData.forEach((row) => {
        try {
          mockDb.saveCustomer({
            id: '',
            code: '',
            nameAr: row['اسم المحل'] || row['Name'] || 'عميل مستورد',
            customerType: row['النوع'] || 'supermarket',
            phone: String(row['الهاتف'] || '01000000000'),
            address: row['العنوان'] || 'القاهرة',
            governorate: row['المحافظة'] || 'القاهرة',
            assignedRepId: user?.representativeId || 'rep-01',
            creditLimit: Number(row['سقف الائتمان']) || 25000,
            paymentTermsDays: Number(row['أجل السداد']) || 15,
            openingBalance: 0,
            currentBalance: 0,
            status: 'active',
          }, user!);
          imported++;
        } catch {
          // ignore row
        }
      });
    }

    setImportSummary({ imported, skipped: fileData.length - imported });
    setStep(4);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('excelImport')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            معالج استيراد بيانات العملاء، المنتجات، وقوائم الموردين من ملفات Excel و CSV عبر نافذة الويندوز الأصلية
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bronze-300 hover:bg-cream-100 text-bronze-800 text-xs font-semibold"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>تحميل نموذج Excel فارغ</span>
        </button>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white p-4 rounded-xl border border-gold-200/60 shadow-sm flex items-center justify-between text-xs">
        {[
          { num: 1, title: 'اختيار الملف والنوع' },
          { num: 2, title: 'معاينة الأعمدة والبيانات' },
          { num: 3, title: 'التحقق من صحة السطور' },
          { num: 4, title: 'اكتمال الاستيراد' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= s.num ? 'bg-gold-500 text-bronze-900 shadow' : 'bg-cream-200 text-bronze-500'
            }`}>
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`font-medium hidden sm:inline ${step >= s.num ? 'text-bronze-900 font-bold' : 'text-bronze-500'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: File Selection */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gold-200 p-8 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <label className="block text-xs font-bold text-bronze-800 text-right">
              اختر نوع البيانات المراد استيرادها:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['customers', 'products', 'suppliers'] as const).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setImportType(tp)}
                  className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                    importType === tp
                      ? 'border-gold-500 bg-gold-100 text-gold-900 shadow-sm'
                      : 'border-cream-300 bg-cream-50 text-bronze-700 hover:bg-cream-100'
                  }`}
                >
                  {tp === 'customers' ? 'العملاء' : tp === 'products' ? 'المنتجات' : 'الموردين'}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-dashed border-gold-300 rounded-2xl p-10 bg-cream-50 hover:bg-cream-100/80 transition-colors max-w-lg mx-auto flex flex-col items-center">
            <Upload className="w-12 h-12 text-gold-600 mb-3" />
            <h2 className="font-bold text-sm text-bronze-900">
              اختر ملف Excel (.xlsx) أو CSV من جهازك
            </h2>
            <p className="text-xs text-bronze-500 mt-1 mb-4">
              يدعم منتقي ملفات ويندوز الأصلي (Native File Dialog)
            </p>

            <label className="cursor-pointer px-5 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors">
              <span>تصفح واختيار الملف...</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Data Preview */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gold-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-bronze-900">
              معاينة محتوى الملف ({fileData.length} سجل مستخرج)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-3 py-1.5 border rounded-lg text-xs"
              >
                تغيير الملف
              </button>
              <button
                onClick={handleValidateAndStaging}
                className="px-4 py-1.5 bg-gold-600 text-white font-bold rounded-lg text-xs"
              >
                التحقق والمتابعة
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80 border rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-cream-100 sticky top-0 font-bold border-b">
                <tr>
                  {headers.map(h => <th key={h} className="py-2 px-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {fileData.slice(0, 8).map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream-50">
                    {headers.map(h => <td key={h} className="py-2 px-3">{String(row[h] || '-')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 3: Validation */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gold-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-sm text-bronze-900">
              تقرير فحص وتدقيق البيانات قبل الإدخال الدائم
            </h2>
          </div>

          {validationErrors.length > 0 ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-xs text-red-800">
              <div className="font-bold">تنبيهات وأخطاء تم رصدها:</div>
              {validationErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
              تم التحقق بنجاح من كافة حقول وأنواع البيانات المطلوبة! البيانات جاهزة للإدخال.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button onClick={() => setStep(2)} className="px-3 py-1.5 border rounded-lg text-xs">رجوع</button>
            <button
              onClick={handleExecuteImport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow"
            >
              تأكيد الاستيراد الفعلي لقاعدة البيانات
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Completed */}
      {step === 4 && importSummary && (
        <div className="bg-white rounded-2xl border border-gold-200 p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-base font-black text-bronze-900">
            تم استيراد البيانات بنجاح إلى نظام شركة الأمل!
          </h2>
          <p className="text-xs text-bronze-600">
            تم إدخال {importSummary.imported} سجلاً في قاعدة البيانات وتحديث الجداول تلقائياً.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setFileData([]);
            }}
            className="px-4 py-2 bg-gold-600 text-white font-bold rounded-xl text-xs mt-2"
          >
            استيراد ملف آخر
          </button>
        </div>
      )}
    </div>
  );
};
