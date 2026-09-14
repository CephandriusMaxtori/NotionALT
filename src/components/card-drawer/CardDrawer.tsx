'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { PropertyEditor } from './PropertyEditor';
import { BlockEditor } from './BlockEditor';
import { 
  X, 
  Trash2, 
  Palette, 
  Zap, 
  Clock 
} from 'lucide-react';
import { format } from 'date-fns';

const COVER_COLORS = [
  '#4a5568',
  '#3182ce',
  '#805ad5',
  '#d53f8c',
  '#e53e3e',
  '#dd6b20',
  '#38a169',
  '#319795',
];

export const CardDrawer: React.FC = () => {
  const { 
    workspace, 
    activeBoardId, 
    activeCardId, 
    setActiveCard, 
    updateCard, 
    updateCardProperties,
    deleteCard,
    triggerCardButtonAction
  } = useWorkspaceStore();

  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);
  const card = activeCardId && activeBoard ? activeBoard.cards[activeCardId] : null;

  if (!card) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCard(card.id, { title: e.target.value });
  };

  const buttonAutomations = activeBoard?.automations?.filter(
    (a) => a.enabled && a.trigger.type === 'button_clicked'
  ) || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-in fade-in duration-100 select-text">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={() => setActiveCard(null)} />

      {/* Drawer */}
      <div className="w-full max-w-2xl h-full bg-[#1e1e1e] border-l border-[#2e2e2e] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-150">
        {/* Cover Strip */}
        {card.properties.cover_color && (
          <div
            className="h-16 w-full relative shrink-0"
            style={{ backgroundColor: card.properties.cover_color }}
          >
            <button
              onClick={() => updateCardProperties(card.id, { cover_color: undefined })}
              className="absolute top-2 right-10 bg-black/50 hover:bg-black/70 text-white text-[11px] px-2 py-0.5 rounded"
            >
              Remove
            </button>
          </div>
        )}

        {/* Top Controls */}
        <div className="px-5 py-2.5 border-b border-[#282828] flex items-center justify-between shrink-0 text-xs text-[#777777]">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button
                className="p-1 hover:bg-[#282828] rounded text-[#777777] hover:text-[#cccccc] transition"
                title="Change color"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
              <div className="hidden group-hover:flex absolute left-0 top-6 bg-[#252525] border border-[#383838] rounded p-1.5 gap-1 shadow-lg z-20">
                {COVER_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateCardProperties(card.id, { cover_color: c })}
                    className="w-4 h-4 rounded-full border border-white/10 hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <span className="text-[11px] text-[#666666] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {card.created_at ? format(new Date(card.created_at), 'MMM d, yyyy') : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (confirm(`Delete "${card.title}"?`)) {
                  deleteCard(card.id);
                }
              }}
              className="p-1 hover:bg-[#352525] text-[#777777] hover:text-[#e07575] rounded transition"
              title="Delete card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveCard(null)}
              className="p-1 hover:bg-[#282828] text-[#777777] hover:text-[#cccccc] rounded transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Card Title */}
          <div>
            <input
              type="text"
              value={card.title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="w-full text-2xl font-bold bg-transparent text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:bg-[#252525]/40 px-1 py-0.5 rounded transition"
            />
          </div>

          {/* Automations buttons if any */}
          {buttonAutomations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-2">
              {buttonAutomations.map((auto) => (
                <button
                  key={auto.id}
                  onClick={() => triggerCardButtonAction(card.id, auto.trigger.buttonLabel || '')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252525] hover:bg-[#2e2e2e] text-[#cccccc] border border-[#353535] rounded text-xs transition"
                >
                  <Zap className="w-3 h-3 text-[#999999]" />
                  <span>{auto.trigger.buttonLabel || auto.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Properties Table */}
          <PropertyEditor card={card} />

          {/* Document Divider */}
          <hr className="border-[#2b2b2b]" />

          {/* Block Editor */}
          <div>
            <BlockEditor cardId={card.id} blocks={card.blocks} />
          </div>
        </div>
      </div>
    </div>
  );
};
