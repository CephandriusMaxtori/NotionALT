import { WorkspaceNode } from '@/types';

export const EMPTY_WORKSPACE: WorkspaceNode = {
  id: 'workspace-default',
  title: 'My Workspace',
  active_board_id: 'board-welcome',
  boards: [
    {
      id: 'board-welcome',
      title: 'Quick Start Tutorial',
      description: 'Interactive guide to using your hybrid Notion + Trello workspace.',
      icon: '👋',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: [
        {
          id: 'col-step1',
          title: '1. Basics',
          color: '#64748b',
          card_ids: ['card-t1', 'card-t2']
        },
        {
          id: 'col-step2',
          title: '2. Documents & Blocks',
          color: '#3b82f6',
          card_ids: ['card-t3']
        },
        {
          id: 'col-step3',
          title: '3. Automations & GitHub',
          color: '#8b5cf6',
          card_ids: ['card-t4', 'card-t5']
        },
        {
          id: 'col-step4',
          title: '4. Done',
          color: '#10b981',
          card_ids: []
        }
      ],
      cards: {
        'card-t1': {
          id: 'card-t1',
          column_id: 'col-step1',
          title: 'Click this card to open the slide-over document drawer',
          description: 'Cards double as full Notion-style document canvases with properties and blocks.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: '1. Basics',
            priority: 'Low',
            tags: ['Tutorial', 'Getting Started'],
            cover_color: '#3b82f6'
          },
          blocks: [
            {
              id: 'bt1-1',
              type: 'heading_2',
              content: 'Welcome to Notion Board!'
            },
            {
              id: 'bt1-2',
              type: 'paragraph',
              content: 'This workspace combines the best of Notion (nested blocks & relational metadata) with Trello (tactile Kanban drag-and-drop).'
            },
            {
              id: 'bt1-3',
              type: 'todo',
              content: 'Try dragging this card to another column on the board',
              checked: false
            },
            {
              id: 'bt1-4',
              type: 'todo',
              content: 'Try adding or removing tags in the Properties section above',
              checked: false
            }
          ]
        },
        'card-t2': {
          id: 'card-t2',
          column_id: 'col-step1',
          title: 'Switch between Board, Table, and List views',
          description: 'Use the view toggles in the top bar to inspect your data in multiple formats.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: '1. Basics',
            priority: 'Medium',
            tags: ['Views'],
            cover_color: '#8b5cf6'
          },
          blocks: [
            {
              id: 'bt2-1',
              type: 'heading_2',
              content: 'Multi-View Switching'
            },
            {
              id: 'bt2-2',
              type: 'paragraph',
              content: 'Click "Table" in the top bar to edit properties in a spreadsheet format, or "List" for rapid execution.'
            }
          ]
        },
        'card-t3': {
          id: 'card-t3',
          column_id: 'col-step2',
          title: 'Type "/" inside documents to insert rich blocks',
          description: 'Headings, checkboxes, code snippets, toggles, callout boxes, and dividers.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: '2. Documents & Blocks',
            priority: 'High',
            tags: ['Editor', 'Blocks'],
            cover_color: '#f59e0b'
          },
          blocks: [
            {
              id: 'bt3-1',
              type: 'heading_2',
              content: 'Slash Commands (/)'
            },
            {
              id: 'bt3-2',
              type: 'callout',
              content: 'Type "/" anywhere in a card body to open the block inserter menu.',
              calloutType: 'info'
            },
            {
              id: 'bt3-3',
              type: 'code',
              content: '// Example code snippet\nconst hybridProductivity = "Notion" + "Trello";',
              language: 'typescript'
            },
            {
              id: 'bt3-4',
              type: 'todo',
              content: 'Check off this todo item',
              checked: false
            }
          ]
        },
        'card-t4': {
          id: 'card-t4',
          column_id: 'col-step3',
          title: 'Connect or Import from GitHub Repositories',
          description: 'Turn your GitHub Issues or PRs directly into a Notion Board database canvas.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: '3. Automations & GitHub',
            priority: 'Critical',
            tags: ['GitHub', 'Database'],
            cover_color: '#10b981'
          },
          blocks: [
            {
              id: 'bt4-1',
              type: 'heading_2',
              content: 'GitHub Database Sync'
            },
            {
              id: 'bt4-2',
              type: 'paragraph',
              content: 'Click "+ GitHub Board" in the sidebar to fetch real-time issues and repository tasks directly into cards.'
            },
            {
              id: 'bt4-3',
              type: 'todo',
              content: 'Create a GitHub database board from a public or private repo',
              checked: false
            }
          ]
        },
        'card-t5': {
          id: 'card-t5',
          column_id: 'col-step3',
          title: 'Try Butler Visual Automations',
          description: 'Click "Rules" in the top bar to create triggers and automated action pipelines.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          properties: {
            status: '3. Automations & GitHub',
            priority: 'Medium',
            tags: ['Butler'],
            cover_color: '#ec4899'
          },
          blocks: [
            {
              id: 'bt5-1',
              type: 'paragraph',
              content: 'Automations can automatically update statuses, mark dates, and check tasks when cards move.'
            }
          ]
        }
      },
      automations: [
        {
          id: 'auto-t1',
          name: 'Celebrate Tutorial Completion',
          description: 'When card moved to "4. Done" -> Set completed date',
          enabled: true,
          trigger: { type: 'card_moved_to_column', columnId: 'col-step4' },
          actions: [{ id: 'act-t1', type: 'set_completed_date' }]
        }
      ]
    }
  ]
};

export const BLANK_WORKSPACE: WorkspaceNode = {
  id: 'workspace-blank',
  title: 'My Workspace',
  active_board_id: 'board-new',
  boards: [
    {
      id: 'board-new',
      title: 'Main Board',
      description: 'Your new clean workspace board',
      icon: '📋',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: [
        { id: `col-${Date.now()}-1`, title: 'To Do', color: '#64748b', card_ids: [] },
        { id: `col-${Date.now()}-2`, title: 'In Progress', color: '#3b82f6', card_ids: [] },
        { id: `col-${Date.now()}-3`, title: 'Done', color: '#10b981', card_ids: [] }
      ],
      cards: {},
      automations: []
    }
  ]
};
