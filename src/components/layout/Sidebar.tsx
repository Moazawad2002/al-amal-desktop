import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Users,
  Store,
  Package,
  Warehouse,
  Truck,
  RotateCcw,
  BadgeDollarSign,
  Wallet,
  AlertTriangle,
  BarChart3,
  FileSpreadsheet,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export type AppPage =
  | 'executive-dashboard'
  | 'rep-dashboard'
  | 'sales-invoices'
  | 'sales-reps'
  | 'customers'
  | 'products'
  | 'central-warehouse'
  | 'purchases-suppliers'
  | 'returns-discounts'
  | 'collections-receivables'
  | 'cash-expenses'
  | 'expiration-damaged'
  | 'reports-analytics'
  | 'excel-import'
  | 'user-management'
  | 'audit-log'
  | 'settings';

interface SidebarProps {
  currentPage: AppPage;
  onSelectPage: (page: AppPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
}) => {
  const { t, language } = useLanguage();
  const { user, isManager, logout } = useAuth();

  interface NavItem {
    id: AppPage;
    label: string;
    icon: React.ElementType;
    managerOnly?: boolean;
    repOnly?: boolean;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'executive-dashboard', label: t('executiveDashboard'), icon: LayoutDashboard, managerOnly: true },
    { id: 'rep-dashboard', label: t('representativeDashboard'), icon: UserCheck, repOnly: true },
    { id: 'sales-invoices', label: t('salesManagement'), icon: FileText },
    { id: 'customers', label: t('customers'), icon: Store },
    { id: 'products', label: t('products'), icon: Package },
    { id: 'central-warehouse', label: t('centralWarehouse'), icon: Warehouse },
    { id: 'sales-reps', label: t('salesReps'), icon: Users, managerOnly: true },
    { id: 'purchases-suppliers', label: t('purchasesSuppliers'), icon: Truck, managerOnly: true },
    { id: 'collections-receivables', label: t('collectionsReceivables'), icon: BadgeDollarSign },
    { id: 'returns-discounts', label: t('returnsDiscounts'), icon: RotateCcw },
    { id: 'cash-expenses', label: t('cashExpenses'), icon: Wallet, managerOnly: true },
    { id: 'expiration-damaged', label: t('expirationDamaged'), icon: AlertTriangle, badge: '!' },
    { id: 'reports-analytics', label: t('reportsAnalytics'), icon: BarChart3 },
    { id: 'excel-import', label: t('excelImport'), icon: FileSpreadsheet },
    { id: 'user-management', label: t('userManagement'), icon: Users, managerOnly: true },
    { id: 'audit-log', label: t('auditLog'), icon: ShieldAlert, managerOnly: true },
    { id: 'settings', label: t('settings'), icon: Settings, managerOnly: true },
  ];

  const authorizedNavItems = navItems.filter((item) => {
    if (item.managerOnly && !isManager) return false;
    if (item.repOnly && isManager) return false;
    return true;
  });

  return (
    <aside
      className={`h-[calc(100vh-2.5rem)] bg-bronze-900 text-cream-100 flex flex-col justify-between border-l border-bronze-800 transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Company Header */}
      <div>
        <div className="p-3 border-b border-bronze-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={logoImg}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full bg-cream-100 p-1 border-2 border-gold-500 shadow-md shrink-0"
            />
            {!collapsed && (
              <div className="leading-tight">
                <h1 className="font-bold text-xs text-gold-400 truncate">
                  شركة الأمل لتوزيع الأغذية
                </h1>
                <p className="text-[10px] text-bronze-300 truncate font-mono">
                  Al Amal DMS • Obour City
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-bronze-800 text-cream-300 hover:text-gold-400 transition-colors"
            title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {collapsed ? (
              language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin">
          {authorizedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500 text-bronze-900 font-bold shadow-md shadow-gold-500/20'
                    : 'text-cream-200 hover:bg-bronze-800 hover:text-gold-300'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-bronze-900' : 'text-gold-400'}`} />
                {!collapsed && <span className="truncate flex-1 text-right">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-2 border-t border-bronze-800 bg-bronze-950/60">
        <div className={`flex items-center gap-2 px-2 py-1.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gold-600 text-bronze-900 font-bold text-xs flex items-center justify-center shrink-0 border border-gold-400">
            {user?.fullName.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold text-cream-100 truncate">{user?.fullName}</div>
              <div className="text-[10px] text-gold-400 truncate font-medium">
                {user?.role === 'manager' ? 'مدير عام الشركة' : 'مندوب مبيعات معتمد'}
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded hover:bg-bronze-800 text-cream-300 hover:text-red-400 transition-colors"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
