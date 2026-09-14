'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layout, 
  Sparkles, 
  Zap, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw,
  FolderKanban,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    workspace, 
    activeBoardId, 
    setActiveBoard, 
    createBoard, 
    deleteBoard,
    setAutomationModalOpen,
    resetToDefaults,
    importWorkspaceData,
    setToastMessage
  } = useWorkspaceStore();

  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('📋');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createBoard(newTitle.trim(), '', newIcon);
      setNewTitle('');
      setIsNewBoardOpen(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspace, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `notion-board-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage("💾 Workspace exported successfully!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.boards)) {
            importWorkspaceData(parsed);
            setToastMessage("✅ Workspace imported successfully!");
          } else {
            alert("Invalid workspace backup file structure.");
          }
        } catch (err) {
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#0d1322] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Workspace Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            NB
          </div>
          <div>
            <h1 className="font-semibold text-sm text-slate-100 leading-tight">Notion Board</h1>
            <p className="text-[11px] text-slate-400">Hybrid Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation Trees */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Boards Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              Boards & Canvases
            </span>
            <button
              onClick={() => setIsNewBoardOpen(!isNewBoardOpen)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition"
              title="Add Board"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isNewBoardOpen && (
            <form onSubmit={handleCreateBoard} className="mb-3 p-2 bg-slate-800/70 rounded-lg border border-slate-700/60 space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="⚡"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-8 text-center bg-slate-900 border border-slate-700 rounded text-xs py-1"
                />
                <input
                  type="text"
                  placeholder="Board Title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  className="flex-1 bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsNewBoardOpen(false)}
                  className="text-[11px] px-2 py-0.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[11px] px-2.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {workspace.boards.map((board) => {
              const isActive = board.id === activeBoardId;
              const cardCount = Object.keys(board.cards || {}).length;

              return (
                <div
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{board.icon || '📋'}</span>
                    <span className="truncate">{board.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                      {cardCount}
                    </span>
                    {workspace.boards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete board "${board.title}"?`)) {
                            deleteBoard(board.id);
                          }
                        }}
                        className="hidden group-hover:block p-1 hover:text-rose-400 text-slate-500 rounded"
                        title="Delete Board"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Butler Automations Shortcut */}
        <div>
          <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Butler Automation
          </div>
          <button
            onClick={() => setAutomationModalOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              Automations & Rules
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400/70" />
          </button>
        </div>

        {/* Quick Tips */}
        <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1.5 text-xs text-slate-300">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Notion + Trello Best Of Both
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Drag cards across columns, click any card to compose rich block notes, and set Butler triggers to automate tasks!
          </p>
        </div>
      </div>

      {/* Workspace Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            Data Options
          </span>
          <button
            onClick={resetToDefaults}
            className="hover:text-rose-400 transition"
            title="Reset to sample demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs rounded border border-slate-700 transition"
            title="Export JSON backup"
          >
            <Download className="w-3 h-3" />
            Export
          </button>

          <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs rounded border border-slate-700 transition cursor-pointer">
            <Upload className="w-3 h-3" />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
    </aside>
  );
};

