import React from 'react';
import { Users, Shield, UserCheck, Key, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDatabase';

export const UserManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const { availableDemoUsers } = useAuth();
  const reps = mockDb.getReps();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-2xl border border-gold-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gold-600" />
          <h1 className="text-xl sm:text-2xl font-black text-bronze-900 tracking-tight">
            {t('userManagement')}
          </h1>
        </div>
        <p className="text-xs text-bronze-600 mt-1">
          إدارة حسابات مستخدمي النظام الأربعة المصرح لهم (مدير عام الشركة و 3 مناديب مبيعات)
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gold-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-cream-100 text-bronze-800 border-b border-cream-300 font-bold">
                <th className="py-3 px-4">المستخدم</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">الدور الوظيفي</th>
                <th className="py-3 px-4">المندوب المرتبط</th>
                <th className="py-3 px-4">الهاتف</th>
                <th className="py-3 px-4 text-center">حالة الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {availableDemoUsers.map((u) => {
                const rep = reps.find(r => r.id === u.representativeId);
                return (
                  <tr key={u.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-bronze-900 flex items-center gap-2">
                      {u.role === 'manager' ? (
                        <Shield className="w-4 h-4 text-gold-600" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>{u.fullName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-bronze-700">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'manager'
                          ? 'bg-gold-100 text-gold-900 border border-gold-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {u.role === 'manager' ? 'مدير عام الشركة' : 'مندوب مبيعات معتمد'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-bronze-700">
                      {rep ? `${rep.fullNameAr} (${rep.code})` : 'صلاحيات إدارية عامة'}
                    </td>
                    <td className="py-3 px-4 font-mono">{u.phone || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        نشط ومفعل
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
