'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export const TableView: React.FC = () => {
  const { workspace, activeBoardId, setActiveCard, updateCardProperties, createCard, searchQuery } = useWorkspaceStore();
  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  if (!activeBoard) return null;

  const allCards = Object.values(activeBoard.cards).filter((card) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.properties.status?.toLowerCase().includes(query) ||
      card.properties.tags?.some((t) => t.toLowerCase().includes(query))
    );
  });

  const handleCreateInFirstCol = () => {
    const defaultCol = activeBoard.columns[0];
    if (defaultCol) {
      createCard(defaultCol.id, 'New task');
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#181818] border-b border-[#2b2b2b] text-[#777777] font-medium text-[11px]">
              <th className="px-3 py-2 w-1/3">Name</th>
              <th className="px-3 py-2 w-32">Status</th>
              <th className="px-3 py-2 w-28">Priority</th>
              <th className="px-3 py-2 w-28">Date</th>
              <th className="px-3 py-2 w-36">Assignee</th>
              <th className="px-3 py-2">Tags</th>
              <th className="px-3 py-2 w-24 text-right">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {allCards.map((card) => {
              const todos = card.blocks.filter((b) => b.type === 'todo');
              const completedTodos = todos.filter((b) => b.checked).length;
              const hasTodos = todos.length > 0;
              const progressPercent = hasTodos ? Math.round((completedTodos / todos.length) * 100) : 0;

              return (
                <tr
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className="hover:bg-[#252525] cursor-pointer transition text-[#cccccc]"
                >
                  <td className="px-3 py-2 text-[#ebebeb] font-normal">
                    {card.title}
                  </td>

                  <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={card.properties.status || ''}
                      onChange={(e) => updateCardProperties(card.id, { status: e.target.value })}
                      className="bg-transparent hover:bg-[#282828] rounded px-1.5 py-0.5 text-xs text-[#cccccc] focus:outline-none w-full"
                    >
                      {activeBoard.columns.map((col) => (
                        <option key={col.id} value={col.title} className="bg-[#242424]">
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={card.properties.priority || 'Medium'}
                      onChange={(e) => updateCardProperties(card.id, { priority: e.target.value as any })}
                      className="bg-transparent hover:bg-[#282828] rounded px-1.5 py-0.5 text-xs text-[#cccccc] focus:outline-none w-full"
                    >
                      <option value="Low" className="bg-[#242424]">Low</option>
                      <option value="Medium" className="bg-[#242424]">Medium</option>
                      <option value="High" className="bg-[#242424]">High</option>
                      <option value="Critical" className="bg-[#242424]">Critical</option>
                    </select>
                  </td>

                  <td className="px-3 py-2 text-[#888888]">
                    {card.properties.due_date ? format(new Date(card.properties.due_date), 'MMM d') : '-'}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex -space-x-1 overflow-hidden">
                      {card.properties.assignees?.map((a, i) => (
                        <div
                          key={i}
                          title={a}
                          className="w-4 h-4 rounded-full bg-[#3a3a3a] text-[#cccccc] flex items-center justify-center text-[9px]"
                        >
                          {a.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {card.properties.tags?.map((t, i) => (
                        <span key={i} className="px-1 py-0.2 rounded bg-[#2a2a2a] text-[#888888] text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-2 text-right font-mono text-[11px] text-[#777777]">
                    {hasTodos ? `${progressPercent}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-1.5 bg-[#181818] border-t border-[#282828]">
          <button
            onClick={handleCreateInFirstCol}
            className="flex items-center gap-1 text-xs text-[#777777] hover:text-[#cccccc] px-2 py-1 rounded hover:bg-[#242424] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
