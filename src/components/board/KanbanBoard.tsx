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
      <div className="flex-1 flex items-center justify-center text-[#666666] text-xs">
        No active board
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
      const colors = ['#64748b', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
      const randomColor = colors[activeBoard.columns.length % colors.length];
      addColumn(newColTitle.trim(), randomColor);
      setNewColTitle('');
      setIsAddingCol(false);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start gap-3 h-full">
          {activeBoard.columns.map((column) => {
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

          {/* Add Column */}
          <div className="w-64 shrink-0">
            {isAddingCol ? (
              <form
                onSubmit={handleCreateColumn}
                className="p-2 bg-[#1e1e1e] border border-[#333333] rounded-lg space-y-2"
              >
                <input
                  type="text"
                  placeholder="Column name..."
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  autoFocus
                  className="w-full bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb] placeholder:text-[#666666] focus:outline-none focus:border-[#555555]"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#2383e2] hover:bg-[#1a73cb] text-white rounded text-xs font-normal"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCol(false)}
                    className="text-xs text-[#777777] hover:text-[#cccccc] px-2 py-0.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingCol(true)}
                className="w-full py-2 px-3 border border-[#2d2d2d] hover:border-[#383838] bg-[#1a1a1a] hover:bg-[#202020] rounded-lg flex items-center gap-2 text-xs font-normal text-[#888888] hover:text-[#cccccc] transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#777777]" />
                <span>Add a list</span>
              </button>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
