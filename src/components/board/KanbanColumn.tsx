'use client';

import React, { useState } from 'react';
import { ColumnNode, CardNode } from '@/types';
import { KanbanCard } from './KanbanCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';

interface KanbanColumnProps {
  column: ColumnNode;
  cards: CardNode[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, cards }) => {
  const { createCard, deleteColumn, updateColumn } = useWorkspaceStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [showOptions, setShowOptions] = useState(false);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardTitle.trim()) {
      createCard(column.id, cardTitle.trim());
      setCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (titleValue.trim() && titleValue !== column.title) {
      updateColumn(column.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="w-64 shrink-0 flex flex-col max-h-[calc(100vh-6rem)] rounded-lg bg-[#1e1e1e] border border-[#2b2b2b]">
      {/* Column Header */}
      <div className="px-3 py-2 border-b border-[#282828] flex items-center justify-between relative">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: column.color || '#64748b' }}
          />

          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
              autoFocus
              className="bg-[#141414] text-xs text-[#e0e0e0] px-1 py-0.5 rounded border border-[#444444] focus:outline-none"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-xs font-medium text-[#cccccc] truncate cursor-pointer hover:text-white"
            >
              {column.title}
            </h2>
          )}

          <span className="text-[11px] text-[#666666] font-mono">
            {cards.length}
            {column.wip_limit ? `/${column.wip_limit}` : ''}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsAddingCard(true)}
            className="p-1 hover:bg-[#2a2a2a] text-[#777777] hover:text-[#cccccc] rounded transition"
            title="Add card"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-[#2a2a2a] text-[#777777] hover:text-[#cccccc] rounded transition"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Options */}
        {showOptions && (
          <div className="absolute right-2 top-8 w-40 bg-[#242424] border border-[#383838] rounded shadow-lg z-30 p-1 text-xs space-y-0.5">
            <button
              onClick={() => {
                setIsEditingTitle(true);
                setShowOptions(false);
              }}
              className="w-full text-left px-2 py-1 text-[#cccccc] hover:bg-[#2e2e2e] rounded flex items-center gap-1.5"
            >
              <Edit2 className="w-3 h-3 text-[#777777]" />
              Rename
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete column "${column.title}"?`)) {
                  deleteColumn(column.id);
                }
                setShowOptions(false);
              }}
              className="w-full text-left px-2 py-1 text-[#e07575] hover:bg-[#352525] rounded flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Droppable Card List */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-[#242424]' : ''
            }`}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(cardProvided, cardSnapshot) => (
                  <KanbanCard
                    card={card}
                    provided={cardProvided}
                    snapshot={cardSnapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Inline Composer */}
      <div className="p-1.5 border-t border-[#282828]">
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-1.5">
            <textarea
              placeholder="Card title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard(e);
                }
              }}
              rows={2}
              autoFocus
              className="w-full bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb] placeholder:text-[#666666] focus:outline-none focus:border-[#555555] resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#2383e2] hover:bg-[#1a73cb] text-white rounded text-xs font-normal"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="text-xs text-[#777777] hover:text-[#cccccc] px-2 py-0.5"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full py-1 px-2 flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#cccccc] hover:bg-[#252525] rounded transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        )}
      </div>
    </div>
  );
};
