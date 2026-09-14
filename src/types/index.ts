export type NodeType = 'workspace' | 'document' | 'database' | 'board_column' | 'card_block';

export type PropertyType = 'text' | 'status' | 'priority' | 'date' | 'select' | 'multi_select' | 'member' | 'number' | 'checklist_progress';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatarUrl?: string;
  created_at: string;
}

export interface CardProperties {
  status?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assignees?: string[];
  due_date?: string | null;
  completed_at?: string | null;
  tags?: string[];
  cover_color?: string;
  cover_image?: string;
  relations?: Array<{
    target_id: string;
    target_title: string;
    relation_type: string;
  }>;
  custom_fields?: Record<string, any>;
}

export type BlockType = 
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'todo'
  | 'code'
  | 'bullet_list'
  | 'numbered_list'
  | 'toggle'
  | 'callout'
  | 'divider'
  | 'quote';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  language?: string;
  isOpen?: boolean;
  calloutType?: 'info' | 'warning' | 'success' | 'tip';
  children?: ContentBlock[];
}

export interface AutomationAction {
  id: string;
  type: 'move_card' | 'set_status' | 'set_priority' | 'add_tag' | 'set_due_date' | 'mark_checklist_done' | 'set_completed_date';
  targetValue?: string;
  label?: string;
}

export interface AutomationTrigger {
  type: 'card_moved_to_column' | 'checklist_all_completed' | 'property_changed' | 'button_clicked';
  columnId?: string;
  property?: string;
  value?: string;
  buttonLabel?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
}

export interface CardNode {
  id: string;
  column_id: string;
  title: string;
  description?: string;
  properties: CardProperties;
  blocks: ContentBlock[];
  created_at: string;
  updated_at: string;
}

export interface ColumnNode {
  id: string;
  title: string;
  color?: string;
  wip_limit?: number;
  card_ids: string[];
}

export interface BoardNode {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  columns: ColumnNode[];
  cards: Record<string, CardNode>;
  automations: AutomationRule[];
  created_at: string;
  updated_at: string;
}

export interface WorkspaceNode {
  id: string;
  user_id?: string;
  title: string;
  boards: BoardNode[];
  active_board_id: string;
}

export type ViewMode = 'board' | 'table' | 'list';
