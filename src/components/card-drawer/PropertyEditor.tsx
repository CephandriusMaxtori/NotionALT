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
  Link2,
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
    const newTag = prompt('Enter new tag:');
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
    const name = prompt('Assign team member (e.g. Alex Chen, Sarah Lin):');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80 text-xs">
      {/* Status Property */}
      <div className="flex items-center gap-3">
        <span className="w-24 text-slate-400 flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          Status
        </span>
        <select
          value={card.properties.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 truncate"
        >
          {activeBoard?.columns.map((col) => (
            <option key={col.id} value={col.title}>
              {col.title}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Property */}
      <div className="flex items-center gap-3">
        <span className="w-24 text-slate-400 flex items-center gap-1.5 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          Priority
        </span>
        <select
          value={card.properties.priority || 'Medium'}
          onChange={(e) => handlePriorityChange(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 truncate"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date Property */}
      <div className="flex items-center gap-3">
        <span className="w-24 text-slate-400 flex items-center gap-1.5 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          Due Date
        </span>
        <input
          type="date"
          value={card.properties.due_date ? card.properties.due_date.slice(0, 10) : ''}
          onChange={(e) => updateCardProperties(card.id, { due_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
        />
      </div>

      {/* Assignees */}
      <div className="flex items-center gap-3">
        <span className="w-24 text-slate-400 flex items-center gap-1.5 shrink-0">
          <User className="w-3.5 h-3.5 text-slate-500" />
          Assignees
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {card.properties.assignees?.map((a, i) => (
            <span
              key={i}
              onClick={() => handleRemoveAssignee(a)}
              title="Click to remove"
              className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 text-[11px] cursor-pointer hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500 transition"
            >
              {a} ×
            </span>
          ))}
          <button
            onClick={handleAddAssignee}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            title="Add assignee"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="sm:col-span-2 flex items-center gap-3 pt-1 border-t border-slate-800/60">
        <span className="w-24 text-slate-400 flex items-center gap-1.5 shrink-0">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          Tags
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {card.properties.tags?.map((tag, i) => (
            <span
              key={i}
              onClick={() => handleRemoveTag(tag)}
              title="Click to remove"
              className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500 transition"
            >
              {tag} ×
            </span>
          ))}
          <button
            onClick={handleAddTag}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] transition"
          >
            <Plus className="w-3 h-3" />
            Add Tag
          </button>
        </div>
      </div>
    </div>
  );
};

