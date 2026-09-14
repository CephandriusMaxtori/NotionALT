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
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';

const COVER_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#64748b', // slate
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(card.id, { description: e.target.value });
  };

  const buttonAutomations = activeBoard?.automations?.filter(
    (a) => a.enabled && a.trigger.type === 'button_clicked'
  ) || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-text">
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => setActiveCard(null)} />

      {/* Slide-out Drawer Panel */}
      <div className="w-full max-w-2xl h-full bg-[#0d1322] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Cover Strip Header */}
        {card.properties.cover_color && (
          <div
            className="h-20 w-full relative shrink-0 transition-colors"
            style={{ backgroundColor: card.properties.cover_color }}
          >
            <button
              onClick={() => updateCardProperties(card.id, { cover_color: undefined })}
              className="absolute top-2 right-12 bg-black/40 hover:bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
            >
              Remove Cover
            </button>
          </div>
        )}

        {/* Drawer Header Controls */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-[#0d1322]">
          <div className="flex items-center gap-2">
            {/* Color Cover Picker */}
            <div className="relative group">
              <button
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
                title="Change cover color"
              >
                <Palette className="w-4 h-4" />
              </button>
              <div className="hidden group-hover:flex absolute left-0 top-8 bg-slate-900 border border-slate-700 rounded-xl p-2 gap-1.5 shadow-xl z-20">
                {COVER_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateCardProperties(card.id, { cover_color: c })}
                    className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Created timestamp */}
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {card.created_at ? format(new Date(card.created_at), 'MMM d, yyyy') : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm(`Delete card "${card.title}"?`)) {
                  deleteCard(card.id);
                }
              }}
              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition"
              title="Delete card"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveCard(null)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card Title */}
          <div>
            <input
              type="text"
              value={card.title}
              onChange={handleTitleChange}
              placeholder="Card Title..."
              className="w-full text-xl font-bold bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none focus:bg-slate-800/30 px-2 py-1 rounded-lg border border-transparent hover:border-slate-800 transition"
            />
          </div>

          {/* Butler Automation Action Buttons */}
          {buttonAutomations.length > 0 && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Butler Quick Actions
              </div>
              <div className="flex flex-wrap gap-2">
                {buttonAutomations.map((auto) => (
                  <button
                    key={auto.id}
                    onClick={() => triggerCardButtonAction(card.id, auto.trigger.buttonLabel || '')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-medium transition shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {auto.trigger.buttonLabel || auto.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Relational Properties Panel */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Properties
            </h3>
            <PropertyEditor card={card} />
          </div>

          {/* Short Card Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Summary
            </h3>
            <textarea
              value={card.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Add a concise overview or brief..."
              rows={2}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <hr className="border-slate-800" />

          {/* Notion Rich Block Document Engine */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Document & Nested Blocks
            </h3>
            <BlockEditor cardId={card.id} blocks={card.blocks} />
          </div>
        </div>
      </div>
    </div>
  );
};

