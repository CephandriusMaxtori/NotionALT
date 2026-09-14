'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { TableView } from '@/components/views/TableView';
import { ListView } from '@/components/views/ListView';
import { CardDrawer } from '@/components/card-drawer/CardDrawer';
import { AutomationModal } from '@/components/automation/AutomationModal';
import { Zap, Sparkles } from 'lucide-react';

export default function Home() {
  const { viewMode, toastMessage } = useWorkspaceStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 antialiased font-sans">
      {/* Left Workspace Tree Navigation Pane */}
      <Sidebar />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#090d16]">
        {/* Top App Header & View Switcher */}
        <Header />

        {/* Dynamic Multi-View Workspace Rendering */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {viewMode === 'board' && <KanbanBoard />}
          {viewMode === 'table' && <TableView />}
          {viewMode === 'list' && <ListView />}
        </main>
      </div>

      {/* Right Slide-over Deep-Dive Card Canvas */}
      <CardDrawer />

      {/* Butler Automations Visual Rule Builder Modal */}
      <AutomationModal />

      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/90 text-amber-300 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

