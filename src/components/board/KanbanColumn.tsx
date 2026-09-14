'use client';

import React, { useState } from 'react';
import { ColumnNode, CardNode } from '@/types';
import { KanbanCard } from './KanbanCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Plus, MoreHorizontal, Trash2, Edit2, AlertCircle } from 'lucide-react';

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

  const isOverWip = column.wip_limit && cards.length > column.wip_limit;

  return (
    <div className="w-72 shrink-0 flex flex-col max-h-[calc(100vh-8.5rem)] rounded-2xl bg-[#0e1424] border border-slate-800/80 shadow-sm">
      {/* Column Header */}
      <div className="p-3 border-b border-slate-800/60 flex items-center justify-between relative">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
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
              className="bg-slate-900 text-xs font-semibold text-slate-100 px-1.5 py-0.5 rounded border border-indigo-500 focus:outline-none"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-slate-200 truncate cursor-pointer hover:text-indigo-300 transition-colors"
            >
              {column.title}
            </h2>
          )}

          {/* Card Count & WIP Limit Badge */}
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
              isOverWip
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {cards.length}
            {column.wip_limit ? ` / ${column.wip_limit}` : ''}
          </span>

          {isOverWip && (
            <span title="Column exceeded WIP limit" className="text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAddingCard(true)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Add card"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown Options */}
        {showOptions && (
          <div className="absolute right-2 top-10 w-44 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-30 p-1.5 text-xs space-y-1">
            <button
              onClick={() => {
                setIsEditingTitle(true);
                setShowOptions(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              Rename Column
            </button>
            <button
              onClick={() => {
                const limit = prompt('Set WIP Limit (number or leave blank to remove):', column.wip_limit?.toString() || '');
                if (limit !== null) {
                  updateColumn(column.id, { wip_limit: limit ? parseInt(limit, 10) : undefined });
                }
                setShowOptions(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2"
            >
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              Set WIP Limit
            </button>
            <div className="border-t border-slate-800 my-1" />
            <button
              onClick={() => {
                if (confirm(`Delete column "${column.title}" and all its cards?`)) {
                  deleteColumn(column.id);
                }
                setShowOptions(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Column
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
            className={`flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[120px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-950/20' : ''
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
      <div className="p-2 border-t border-slate-800/60 bg-[#0e1424]">
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <textarea
              placeholder="What needs to be done?"
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
              className="w-full bg-[#131b2e] border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};

