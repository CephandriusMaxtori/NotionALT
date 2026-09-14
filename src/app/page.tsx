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

export default function Home() {
  const { viewMode, toastMessage } = useWorkspaceStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#191919] text-[#ebebeb] antialiased">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#191919]">
        <Header />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {viewMode === 'board' && <KanbanBoard />}
          {viewMode === 'table' && <TableView />}
          {viewMode === 'list' && <ListView />}
        </main>
      </div>

      {/* Right Slide-over Card Canvas */}
      <CardDrawer />

      {/* Automations Modal */}
      <AutomationModal />

      {/* Subtle Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded bg-[#252525] text-[#cccccc] border border-[#383838] shadow-lg text-xs font-normal animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
