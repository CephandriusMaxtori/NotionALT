'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { CardNode } from '@/types';
import { Plus, Calendar, Tag, AlertCircle, CheckSquare, Sparkles } from 'lucide-react';
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
      createCard(defaultCol.id, 'New Table Entry');
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="bg-[#0e1424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-3 w-1/3">Title</th>
              <th className="p-3 w-36">Status</th>
              <th className="p-3 w-28">Priority</th>
              <th className="p-3 w-32">Due Date</th>
              <th className="p-3 w-40">Assignees</th>
              <th className="p-3">Tags</th>
              <th className="p-3 w-28 text-center">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {allCards.map((card) => {
              const todos = card.blocks.filter((b) => b.type === 'todo');
              const completedTodos = todos.filter((b) => b.checked).length;
              const hasTodos = todos.length > 0;
              const progressPercent = hasTodos ? Math.round((completedTodos / todos.length) * 100) : 0;

              return (
                <tr
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className="hover:bg-slate-800/40 cursor-pointer transition group"
                >
                  {/* Title */}
                  <td className="p-3 font-medium text-slate-200 group-hover:text-indigo-300">
                    <div className="flex items-center gap-2">
                      {card.properties.cover_color && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: card.properties.cover_color }}
                        />
                      )}
                      <span>{card.title}</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={card.properties.status || ''}
                      onChange={(e) => updateCardProperties(card.id, { status: e.target.value })}
                      className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 text-xs w-full focus:outline-none"
                    >
                      {activeBoard.columns.map((col) => (
                        <option key={col.id} value={col.title}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={card.properties.priority || 'Medium'}
                      onChange={(e) => updateCardProperties(card.id, { priority: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 text-xs w-full focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </td>

                  {/* Due Date */}
                  <td className="p-3 text-slate-400">
                    {card.properties.due_date ? format(new Date(card.properties.due_date), 'MMM d, yyyy') : '-'}
                  </td>

                  {/* Assignees */}
                  <td className="p-3">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {card.properties.assignees?.map((a, i) => (
                        <div
                          key={i}
                          title={a}
                          className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[9px] font-bold ring-1 ring-slate-900"
                        >
                          {a.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {card.properties.tags?.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Progress Rollup */}
                  <td className="p-3 text-center">
                    {hasTodos ? (
                      <span className="font-mono text-[11px] text-indigo-300">
                        {progressPercent}%
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* New Row Bar */}
        <div className="p-2 bg-slate-900/40 border-t border-slate-800">
          <button
            onClick={handleCreateInFirstCol}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded hover:bg-slate-800/60 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New row
          </button>
        </div>
      </div>
    </div>
  );
};

