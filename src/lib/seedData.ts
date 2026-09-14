import { WorkspaceNode, BoardNode } from '@/types';

export const INITIAL_WORKSPACE: WorkspaceNode = {
  id: 'workspace-1',
  title: 'Engineering & Product Workspace',
  active_board_id: 'board-sprint',
  boards: [
    {
      id: 'board-sprint',
      title: 'Sprint 28 - Core Architecture',
      description: 'Q4 Core Platform & Hybrid Notion-Trello Canvas Build',
      icon: '⚡',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: [
        {
          id: 'col-backlog',
          title: 'Backlog',
          color: '#64748b',
          card_ids: ['card-1', 'card-2']
        },
        {
          id: 'col-in-progress',
          title: 'In Progress',
          color: '#3b82f6',
          wip_limit: 4,
          card_ids: ['card-3', 'card-4']
        },
        {
          id: 'col-review',
          title: 'Code Review',
          color: '#8b5cf6',
          wip_limit: 3,
          card_ids: ['card-5']
        },
        {
          id: 'col-done',
          title: 'Done',
          color: '#10b981',
          card_ids: ['card-6']
        }
      ],
      cards: {
        'card-1': {
          id: 'card-1',
          column_id: 'col-backlog',
          title: 'Offline-First Local Graph Sync Engine',
          description: 'Design the cache eviction and delta merge strategy for local-first database operations.',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Backlog',
            priority: 'High',
            assignees: ['Alex Chen'],
            due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
            tags: ['Architecture', 'Core'],
            cover_color: '#3b82f6'
          },
          blocks: [
            {
              id: 'b1',
              type: 'heading_2',
              content: 'Technical Requirements'
            },
            {
              id: 'b2',
              type: 'paragraph',
              content: 'We need bidirectional conflict-free sync for graph nodes across clients.'
            },
            {
              id: 'b3',
              type: 'todo',
              content: 'Define Vector Clock timestamp schema',
              checked: true
            },
            {
              id: 'b4',
              type: 'todo',
              content: 'Implement IndexedDB storage adapter',
              checked: false
            },
            {
              id: 'b5',
              type: 'code',
              content: 'interface SyncPayload {\n  nodeId: string;\n  version: number;\n  delta: Record<string, unknown>;\n}',
              language: 'typescript'
            }
          ]
        },
        'card-2': {
          id: 'card-2',
          column_id: 'col-backlog',
          title: 'Multi-Property Relational Rollups',
          description: 'Compute progress percentage and linked entity counts in real time.',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Backlog',
            priority: 'Medium',
            assignees: ['Sarah Lin'],
            tags: ['Database', 'Properties'],
            cover_color: '#8b5cf6'
          },
          blocks: [
            {
              id: 'b2-1',
              type: 'heading_2',
              content: 'Formula Engine Specification'
            },
            {
              id: 'b2-2',
              type: 'callout',
              content: 'Formula fields should be reactive and calculated whenever dependent properties or child checklists change.',
              calloutType: 'tip'
            },
            {
              id: 'b2-3',
              type: 'todo',
              content: 'Checklist completion percentage rollups',
              checked: false
            },
            {
              id: 'b2-4',
              type: 'todo',
              content: 'Sub-task status rollups to parent cards',
              checked: false
            }
          ]
        },
        'card-3': {
          id: 'card-3',
          column_id: 'col-in-progress',
          title: 'Fluid Drag-and-Drop Canvas & Micro-interactions',
          description: 'Smooth tactile dragging for cards and columns with live column WIP limit indicators.',
          created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'In Progress',
            priority: 'Critical',
            assignees: ['Alex Chen', 'Elena Rostova'],
            due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
            tags: ['UX/UI', 'Canvas'],
            cover_color: '#f59e0b'
          },
          blocks: [
            {
              id: 'b3-1',
              type: 'heading_2',
              content: 'Canvas Fluidity Goals'
            },
            {
              id: 'b3-2',
              type: 'paragraph',
              content: 'Hardware-accelerated animations for card pick-up, drop targets, and column reordering.'
            },
            {
              id: 'b3-3',
              type: 'todo',
              content: 'Implement @hello-pangea/dnd board layout',
              checked: true
            },
            {
              id: 'b3-4',
              type: 'todo',
              content: 'Add spring animations for card dropping',
              checked: true
            },
            {
              id: 'b3-5',
              type: 'todo',
              content: 'Add column WIP warning highlights',
              checked: false
            }
          ]
        },
        'card-4': {
          id: 'card-4',
          column_id: 'col-in-progress',
          title: 'Butler Event-Driven Automation Engine',
          description: 'Create visual trigger rules: WHEN moved to Done -> Set Completed At to NOW() & archive tasks.',
          created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'In Progress',
            priority: 'High',
            assignees: ['Sarah Lin'],
            tags: ['Butler', 'Automation'],
            cover_color: '#ec4899'
          },
          blocks: [
            {
              id: 'b4-1',
              type: 'callout',
              content: 'Butler engine allows users to build no-code rules using plain English triggers and automated multi-action pipelines.',
              calloutType: 'info'
            },
            {
              id: 'b4-2',
              type: 'todo',
              content: 'Trigger dispatcher for column moves',
              checked: true
            },
            {
              id: 'b4-3',
              type: 'todo',
              content: 'Property change listener for status & priority',
              checked: true
            },
            {
              id: 'b4-4',
              type: 'todo',
              content: 'Card button custom action runners',
              checked: false
            }
          ]
        },
        'card-5': {
          id: 'card-5',
          column_id: 'col-review',
          title: 'Block-Based Document Editor with Slash Commands',
          description: 'Notion-style rich text inside card slide-out drawer with /h1, /code, /todo, /toggle.',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Code Review',
            priority: 'High',
            assignees: ['Elena Rostova'],
            due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
            tags: ['Editor', 'Blocks'],
            cover_color: '#6366f1'
          },
          blocks: [
            {
              id: 'b5-1',
              type: 'heading_1',
              content: 'Rich Block Editor Spec'
            },
            {
              id: 'b5-2',
              type: 'paragraph',
              content: 'Each card can act as a deep document with nesting, code blocks, toggles, callouts, and checklists.'
            },
            {
              id: 'b5-3',
              type: 'toggle',
              content: 'View Block Architecture Details',
              isOpen: true
            },
            {
              id: 'b5-4',
              type: 'code',
              content: 'const executeBlock = (block: ContentBlock) => {\n  console.log("Rendering block:", block.type);\n};',
              language: 'typescript'
            },
            {
              id: 'b5-5',
              type: 'todo',
              content: 'Code syntax highlighting block',
              checked: true
            },
            {
              id: 'b5-6',
              type: 'todo',
              content: 'Slash command menu popup',
              checked: true
            }
          ]
        },
        'card-6': {
          id: 'card-6',
          column_id: 'col-done',
          title: 'Multi-View Switching (Kanban, Table & List)',
          description: 'Instant zero-lag view switcher allowing database table edits and list execution.',
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Done',
            priority: 'Medium',
            assignees: ['Alex Chen'],
            completed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            tags: ['Views', 'Core'],
            cover_color: '#10b981'
          },
          blocks: [
            {
              id: 'b6-1',
              type: 'heading_2',
              content: 'Delivered Views'
            },
            {
              id: 'b6-2',
              type: 'todo',
              content: 'Kanban Board with column WIP counters',
              checked: true
            },
            {
              id: 'b6-3',
              type: 'todo',
              content: 'Spreadsheet Table View with direct cell editing',
              checked: true
            },
            {
              id: 'b6-4',
              type: 'todo',
              content: 'Rapid Task List View with status chips',
              checked: true
            }
          ]
        }
      },
      automations: [
        {
          id: 'auto-1',
          name: 'Auto-Complete On Done',
          description: 'When card is moved to Done -> Set Completed Date to NOW and check all to-do tasks',
          enabled: true,
          trigger: {
            type: 'card_moved_to_column',
            columnId: 'col-done'
          },
          actions: [
            { id: 'act-1', type: 'set_status', targetValue: 'Done' },
            { id: 'act-2', type: 'set_completed_date' },
            { id: 'act-3', type: 'mark_checklist_done' }
          ]
        },
        {
          id: 'auto-2',
          name: 'Mark Critical on High Priority',
          description: 'When priority is changed to Critical -> Add Urgent tag',
          enabled: true,
          trigger: {
            type: 'property_changed',
            property: 'priority',
            value: 'Critical'
          },
          actions: [
            { id: 'act-4', type: 'add_tag', targetValue: 'Urgent' }
          ]
        },
        {
          id: 'auto-3',
          name: 'Ready for Review Button',
          description: 'Button inside card: Moves card to Code Review column & assigns Elena',
          enabled: true,
          trigger: {
            type: 'button_clicked',
            buttonLabel: 'Request Code Review'
          },
          actions: [
            { id: 'act-5', type: 'move_card', targetValue: 'col-review' },
            { id: 'act-6', type: 'set_status', targetValue: 'Code Review' }
          ]
        }
      ]
    },
    {
      id: 'board-roadmap',
      title: 'Product Roadmap 2026',
      description: 'High-level quarterly initiatives and feature milestones',
      icon: '🗺️',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: [
        { id: 'col-q1', title: 'Q1 Launch', color: '#0284c7', card_ids: ['card-r1'] },
        { id: 'col-q2', title: 'Q2 Expansion', color: '#7c3aed', card_ids: ['card-r2'] },
        { id: 'col-q3', title: 'Q3 Enterprise', color: '#db2777', card_ids: ['card-r3'] }
      ],
      cards: {
        'card-r1': {
          id: 'card-r1',
          column_id: 'col-q1',
          title: 'V1 Public Release on Vercel',
          description: 'Full workspace release with responsive design and instant hydration.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Q1 Launch',
            priority: 'Critical',
            assignees: ['Sarah Lin'],
            tags: ['Release', 'Cloud'],
            cover_color: '#0284c7'
          },
          blocks: [
            { id: 'r1-1', type: 'heading_2', content: 'Launch Checklist' },
            { id: 'r1-2', type: 'todo', content: 'CI/CD Vercel deployment pipeline', checked: true },
            { id: 'r1-3', type: 'todo', content: 'Dark mode styling verification', checked: true }
          ]
        },
        'card-r2': {
          id: 'card-r2',
          column_id: 'col-q2',
          title: 'Custom Template Market & Importer',
          description: 'Prebuilt workspace templates for Bug Tracking, Content Calendars, and OKRs.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Q2 Expansion',
            priority: 'Medium',
            tags: ['Ecosystem'],
            cover_color: '#7c3aed'
          },
          blocks: [
            { id: 'r2-1', type: 'paragraph', content: 'One-click starter templates for teams and individuals.' }
          ]
        },
        'card-r3': {
          id: 'card-r3',
          column_id: 'col-q3',
          title: 'Android Native Client Companion',
          description: 'Native Kotlin & Jetpack Compose app syncing with the cloud graph database.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: 'Q3 Enterprise',
            priority: 'High',
            tags: ['Mobile', 'Android'],
            cover_color: '#db2777'
          },
          blocks: [
            { id: 'r3-1', type: 'paragraph', content: 'Room DB offline-first native Android engine.' }
          ]
        }
      },
      automations: []
    }
  ]
};

