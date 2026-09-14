'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Plus, 
  Trash2, 
  Zap, 
  Download, 
  Upload, 
  RotateCcw,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser,
    logout,
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
  const [newIcon, setNewIcon] = useState('📄');

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
    downloadAnchor.setAttribute("download", `workspace-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage("Workspace exported");
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
            setToastMessage("Workspace loaded");
          }
        } catch {
          alert("Could not load workspace JSON");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-60 h-screen bg-[#1b1b1b] border-r border-[#2d2d2d] flex flex-col shrink-0 select-none text-[13px] text-[#999999]">
      {/* User Profile / Workspace Header */}
      <div className="px-3.5 py-3 border-b border-[#282828] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded bg-[#2e2e2e] border border-[#383838] flex items-center justify-center text-[11px] text-[#e0e0e0] font-semibold">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-[#e3e3e3] truncate text-[13px]">
              {currentUser?.name || 'My Workspace'}
            </div>
            <div className="text-[10px] text-[#666666] truncate font-mono">
              {currentUser?.email || ''}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1 hover:bg-[#282828] text-[#777777] hover:text-[#e07575] rounded transition"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Boards / Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        <div>
          <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-medium text-[#777777]">
            <span>BOARDS</span>
            <button
              onClick={() => setIsNewBoardOpen(!isNewBoardOpen)}
              className="p-0.5 hover:bg-[#282828] rounded text-[#777777] hover:text-[#d4d4d4] transition"
              title="Add Board"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isNewBoardOpen && (
            <form onSubmit={handleCreateBoard} className="mb-2 p-1.5 bg-[#242424] rounded border border-[#333333] space-y-1.5">
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="📄"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-7 text-center bg-[#181818] border border-[#383838] rounded text-xs py-1 text-[#e0e0e0]"
                />
                <input
                  type="text"
                  placeholder="Board name..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  className="flex-1 bg-[#181818] border border-[#383838] rounded text-xs px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#555555]"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsNewBoardOpen(false)}
                  className="text-[11px] px-2 py-0.5 text-[#888888] hover:text-[#cccccc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[11px] px-2 py-0.5 bg-[#2383e2] text-white rounded font-normal hover:bg-[#1a73cb]"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <div className="space-y-0.5">
            {workspace.boards.map((board) => {
              const isActive = board.id === activeBoardId;
              const cardCount = Object.keys(board.cards || {}).length;

              return (
                <div
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#2a2a2a] text-[#ffffff]'
                      : 'hover:bg-[#232323] text-[#a0a0a0] hover:text-[#e0e0e0]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs">{board.icon || '📄'}</span>
                    <span className="truncate">{board.title}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-[#666666] font-mono group-hover:hidden">
                      {cardCount}
                    </span>
                    {workspace.boards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${board.title}"?`)) {
                            deleteBoard(board.id);
                          }
                        }}
                        className="hidden group-hover:block p-0.5 text-[#777777] hover:text-[#ff6b6b] rounded"
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

        {/* Automations */}
        <div>
          <div className="px-2 mb-1 text-[11px] font-medium text-[#777777]">
            AUTOMATION
          </div>
          <button
            onClick={() => setAutomationModalOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#232323] text-[#a0a0a0] hover:text-[#e0e0e0] text-left transition"
          >
            <Zap className="w-3.5 h-3.5 text-[#b0b0b0]" />
            <span>Rules & Triggers</span>
          </button>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-2.5 border-t border-[#282828] flex items-center justify-between text-xs text-[#777777]">
        <button
          onClick={resetToDefaults}
          className="p-1 hover:bg-[#262626] rounded text-[#777777] hover:text-[#bbbbbb] transition flex items-center gap-1 text-[11px]"
          title="Reset default data"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExport}
            className="p-1 hover:bg-[#262626] rounded text-[#777777] hover:text-[#bbbbbb] transition"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <label className="p-1 hover:bg-[#262626] rounded text-[#777777] hover:text-[#bbbbbb] transition cursor-pointer" title="Import JSON">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
    </aside>
  );
};
