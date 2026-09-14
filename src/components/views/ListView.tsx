'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Plus, CheckSquare, Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

export const ListView: React.FC = () => {
  const { workspace, activeBoardId, setActiveCard, createCard, searchQuery } = useWorkspaceStore();
  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  if (!activeBoard) return null;

  const handleAddCard = (colId: string) => {
    const title = prompt('Enter task name:');
    if (title?.trim()) {
      createCard(colId, title.trim());
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
      {activeBoard.columns.map((column) => {
        const columnCards = column.card_ids
          .map((id) => activeBoard.cards[id])
          .filter(Boolean)
          .filter((card) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
              card.title.toLowerCase().includes(query) ||
              card.properties.tags?.some((t) => t.toLowerCase().includes(query))
            );
          });

        return (
          <div key={column.id} className="space-y-2">
            {/* List Section Header */}
            <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: column.color || '#64748b' }}
                />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {column.title}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-full">
                  {columnCards.length}
                </span>
              </div>

              <button
                onClick={() => handleAddCard(column.id)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* List Rows */}
            <div className="space-y-1.5">
              {columnCards.length === 0 ? (
                <div className="text-xs text-slate-600 italic px-3 py-2">
                  No tasks in this list
                </div>
              ) : (
                columnCards.map((card) => {
                  const todos = card.blocks.filter((b) => b.type === 'todo');
                  const completedTodos = todos.filter((b) => b.checked).length;
                  const hasTodos = todos.length > 0;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveCard(card.id)}
                      className="flex items-center justify-between p-3 bg-[#0e1424] hover:bg-slate-800/60 border border-slate-800/80 rounded-xl cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                        {card.properties.cover_color && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: card.properties.cover_color }}
                          />
                        )}
                        <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 truncate">
                          {card.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                        {hasTodos && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            <CheckSquare className="w-3 h-3 text-slate-500" />
                            {completedTodos}/{todos.length}
                          </span>
                        )}

                        {card.properties.due_date && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            {format(new Date(card.properties.due_date), 'MMM d')}
                          </span>
                        )}

                        {card.properties.priority && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-semibold text-slate-300">
                            {card.properties.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

