'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Zap, 
  X, 
  Plus, 
  Trash2
} from 'lucide-react';
import { AutomationAction, AutomationTrigger } from '@/types';

export const AutomationModal: React.FC = () => {
  const { 
    workspace, 
    activeBoardId, 
    isAutomationModalOpen, 
    setAutomationModalOpen,
    addAutomationRule,
    toggleAutomationRule,
    deleteAutomationRule
  } = useWorkspaceStore();

  const [isCreating, setIsCreating] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerType, setTriggerType] = useState<AutomationTrigger['type']>('card_moved_to_column');
  const [triggerColId, setTriggerColId] = useState('');
  const [triggerButtonLabel, setTriggerButtonLabel] = useState('');
  const [actionType, setActionType] = useState<AutomationAction['type']>('set_completed_date');
  const [actionTargetVal, setActionTargetVal] = useState('');

  const activeBoard = workspace.boards.find((b) => b.id === activeBoardId);

  if (!isAutomationModalOpen || !activeBoard) return null;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    let trigger: AutomationTrigger = { type: triggerType };
    if (triggerType === 'card_moved_to_column') {
      trigger.columnId = triggerColId || activeBoard.columns[0]?.id;
    } else if (triggerType === 'button_clicked') {
      trigger.buttonLabel = triggerButtonLabel || 'Run Action';
    }

    const actions: AutomationAction[] = [
      {
        id: `act-${Date.now()}`,
        type: actionType,
        targetValue: actionTargetVal
      }
    ];

    addAutomationRule({
      name: ruleName.trim(),
      description: `WHEN ${triggerType} -> THEN ${actionType}`,
      enabled: true,
      trigger,
      actions
    });

    setIsCreating(false);
    setRuleName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 select-text">
      <div className="w-full max-w-xl bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#999999]" />
            <h2 className="text-sm font-medium text-[#ebebeb]">Automations</h2>
          </div>
          <button
            onClick={() => setAutomationModalOpen(false)}
            className="p-1 hover:bg-[#282828] text-[#777777] hover:text-[#cccccc] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rules */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#777777]">
            <span>Rules ({activeBoard.automations?.length || 0})</span>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1 text-xs text-[#2383e2] hover:text-[#1a73cb]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add rule
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {activeBoard.automations?.map((rule) => (
              <div
                key={rule.id}
                className={`p-2.5 rounded border text-xs flex items-center justify-between ${
                  rule.enabled
                    ? 'bg-[#242424] border-[#303030]'
                    : 'bg-[#1c1c1c] border-[#262626] opacity-50'
                }`}
              >
                <div>
                  <div className="font-medium text-[#ebebeb]">{rule.name}</div>
                  <div className="text-[11px] text-[#777777]">{rule.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutomationRule(rule.id)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#2c2c2c] hover:bg-[#353535] text-[#cccccc]"
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => deleteAutomationRule(rule.id)}
                    className="p-1 text-[#666666] hover:text-[#e07575]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Builder */}
          {isCreating && (
            <form
              onSubmit={handleCreateRule}
              className="p-3 bg-[#242424] border border-[#383838] rounded-lg space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#888888] mb-1 text-[11px]">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Move to review on pass"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#353535] rounded px-2.5 py-1 text-xs text-[#ebebeb] focus:outline-none focus:border-[#555555]"
                  required
                />
              </div>

              {/* Trigger */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-[#777777]">Trigger</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as any)}
                    className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                  >
                    <option value="card_moved_to_column">Card moved to column</option>
                    <option value="checklist_all_completed">Checklist completed</option>
                    <option value="button_clicked">Button clicked</option>
                  </select>

                  {triggerType === 'card_moved_to_column' && (
                    <select
                      value={triggerColId}
                      onChange={(e) => setTriggerColId(e.target.value)}
                      className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                    >
                      {activeBoard.columns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  )}

                  {triggerType === 'button_clicked' && (
                    <input
                      type="text"
                      placeholder="Button label"
                      value={triggerButtonLabel}
                      onChange={(e) => setTriggerButtonLabel(e.target.value)}
                      className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                    />
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-[#777777]">Action</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                  >
                    <option value="set_completed_date">Set completion date to NOW</option>
                    <option value="mark_checklist_done">Check all checklist items</option>
                    <option value="set_priority">Set priority</option>
                    <option value="add_tag">Add tag</option>
                    <option value="move_card">Move card to column</option>
                  </select>

                  {actionType === 'set_priority' && (
                    <select
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  )}

                  {actionType === 'add_tag' && (
                    <input
                      type="text"
                      placeholder="Tag name"
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                    />
                  )}

                  {actionType === 'move_card' && (
                    <select
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-[#181818] border border-[#353535] rounded p-1.5 text-xs text-[#ebebeb]"
                    >
                      {activeBoard.columns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1 text-xs text-[#777777] hover:text-[#cccccc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#2383e2] hover:bg-[#1a73cb] text-white text-xs rounded font-normal"
                >
                  Save rule
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
