'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { Plus } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { workspace, activeBoardId, moveCard, addColumn, searchQuery } = useWorkspaceStore();
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  if (!activeBoard) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Select or create a board to get started
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'CARD') {
      moveCard(
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColTitle.trim()) {
      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
      const randomColor = colors[activeBoard.columns.length % colors.length];
      addColumn(newColTitle.trim(), randomColor);
      setNewColTitle('');
      setIsAddingCol(false);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start gap-4 h-full">
          {activeBoard.columns.map((column) => {
            // Filter cards if search query is active
            const columnCards = column.card_ids
              .map((id) => activeBoard.cards[id])
              .filter(Boolean)
              .filter((card) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                const matchTitle = card.title.toLowerCase().includes(query);
                const matchDesc = card.description?.toLowerCase().includes(query);
                const matchTags = card.properties.tags?.some((t) => t.toLowerCase().includes(query));
                const matchAssignee = card.properties.assignees?.some((a) => a.toLowerCase().includes(query));
                const matchBlocks = card.blocks.some((b) => b.content.toLowerCase().includes(query));
                return matchTitle || matchDesc || matchTags || matchAssignee || matchBlocks;
              });

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
              />
            );
          })}

          {/* Add New Column Container */}
          <div className="w-72 shrink-0">
            {isAddingCol ? (
              <form
                onSubmit={handleCreateColumn}
                className="p-3 bg-[#0e1424] border border-slate-700/80 rounded-2xl shadow-lg space-y-2.5"
              >
                <input
                  type="text"
                  placeholder="Enter column name..."
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  autoFocus
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
                  >
                    Add Column
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCol(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingCol(true)}
                className="w-full py-3 px-4 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                <Plus className="w-4 h-4 text-slate-400" />
                Add another list
              </button>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

