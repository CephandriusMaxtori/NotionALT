'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Kanban, 
  Table as TableIcon, 
  ListOrdered, 
  Search, 
  Zap, 
  Plus, 
  SlidersHorizontal 
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
    { id: 'list', label: 'List', icon: ListOrdered },
  ];

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0b101d] px-6 flex items-center justify-between shrink-0 select-none">
      {/* Title & Editable Board Heading */}
      <div className="flex items-center gap-3">
        <span className="text-xl">{activeBoard?.icon || '📋'}</span>
        <input
          type="text"
          value={activeBoard?.title || ''}
          onChange={(e) => {
            if (activeBoard) updateBoardTitle(activeBoard.id, e.target.value);
          }}
          className="bg-transparent font-semibold text-base text-slate-100 focus:outline-none focus:bg-slate-800/50 px-2 py-0.5 rounded border border-transparent hover:border-slate-700/60 transition"
        />
        {activeBoard?.description && (
          <span className="hidden md:inline-block text-xs text-slate-400 border-l border-slate-700 pl-3">
            {activeBoard.description}
          </span>
        )}
      </div>

      {/* Center/Right Views & Controls */}
      <div className="flex items-center gap-3">
        {/* View Switcher */}
        <div className="flex bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = viewMode === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cards, tags, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-44 md:w-56 bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:w-64 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Automations Button */}
        <button
          onClick={() => setAutomationModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Butler</span>
          {activeBoard?.automations?.length ? (
            <span className="bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {activeBoard.automations.filter((a) => a.enabled).length}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
};

