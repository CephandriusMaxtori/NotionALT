'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Zap, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Tag, 
  Calendar 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                Butler Visual Automations
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                  No-Code
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Trigger automated workflows when cards move, properties change, or buttons are clicked.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutomationModalOpen(false)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Rules List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Active Rules ({activeBoard.automations?.length || 0})</span>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium normal-case"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Automation
                </button>
              )}
            </div>

            {activeBoard.automations?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                No automation rules configured yet. Create one below to automate card transitions!
              </div>
            ) : (
              activeBoard.automations?.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded-xl border transition ${
                    rule.enabled
                      ? 'bg-slate-900/60 border-slate-700/80 shadow-sm'
                      : 'bg-slate-900/20 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-slate-200">{rule.name}</h4>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            rule.enabled
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {rule.enabled ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rule.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                          rule.enabled
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => deleteAutomationRule(rule.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Rule Builder Form */}
          {isCreating && (
            <form
              onSubmit={handleCreateRule}
              className="p-4 bg-slate-900/80 border border-amber-500/40 rounded-2xl shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Rule Builder
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Move to Review on QA Pass"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Trigger */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                  WHEN (Trigger)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="card_moved_to_column">Card is moved to column</option>
                    <option value="checklist_all_completed">All checklist items are completed</option>
                    <option value="button_clicked">Card action button is clicked</option>
                  </select>

                  {triggerType === 'card_moved_to_column' && (
                    <select
                      value={triggerColId}
                      onChange={(e) => setTriggerColId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
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
                      placeholder="Button Name (e.g. Request QA)"
                      value={triggerButtonLabel}
                      onChange={(e) => setTriggerButtonLabel(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                  THEN (Action)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="set_completed_date">Set Completed Date to NOW()</option>
                    <option value="mark_checklist_done">Check all checklist items</option>
                    <option value="set_priority">Set Priority</option>
                    <option value="add_tag">Add Tag</option>
                    <option value="move_card">Move Card to Column</option>
                  </select>

                  {actionType === 'set_priority' && (
                    <select
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
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
                      placeholder="Tag name (e.g. Urgent)"
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  )}

                  {actionType === 'move_card' && (
                    <select
                      value={actionTargetVal}
                      onChange={(e) => setActionTargetVal(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition"
                >
                  Save Automation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

