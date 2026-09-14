import { create } from 'zustand';
import { WorkspaceNode, BoardNode, CardNode, ContentBlock, ColumnNode, AutomationRule, ViewMode, UserAccount } from '@/types';
import { INITIAL_WORKSPACE } from '@/lib/seedData';
import { evaluateAndRunAutomations } from '@/lib/automationEngine';

interface WorkspaceState {
  currentUser: UserAccount | null;
  users: UserAccount[];
  workspace: WorkspaceNode;
  activeBoardId: string;
  activeCardId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  isAutomationModalOpen: boolean;
  isTemplateModalOpen: boolean;
  toastMessage: string | null;

  // Auth Actions
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;

  // Actions
  setActiveBoard: (boardId: string) => void;
  setActiveCard: (cardId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setAutomationModalOpen: (open: boolean) => void;
  setTemplateModalOpen: (open: boolean) => void;
  setToastMessage: (msg: string | null) => void;

  // Workspace & Board CRUD
  createBoard: (title: string, description?: string, icon?: string) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardTitle: (boardId: string, title: string) => void;
  
  // Card & Column Management
  moveCard: (cardId: string, sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => void;
  createCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<CardNode>) => void;
  deleteCard: (cardId: string) => void;
  updateCardProperties: (cardId: string, properties: Partial<CardNode['properties']>) => void;
  
  // Block Editing
  addBlock: (cardId: string, type: ContentBlock['type'], content?: string, index?: number) => void;
  updateBlock: (cardId: string, blockId: string, updates: Partial<ContentBlock>) => void;
  deleteBlock: (cardId: string, blockId: string) => void;
  reorderBlocks: (cardId: string, sourceIndex: number, destIndex: number) => void;

  // Columns CRUD
  addColumn: (title: string, color?: string) => void;
  updateColumn: (colId: string, updates: Partial<ColumnNode>) => void;
  deleteColumn: (colId: string) => void;

  // Automations CRUD & Trigger
  addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => void;
  toggleAutomationRule: (ruleId: string) => void;
  deleteAutomationRule: (ruleId: string) => void;
  triggerCardButtonAction: (cardId: string, buttonLabel: string) => void;

  // Persistence & Data Export
  resetToDefaults: () => void;
  importWorkspaceData: (data: WorkspaceNode) => void;
}

const STORAGE_KEY = 'notion_board_workspace_v2';
const USERS_STORAGE_KEY = 'notion_board_users_v2';
const SESSION_KEY = 'notion_board_session_user_v2';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-demo',
    email: 'demo@notionboard.com',
    name: 'Demo User',
    password: 'password123',
    created_at: new Date().toISOString()
  }
];

const getStoredUsers = (): UserAccount[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return DEFAULT_USERS;
};

const getStoredSession = (): UserAccount | null => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return null;
};

const getInitialWorkspace = (): WorkspaceNode => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return INITIAL_WORKSPACE;
};

const saveToLocalStorage = (workspace: WorkspaceNode) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {}
  }
};

const saveUsers = (users: UserAccount[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}
  }
};

const saveSession = (user: UserAccount | null) => {
  if (typeof window !== 'undefined') {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {}
  }
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentUser: getStoredSession(),
  users: getStoredUsers(),
  workspace: getInitialWorkspace(),
  activeBoardId: getInitialWorkspace().active_board_id || 'board-sprint',
  activeCardId: null,
  viewMode: 'board',
  searchQuery: '',
  isAutomationModalOpen: false,
  isTemplateModalOpen: false,
  toastMessage: null,

  login: (email, password) => {
    const users = get().users;
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!password || u.password === password)
    );
    if (found) {
      saveSession(found);
      set({ currentUser: found });
      get().setToastMessage(`Welcome back, ${found.name}`);
      return true;
    }
    return false;
  },

  register: (name, email, password) => {
    const users = get().users;
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveSession(newUser);
    set({ users: updatedUsers, currentUser: newUser });
    get().setToastMessage(`Account created for ${newUser.name}`);
    return true;
  },

  logout: () => {
    saveSession(null);
    set({ currentUser: null, activeCardId: null });
  },

  setActiveBoard: (boardId) => {
    set((state) => {
      const updated = { ...state.workspace, active_board_id: boardId };
      saveToLocalStorage(updated);
      return { workspace: updated, activeBoardId: boardId, activeCardId: null };
    });
  },

  setActiveCard: (cardId) => set({ activeCardId: cardId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAutomationModalOpen: (open) => set({ isAutomationModalOpen: open }),
  setTemplateModalOpen: (open) => set({ isTemplateModalOpen: open }),
  setToastMessage: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 3500);
    }
  },

  createBoard: (title, description, icon = '📄') => {
    const id = `board-${Date.now()}`;
    const newBoard: BoardNode = {
      id,
      title,
      description,
      icon,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: [
        { id: `col-${Date.now()}-1`, title: 'To Do', color: '#64748b', card_ids: [] },
        { id: `col-${Date.now()}-2`, title: 'In Progress', color: '#3b82f6', card_ids: [] },
        { id: `col-${Date.now()}-3`, title: 'Done', color: '#10b981', card_ids: [] }
      ],
      cards: {},
      automations: []
    };

    set((state) => {
      const updated = {
        ...state.workspace,
        boards: [...state.workspace.boards, newBoard],
        active_board_id: id
      };
      saveToLocalStorage(updated);
      return { workspace: updated, activeBoardId: id };
    });
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const remaining = state.workspace.boards.filter((b) => b.id !== boardId);
      if (remaining.length === 0) return state;
      const newActive = remaining[0].id;
      const updated = { ...state.workspace, boards: remaining, active_board_id: newActive };
      saveToLocalStorage(updated);
      return { workspace: updated, activeBoardId: newActive };
    });
  },

  updateBoardTitle: (boardId, title) => {
    set((state) => {
      const boards = state.workspace.boards.map((b) => (b.id === boardId ? { ...b, title } : b));
      const updated = { ...state.workspace, boards };
      saveToLocalStorage(updated);
      return { workspace: updated };
    });
  },

  moveCard: (cardId, sourceColId, destColId, sourceIndex, destIndex) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const newColumns = activeBoard.columns.map((col) => {
        if (col.id === sourceColId && sourceColId === destColId) {
          const newCardIds = Array.from(col.card_ids);
          const [removed] = newCardIds.splice(sourceIndex, 1);
          newCardIds.splice(destIndex, 0, removed);
          return { ...col, card_ids: newCardIds };
        }
        if (col.id === sourceColId) {
          return { ...col, card_ids: col.card_ids.filter((id) => id !== cardId) };
        }
        if (col.id === destColId) {
          const newCardIds = Array.from(col.card_ids);
          newCardIds.splice(destIndex, 0, cardId);
          return { ...col, card_ids: newCardIds };
        }
        return col;
      });

      const card = activeBoard.cards[cardId];
      if (!card) return state;

      const destCol = activeBoard.columns.find((c) => c.id === destColId);
      const updatedCard = {
        ...card,
        column_id: destColId,
        properties: {
          ...card.properties,
          status: destCol ? destCol.title : card.properties.status
        }
      };

      const updatedBoard: BoardNode = {
        ...activeBoard,
        columns: newColumns,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      let finalBoard = updatedBoard;
      if (sourceColId !== destColId) {
        const { newBoardState, executedRules } = evaluateAndRunAutomations(
          updatedBoard,
          'card_moved_to_column',
          cardId,
          { targetColumnId: destColId }
        );
        finalBoard = newBoardState;
        if (executedRules.length > 0) {
          get().setToastMessage(`Executed: "${executedRules[0].ruleName}"`);
        }
      }

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === finalBoard.id ? finalBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  createCard: (columnId, title) => {
    const cardId = `card-${Date.now()}`;
    const newCard: CardNode = {
      id: cardId,
      column_id: columnId,
      title: title.trim() || 'Untitled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      properties: {
        priority: 'Medium',
        tags: []
      },
      blocks: [
        { id: `b-${Date.now()}`, type: 'paragraph', content: '' }
      ]
    };

    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const col = activeBoard.columns.find((c) => c.id === columnId);
      if (col) {
        newCard.properties.status = col.title;
      }

      const updatedBoard: BoardNode = {
        ...activeBoard,
        columns: activeBoard.columns.map((c) =>
          c.id === columnId ? { ...c, card_ids: [cardId, ...c.card_ids] } : c
        ),
        cards: {
          ...activeBoard.cards,
          [cardId]: newCard
        }
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace, activeCardId: cardId };
    });
  },

  updateCard: (cardId, updates) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const updatedCard = {
        ...activeBoard.cards[cardId],
        ...updates,
        updated_at: new Date().toISOString()
      };

      const updatedBoard: BoardNode = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  deleteCard: (cardId) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const newCards = { ...activeBoard.cards };
      delete newCards[cardId];

      const newColumns = activeBoard.columns.map((c) => ({
        ...c,
        card_ids: c.card_ids.filter((id) => id !== cardId)
      }));

      const updatedBoard: BoardNode = {
        ...activeBoard,
        columns: newColumns,
        cards: newCards
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace, activeCardId: null };
    });
  },

  updateCardProperties: (cardId, properties) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const currentCard = activeBoard.cards[cardId];
      const newProps = { ...currentCard.properties, ...properties };

      const updatedCard: CardNode = {
        ...currentCard,
        properties: newProps,
        updated_at: new Date().toISOString()
      };

      let updatedBoard: BoardNode = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      for (const [key, val] of Object.entries(properties)) {
        const { newBoardState, executedRules } = evaluateAndRunAutomations(
          updatedBoard,
          'property_changed',
          cardId,
          { changedProperty: key, changedValue: String(val) }
        );
        updatedBoard = newBoardState;
        if (executedRules.length > 0) {
          get().setToastMessage(`Executed: "${executedRules[0].ruleName}"`);
        }
      }

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  addBlock: (cardId, type, content = '', index) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const card = activeBoard.cards[cardId];
      const newBlock: ContentBlock = {
        id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type,
        content,
        checked: type === 'todo' ? false : undefined,
        isOpen: type === 'toggle' ? true : undefined,
        calloutType: type === 'callout' ? 'info' : undefined,
        language: type === 'code' ? 'typescript' : undefined
      };

      const blocks = Array.from(card.blocks);
      if (typeof index === 'number') {
        blocks.splice(index + 1, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }

      const updatedCard = { ...card, blocks, updated_at: new Date().toISOString() };
      const updatedBoard = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  updateBlock: (cardId, blockId, updates) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const card = activeBoard.cards[cardId];
      const blocks = card.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b));

      const updatedCard = { ...card, blocks, updated_at: new Date().toISOString() };
      let updatedBoard: BoardNode = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      const todos = blocks.filter((b) => b.type === 'todo');
      if (todos.length > 0 && todos.every((t) => t.checked)) {
        const { newBoardState, executedRules } = evaluateAndRunAutomations(
          updatedBoard,
          'checklist_all_completed',
          cardId,
          {}
        );
        updatedBoard = newBoardState;
        if (executedRules.length > 0) {
          get().setToastMessage(`Executed: "${executedRules[0].ruleName}"`);
        }
      }

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  deleteBlock: (cardId, blockId) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const card = activeBoard.cards[cardId];
      const blocks = card.blocks.filter((b) => b.id !== blockId);
      if (blocks.length === 0) {
        blocks.push({ id: `b-${Date.now()}`, type: 'paragraph', content: '' });
      }

      const updatedCard = { ...card, blocks, updated_at: new Date().toISOString() };
      const updatedBoard = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  reorderBlocks: (cardId, sourceIndex, destIndex) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard || !activeBoard.cards[cardId]) return state;

      const card = activeBoard.cards[cardId];
      const blocks = Array.from(card.blocks);
      const [removed] = blocks.splice(sourceIndex, 1);
      blocks.splice(destIndex, 0, removed);

      const updatedCard = { ...card, blocks, updated_at: new Date().toISOString() };
      const updatedBoard = {
        ...activeBoard,
        cards: { ...activeBoard.cards, [cardId]: updatedCard }
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  addColumn: (title, color = '#64748b') => {
    const colId = `col-${Date.now()}`;
    const newCol: ColumnNode = {
      id: colId,
      title: title.trim() || 'New Column',
      color,
      card_ids: []
    };

    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const updatedBoard = {
        ...activeBoard,
        columns: [...activeBoard.columns, newCol]
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  updateColumn: (colId, updates) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const updatedColumns = activeBoard.columns.map((c) => (c.id === colId ? { ...c, ...updates } : c));
      const updatedBoard = { ...activeBoard, columns: updatedColumns };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  deleteColumn: (colId) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const col = activeBoard.columns.find((c) => c.id === colId);
      const cardsToDelete = col ? col.card_ids : [];

      const newCards = { ...activeBoard.cards };
      cardsToDelete.forEach((id) => delete newCards[id]);

      const updatedBoard = {
        ...activeBoard,
        columns: activeBoard.columns.filter((c) => c.id !== colId),
        cards: newCards
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  addAutomationRule: (ruleData) => {
    const id = `auto-${Date.now()}`;
    const newRule: AutomationRule = { ...ruleData, id };

    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const updatedBoard = {
        ...activeBoard,
        automations: [...(activeBoard.automations || []), newRule]
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  toggleAutomationRule: (ruleId) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const updatedRules = activeBoard.automations.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      );
      const updatedBoard = { ...activeBoard, automations: updatedRules };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  deleteAutomationRule: (ruleId) => {
    set((state) => {
      const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
      if (!activeBoard) return state;

      const updatedBoard = {
        ...activeBoard,
        automations: activeBoard.automations.filter((r) => r.id !== ruleId)
      };

      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
      };
      saveToLocalStorage(updatedWorkspace);
      return { workspace: updatedWorkspace };
    });
  },

  triggerCardButtonAction: (cardId, buttonLabel) => {
    const state = get();
    const activeBoard = state.workspace.boards.find((b) => b.id === state.activeBoardId);
    if (!activeBoard) return;

    const { newBoardState, executedRules } = evaluateAndRunAutomations(
      activeBoard,
      'button_clicked',
      cardId,
      { buttonLabel }
    );

    if (executedRules.length > 0) {
      get().setToastMessage(`Triggered: ${buttonLabel}`);
      const updatedWorkspace = {
        ...state.workspace,
        boards: state.workspace.boards.map((b) => (b.id === newBoardState.id ? newBoardState : b))
      };
      saveToLocalStorage(updatedWorkspace);
      set({ workspace: updatedWorkspace });
    }
  },

  resetToDefaults: () => {
    saveToLocalStorage(INITIAL_WORKSPACE);
    set({
      workspace: INITIAL_WORKSPACE,
      activeBoardId: INITIAL_WORKSPACE.active_board_id,
      activeCardId: null
    });
  },

  importWorkspaceData: (data) => {
    saveToLocalStorage(data);
    set({
      workspace: data,
      activeBoardId: data.active_board_id || data.boards[0]?.id || 'board-sprint',
      activeCardId: null
    });
  }
}));
