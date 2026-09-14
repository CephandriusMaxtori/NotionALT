'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ContentBlock, BlockType } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  CheckSquare, 
  Code2, 
  List, 
  ListOrdered, 
  ChevronRight, 
  Info, 
  Minus, 
  Quote, 
  Plus, 
  Trash2, 
  GripVertical 
} from 'lucide-react';

interface BlockItemProps {
  cardId: string;
  block: ContentBlock;
  index: number;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onOpenSlashMenu: (index: number, rect: DOMRect) => void;
}

const BlockItem: React.FC<BlockItemProps> = ({ cardId, block, index, onKeyDown, onOpenSlashMenu }) => {
  const { updateBlock, deleteBlock } = useWorkspaceStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    updateBlock(cardId, block.id, { content: val });

    if (val.endsWith('/')) {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        onOpenSlashMenu(index, rect);
      }
    }
  };

  const handleToggle = () => {
    updateBlock(cardId, block.id, { isOpen: !block.isOpen });
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateBlock(cardId, block.id, { checked });
  };

  return (
    <div className="group relative flex items-start gap-2 -ml-6 pl-6 py-1 hover:bg-slate-800/30 rounded-lg transition">
      {/* Drag handle / Delete action */}
      <div className="opacity-0 group-hover:opacity-100 absolute left-0 top-1.5 flex items-center gap-0.5 text-slate-500">
        <button
          onClick={() => deleteBlock(cardId, block.id)}
          className="hover:text-rose-400 p-0.5"
          title="Delete block"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Render Block by Type */}
      <div className="flex-1 flex items-start gap-2">
        {block.type === 'todo' && (
          <input
            type="checkbox"
            checked={!!block.checked}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
          />
        )}

        {block.type === 'bullet_list' && (
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        )}

        {block.type === 'numbered_list' && (
          <span className="mt-0.5 font-mono text-xs text-slate-400 shrink-0 select-none">
            {index + 1}.
          </span>
        )}

        {block.type === 'toggle' && (
          <button
            onClick={handleToggle}
            className="mt-0.5 p-0.5 text-slate-400 hover:text-slate-200 transition"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${block.isOpen ? 'rotate-90' : ''}`}
            />
          </button>
        )}

        {block.type === 'callout' && (
          <div className="mt-0.5 text-indigo-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
        )}

        {block.type === 'quote' && (
          <div className="mt-0.5 text-slate-400 shrink-0">
            <Quote className="w-4 h-4" />
          </div>
        )}

        {block.type === 'divider' ? (
          <div className="w-full py-2">
            <hr className="border-slate-700/80" />
          </div>
        ) : block.type === 'code' ? (
          <div className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl p-3 font-mono text-xs text-indigo-300">
            <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-800/80 uppercase">
              <span>{block.language || 'typescript'}</span>
            </div>
            <textarea
              ref={inputRef}
              value={block.content}
              onChange={handleChange}
              onKeyDown={(e) => onKeyDown(e, index)}
              placeholder="// Write code here..."
              rows={2}
              className="w-full bg-transparent resize-none focus:outline-none text-xs font-mono text-indigo-200 placeholder:text-slate-600"
            />
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={(e) => onKeyDown(e, index)}
            placeholder={
              block.type.startsWith('heading')
                ? 'Heading...'
                : block.type === 'todo'
                ? 'To-do item...'
                : "Type '/' for commands..."
            }
            rows={1}
            className={`w-full bg-transparent resize-none focus:outline-none placeholder:text-slate-600 leading-relaxed ${
              block.type === 'heading_1'
                ? 'text-lg font-bold text-slate-100'
                : block.type === 'heading_2'
                ? 'text-base font-semibold text-slate-100'
                : block.type === 'heading_3'
                ? 'text-sm font-semibold text-slate-200'
                : block.type === 'todo' && block.checked
                ? 'text-xs text-slate-500 line-through'
                : block.type === 'callout'
                ? 'text-xs text-slate-200 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/20'
                : block.type === 'quote'
                ? 'text-xs italic text-slate-300 pl-2 border-l-2 border-slate-600'
                : 'text-xs text-slate-200'
            }`}
          />
        )}
      </div>
    </div>
  );
};

export const BlockEditor: React.FC<{ cardId: string; blocks: ContentBlock[] }> = ({ cardId, blocks }) => {
  const { addBlock, updateBlock } = useWorkspaceStore();
  const [slashMenu, setSlashMenu] = useState<{ isOpen: boolean; index: number; x: number; y: number } | null>(null);

  const slashMenuItems: { type: BlockType; label: string; icon: any; description: string }[] = [
    { type: 'paragraph', label: 'Text', icon: Type, description: 'Plain rich text block' },
    { type: 'heading_1', label: 'Heading 1', icon: Heading1, description: 'Large section heading' },
    { type: 'heading_2', label: 'Heading 2', icon: Heading2, description: 'Medium subsection heading' },
    { type: 'heading_3', label: 'Heading 3', icon: Heading3, description: 'Small heading' },
    { type: 'todo', label: 'To-do List', icon: CheckSquare, description: 'Interactive checklist task' },
    { type: 'code', label: 'Code Snippet', icon: Code2, description: 'Code block with syntax' },
    { type: 'bullet_list', label: 'Bulleted List', icon: List, description: 'Simple bulleted list' },
    { type: 'numbered_list', label: 'Numbered List', icon: ListOrdered, description: 'Ordered list with numbers' },
    { type: 'toggle', label: 'Toggle List', icon: ChevronRight, description: 'Collapsible content block' },
    { type: 'callout', label: 'Callout Box', icon: Info, description: 'Highlighted tip or warning' },
    { type: 'divider', label: 'Divider', icon: Minus, description: 'Visual horizontal line' },
    { type: 'quote', label: 'Quote', icon: Quote, description: 'Capture a quote or note' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Add a new paragraph block below
      addBlock(cardId, 'paragraph', '', index);
    }
  };

  const handleOpenSlashMenu = (index: number, rect: DOMRect) => {
    setSlashMenu({
      isOpen: true,
      index,
      x: rect.left,
      y: rect.bottom + window.scrollY + 5
    });
  };

  const handleSelectBlockType = (type: BlockType) => {
    if (!slashMenu) return;
    const currentBlock = blocks[slashMenu.index];
    if (currentBlock) {
      // Remove trailing slash if present
      const cleanContent = currentBlock.content.endsWith('/')
        ? currentBlock.content.slice(0, -1)
        : currentBlock.content;
      updateBlock(cardId, currentBlock.id, { type, content: cleanContent });
    }
    setSlashMenu(null);
  };

  return (
    <div className="space-y-1 relative" onClick={() => slashMenu && setSlashMenu(null)}>
      {blocks.map((block, index) => (
        <BlockItem
          key={block.id}
          cardId={cardId}
          block={block}
          index={index}
          onKeyDown={handleKeyDown}
          onOpenSlashMenu={handleOpenSlashMenu}
        />
      ))}

      {/* Quick Add Button at bottom */}
      <button
        onClick={() => addBlock(cardId, 'paragraph')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 py-1.5 px-2 rounded-lg hover:bg-slate-800/40 transition"
      >
        <Plus className="w-3.5 h-3.5" />
        Click to add block, or type &apos;/&apos; for commands
      </button>

      {/* Slash Command Dropdown Menu */}
      {slashMenu?.isOpen && (
        <div
          className="fixed w-64 max-h-72 overflow-y-auto bg-[#0d1322] border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: Math.min(slashMenu.y, window.innerHeight - 300), left: Math.min(slashMenu.x, window.innerWidth - 280) }}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Basic Blocks
          </div>
          {slashMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => handleSelectBlockType(item.type)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition"
              >
                <div className="p-1 rounded bg-slate-800 text-slate-300">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

