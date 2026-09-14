'use client';

import React from 'react';
import { CardNode } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Calendar, 
  CheckSquare, 
  User, 
  FileText, 
  Sparkles, 
  Zap,
  AlignLeft
} from 'lucide-react';
import { format } from 'date-fns';

interface KanbanCardProps {
  card: CardNode;
  provided: any;
  snapshot: any;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, provided, snapshot }) => {
  const { setActiveCard } = useWorkspaceStore();

  const todos = card.blocks.filter((b) => b.type === 'todo');
  const completedTodos = todos.filter((b) => b.checked).length;
  const hasTodos = todos.length > 0;
  const progressPercent = hasTodos ? Math.round((completedTodos / todos.length) * 100) : 0;

  const priorityColors: Record<string, string> = {
    Low: 'bg-slate-700/60 text-slate-300 border-slate-600',
    Medium: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    High: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  const hasDescriptionOrBlocks = card.blocks.length > 0 && card.blocks.some(b => b.content?.trim().length > 0);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => setActiveCard(card.id)}
      style={{
        ...provided.draggableProps.style,
      }}
      className={`group relative rounded-xl border bg-[#131b2e] p-3 transition-all cursor-pointer select-none ${
        snapshot.isDragging
          ? 'shadow-2xl shadow-indigo-500/20 border-indigo-500 rotate-1 scale-[1.02] z-50'
          : 'border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5'
      }`}
    >
      {/* Cover Color Strip / Header */}
      {card.properties.cover_color && (
        <div
          className="h-2 -mx-3 -mt-3 mb-2.5 rounded-t-xl"
          style={{ backgroundColor: card.properties.cover_color }}
        />
      )}

      {/* Tags & Priority Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {card.properties.priority && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              priorityColors[card.properties.priority] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {card.properties.priority}
          </span>
        )}

        {card.properties.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-slate-100 leading-snug mb-1 group-hover:text-indigo-300 transition-colors">
        {card.title}
      </h3>

      {/* Optional short description */}
      {card.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Progress Bar for Checklist Tasks */}
      {hasTodos && (
        <div className="mb-2.5 mt-1 space-y-1">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              {completedTodos}/{todos.length} tasks
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata Badges */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          {card.properties.due_date && (
            <span className="flex items-center gap-1 text-[10px] bg-slate-800/70 px-1.5 py-0.5 rounded text-slate-300">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {format(new Date(card.properties.due_date), 'MMM d')}
            </span>
          )}

          {hasDescriptionOrBlocks && (
            <span title="Contains document content" className="hover:text-slate-200">
              <AlignLeft className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Assignees */}
        {card.properties.assignees && card.properties.assignees.length > 0 && (
          <div className="flex -space-x-1.5 overflow-hidden">
            {card.properties.assignees.map((assignee, idx) => (
              <div
                key={idx}
                title={assignee}
                className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[9px] font-bold ring-1 ring-[#131b2e]"
              >
                {assignee.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

