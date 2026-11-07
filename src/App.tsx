import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AppPage } from './components/layout/Sidebar';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';
import { RepresentativeDashboardPage } from './pages/RepresentativeDashboardPage';
import { SalesInvoicesPage } from './pages/SalesInvoicesPage';
import { SalesRepsPerformancePage } from './pages/SalesRepsPerformancePage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { CentralWarehousePage } from './pages/CentralWarehousePage';
import { PurchasesSuppliersPage } from './pages/PurchasesSuppliersPage';
import { ReturnsDiscountsPage } from './pages/ReturnsDiscountsPage';
import { CollectionsReceivablesPage } from './pages/CollectionsReceivablesPage';
import { CashExpensesPage } from './pages/CashExpensesPage';
import { ExpirationDamagedPage } from './pages/ExpirationDamagedPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';
import { ExcelImportPage } from './pages/ExcelImportPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { user, isAuthenticated, isManager } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('executive-dashboard');

  // Role-based auto navigation
  useEffect(() => {
    if (isAuthenticated) {
      if (!isManager && (currentPage === 'executive-dashboard' || currentPage === 'sales-reps' || currentPage === 'cash-expenses' || currentPage === 'user-management' || currentPage === 'settings')) {
        setCurrentPage('rep-dashboard');
      } else if (isManager && currentPage === 'rep-dashboard') {
        setCurrentPage('executive-dashboard');
      }
    }
  }, [user, isManager, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'executive-dashboard':
        return <ExecutiveDashboardPage />;
      case 'rep-dashboard':
        return <RepresentativeDashboardPage onNavigate={setCurrentPage} />;
      case 'sales-invoices':
        return <SalesInvoicesPage />;
      case 'sales-reps':
        return <SalesRepsPerformancePage />;
      case 'customers':
        return <CustomersPage />;
      case 'products':
        return <ProductsPage />;
      case 'central-warehouse':
        return <CentralWarehousePage />;
      case 'purchases-suppliers':
        return <PurchasesSuppliersPage />;
      case 'returns-discounts':
        return <ReturnsDiscountsPage />;
      case 'collections-receivables':
        return <CollectionsReceivablesPage />;
      case 'cash-expenses':
        return <CashExpensesPage />;
      case 'expiration-damaged':
        return <ExpirationDamagedPage />;
      case 'reports-analytics':
        return <ReportsAnalyticsPage />;
      case 'excel-import':
        return <ExcelImportPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'audit-log':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage onOpenSetup={() => {}} />;
      default:
        return <ExecutiveDashboardPage />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onSelectPage={setCurrentPage}>
      {renderPage()}
    </AppLayout>
  );
};
export default App;
