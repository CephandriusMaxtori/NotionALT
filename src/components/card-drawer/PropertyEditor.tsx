'use client';

import React from 'react';
import { CardNode } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  CheckCircle2, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  Plus
} from 'lucide-react';

interface PropertyEditorProps {
  card: CardNode;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ card }) => {
  const { updateCardProperties, workspace, activeBoardId } = useWorkspaceStore();
  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  const priorities: CardNode['properties']['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

  const handlePriorityChange = (priority: CardNode['properties']['priority']) => {
    updateCardProperties(card.id, { priority });
  };

  const handleStatusChange = (status: string) => {
    updateCardProperties(card.id, { status });
  };

  const handleAddTag = () => {
    const newTag = prompt('Add tag:');
    if (newTag?.trim()) {
      const currentTags = card.properties.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        updateCardProperties(card.id, { tags: [...currentTags, newTag.trim()] });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (card.properties.tags || []).filter((t) => t !== tagToRemove);
    updateCardProperties(card.id, { tags: updatedTags });
  };

  const handleAddAssignee = () => {
    const name = prompt('Assign to:');
    if (name?.trim()) {
      const current = card.properties.assignees || [];
      if (!current.includes(name.trim())) {
        updateCardProperties(card.id, { assignees: [...current, name.trim()] });
      }
    }
  };

  const handleRemoveAssignee = (nameToRemove: string) => {
    const updated = (card.properties.assignees || []).filter((a) => a !== nameToRemove);
    updateCardProperties(card.id, { assignees: updated });
  };

  return (
    <div className="space-y-1 text-[13px]">
      {/* Status */}
      <div className="flex items-center min-h-[30px] py-0.5">
        <span className="w-28 text-[#777777] flex items-center gap-1.5 shrink-0 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Status
        </span>
        <select
          value={card.properties.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-transparent hover:bg-[#282828] rounded px-1.5 py-1 text-[#ebebeb] focus:outline-none focus:bg-[#282828] text-xs cursor-pointer"
        >
          {activeBoard?.columns.map((col) => (
            <option key={col.id} value={col.title} className="bg-[#242424]">
              {col.title}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div className="flex items-center min-h-[30px] py-0.5">
        <span className="w-28 text-[#777777] flex items-center gap-1.5 shrink-0 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          Priority
        </span>
        <select
          value={card.properties.priority || 'Medium'}
          onChange={(e) => handlePriorityChange(e.target.value as any)}
          className="bg-transparent hover:bg-[#282828] rounded px-1.5 py-1 text-[#ebebeb] focus:outline-none focus:bg-[#282828] text-xs cursor-pointer"
        >
          {priorities.map((p) => (
            <option key={p} value={p} className="bg-[#242424]">
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div className="flex items-center min-h-[30px] py-0.5">
        <span className="w-28 text-[#777777] flex items-center gap-1.5 shrink-0 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          Date
        </span>
        <input
          type="date"
          value={card.properties.due_date ? card.properties.due_date.slice(0, 10) : ''}
          onChange={(e) => updateCardProperties(card.id, { due_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="bg-transparent hover:bg-[#282828] rounded px-1.5 py-1 text-[#ebebeb] focus:outline-none focus:bg-[#282828] text-xs"
        />
      </div>

      {/* Assignees */}
      <div className="flex items-center min-h-[30px] py-0.5">
        <span className="w-28 text-[#777777] flex items-center gap-1.5 shrink-0 text-xs">
          <User className="w-3.5 h-3.5" />
          Assignee
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {card.properties.assignees?.map((a, i) => (
            <span
              key={i}
              onClick={() => handleRemoveAssignee(a)}
              title="Click to remove"
              className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#cccccc] text-xs cursor-pointer hover:bg-[#382828] hover:text-[#e07575] transition"
            >
              {a} ×
            </span>
          ))}
          <button
            onClick={handleAddAssignee}
            className="p-1 rounded hover:bg-[#282828] text-[#777777] hover:text-[#cccccc]"
            title="Add assignee"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center min-h-[30px] py-0.5">
        <span className="w-28 text-[#777777] flex items-center gap-1.5 shrink-0 text-xs">
          <Tag className="w-3.5 h-3.5" />
          Tags
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {card.properties.tags?.map((tag, i) => (
            <span
              key={i}
              onClick={() => handleRemoveTag(tag)}
              title="Click to remove"
              className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#999999] text-xs cursor-pointer hover:bg-[#382828] hover:text-[#e07575] transition"
            >
              {tag} ×
            </span>
          ))}
          <button
            onClick={handleAddTag}
            className="px-1.5 py-0.5 rounded hover:bg-[#282828] text-[#777777] hover:text-[#cccccc] text-xs transition"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};
