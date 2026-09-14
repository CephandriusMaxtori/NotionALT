'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Kanban, 
  Table as TableIcon, 
  List, 
  Search, 
  Zap
} from 'lucide-react';
import { ViewMode } from '@/types';

export const Header: React.FC = () => {
  const { 
    workspace, 
    activeBoardId, 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery,
    setAutomationModalOpen,
    updateBoardTitle
  } = useWorkspaceStore();

  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  const views: { id: ViewMode; label: string; icon: any }[] = [
    { id: 'board', label: 'Board', icon: Kanban },
    { id: 'table', label: 'Table', icon: TableIcon },
    { id: 'list', label: 'List', icon: List },
  ];

  return (
    <header className="h-11 border-b border-[#2d2d2d] bg-[#191919] px-4 flex items-center justify-between shrink-0 select-none text-xs">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-base">{activeBoard?.icon || '📄'}</span>
        <input
          type="text"
          value={activeBoard?.title || ''}
          onChange={(e) => {
            if (activeBoard) updateBoardTitle(activeBoard.id, e.target.value);
          }}
          className="bg-transparent font-medium text-[13px] text-[#e0e0e0] focus:outline-none focus:bg-[#252525] px-1.5 py-0.5 rounded transition"
        />
      </div>

      {/* Center/Right Views & Controls */}
      <div className="flex items-center gap-2">
        {/* View Switcher */}
        <div className="flex bg-[#232323] p-0.5 rounded border border-[#303030]">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = viewMode === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-normal transition ${
                  isActive
                    ? 'bg-[#333333] text-[#ffffff]'
                    : 'text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 md:w-44 bg-[#232323] border border-[#303030] rounded pl-6 pr-2 py-1 text-[11px] text-[#e0e0e0] placeholder:text-[#666666] focus:outline-none focus:border-[#555555] transition"
          />
        </div>

        {/* Automations */}
        <button
          onClick={() => setAutomationModalOpen(true)}
          className="flex items-center gap-1 px-2 py-1 bg-[#232323] hover:bg-[#2a2a2a] text-[#b0b0b0] hover:text-[#e0e0e0] border border-[#303030] rounded text-[11px] transition"
        >
          <Zap className="w-3 h-3 text-[#999999]" />
          <span>Rules</span>
          {activeBoard?.automations?.filter(a => a.enabled).length ? (
            <span className="text-[10px] text-[#777777] font-mono">
              ({activeBoard.automations.filter((a) => a.enabled).length})
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
};
