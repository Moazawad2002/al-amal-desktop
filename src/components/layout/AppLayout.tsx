import React, { useState } from 'react';
import { DesktopTitleBar } from './DesktopTitleBar';
import { Sidebar, AppPage } from './Sidebar';
import { SetupScreen } from '../common/SetupScreen';

interface AppLayoutProps {
  currentPage: AppPage;
  onSelectPage: (page: AppPage) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onSelectPage,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-cream-100 overflow-hidden font-sans text-bronze-900 select-none">
      {/* Native Desktop Titlebar */}
      <DesktopTitleBar onOpenSetup={() => setIsSetupOpen(true)} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={onSelectPage}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin bg-cream-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Setup / Supabase Configuration Modal */}
      {isSetupOpen && (
        <SetupScreen onClose={() => setIsSetupOpen(false)} />
      )}
    </div>
  );
};
