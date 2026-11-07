import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Clock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';
import { formatDateTime } from '../utils/date';

export const AuditLogsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const logs = mockDb.getAuditLogs(user!);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-gold-600" />
            <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
              {t('auditLog')}
            </h1>
          </div>
          <p className="text-xs text-bronze-600 mt-1">
            سجل التدقيق والرقابة غير القابل للتعديل لعمليات الفواتير والتحصيلات والمصروفات
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gold-200/60 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bronze-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالعملية أو البريد أو الكيان..."
            className="w-full pr-9 pl-3 py-2 border border-bronze-300 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">تاريخ ووقت العملية</th>
                <th className="py-3 px-4">المستخدم</th>
                <th className="py-3 px-4">نوع العملية (Action)</th>
                <th className="py-3 px-4">الجدول / الكيان</th>
                <th className="py-3 px-4">رقم السجل</th>
                <th className="py-3 px-4">تفاصيل العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-bronze-500 whitespace-nowrap">
                    {formatDateTime(log.createdAt, language)}
                  </td>
                  <td className="py-3 px-4 font-mono text-bronze-800 font-semibold">{log.userEmail}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-cream-200 text-bronze-900 px-2 py-0.5 rounded text-[11px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-bronze-700">{log.entityType}</td>
                  <td className="py-3 px-4 font-mono text-bronze-500">{log.entityId}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-bronze-600 max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
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
