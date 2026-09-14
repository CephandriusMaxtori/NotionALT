'use client';

import React from 'react';
import { CardNode } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Calendar, 
  CheckSquare, 
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

  const priorityStyles: Record<string, string> = {
    Low: 'bg-[#2a2a2a] text-[#888888] border-[#383838]',
    Medium: 'bg-[#2a3038] text-[#85b0d6] border-[#364352]',
    High: 'bg-[#3b3225] text-[#d6a96b] border-[#52442e]',
    Critical: 'bg-[#3b2525] text-[#e07575] border-[#573030]',
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
      className={`group relative rounded-md border bg-[#232323] p-2.5 transition cursor-pointer select-none ${
        snapshot.isDragging
          ? 'shadow-lg border-[#555555] rotate-0.5 z-50'
          : 'border-[#303030] hover:border-[#404040] hover:bg-[#282828]'
      }`}
    >
      {/* Cover Color Strip */}
      {card.properties.cover_color && (
        <div
          className="h-1 -mx-2.5 -mt-2.5 mb-2 rounded-t-md"
          style={{ backgroundColor: card.properties.cover_color }}
        />
      )}

      {/* Tags & Priority Chips */}
      <div className="flex flex-wrap items-center gap-1 mb-1.5">
        {card.properties.priority && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded border font-normal ${
              priorityStyles[card.properties.priority] || 'bg-[#2a2a2a] text-[#888888] border-[#383838]'
            }`}
          >
            {card.properties.priority}
          </span>
        )}

        {card.properties.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2a2a] text-[#999999] border border-[#353535]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-normal text-[#ebebeb] leading-snug mb-1">
        {card.title}
      </h3>

      {/* Summary */}
      {card.description && (
        <p className="text-[11px] text-[#888888] line-clamp-2 mb-1.5 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Checklist Progress Bar */}
      {hasTodos && (
        <div className="mb-2 mt-1 space-y-1">
          <div className="flex justify-between items-center text-[10px] text-[#777777] font-mono">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-[#666666]" />
              {completedTodos}/{todos.length}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-[#2e2e2e] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                progressPercent === 100 ? 'bg-[#3fb950]' : 'bg-[#2383e2]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Metadata */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-[#777777]">
        <div className="flex items-center gap-2">
          {card.properties.due_date && (
            <span className="flex items-center gap-1 text-[10px] text-[#888888]">
              <Calendar className="w-3 h-3 text-[#777777]" />
              {format(new Date(card.properties.due_date), 'MMM d')}
            </span>
          )}

          {hasDescriptionOrBlocks && (
            <span className="text-[#666666]">
              <AlignLeft className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Assignees initials */}
        {card.properties.assignees && card.properties.assignees.length > 0 && (
          <div className="flex -space-x-1 overflow-hidden">
            {card.properties.assignees.map((assignee, idx) => (
              <div
                key={idx}
                title={assignee}
                className="w-4 h-4 rounded-full bg-[#3a3a3a] text-[#cccccc] flex items-center justify-center text-[9px] font-medium border border-[#232323]"
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
