import { BoardNode, CardNode, AutomationRule } from '@/types';
import confetti from 'canvas-confetti';

export interface AutomationExecutionResult {
  ruleName: string;
  actionsExecuted: string[];
  updatedCard: CardNode;
  triggeredConfetti?: boolean;
}

export function evaluateAndRunAutomations(
  board: BoardNode,
  triggerType: 'card_moved_to_column' | 'checklist_all_completed' | 'property_changed' | 'button_clicked',
  cardId: string,
  context: {
    targetColumnId?: string;
    changedProperty?: string;
    changedValue?: string;
    buttonLabel?: string;
  }
): { updatedCard: CardNode; newBoardState: BoardNode; executedRules: AutomationExecutionResult[] } {
  const card = board.cards[cardId];
  if (!card) return { updatedCard: card, newBoardState: board, executedRules: [] };

  let currentCard: CardNode = JSON.parse(JSON.stringify(card));
  let currentBoard: BoardNode = JSON.parse(JSON.stringify(board));
  const executedRules: AutomationExecutionResult[] = [];

  const activeRules = board.automations.filter((r) => r.enabled);

  for (const rule of activeRules) {
    let matches = false;

    if (rule.trigger.type === 'card_moved_to_column' && triggerType === 'card_moved_to_column') {
      if (rule.trigger.columnId === context.targetColumnId) {
        matches = true;
      }
    } else if (rule.trigger.type === 'property_changed' && triggerType === 'property_changed') {
      if (
        rule.trigger.property === context.changedProperty &&
        (!rule.trigger.value || rule.trigger.value === context.changedValue)
      ) {
        matches = true;
      }
    } else if (rule.trigger.type === 'checklist_all_completed' && triggerType === 'checklist_all_completed') {
      matches = true;
    } else if (rule.trigger.type === 'button_clicked' && triggerType === 'button_clicked') {
      if (rule.trigger.buttonLabel === context.buttonLabel) {
        matches = true;
      }
    }

    if (matches) {
      const actionsExecuted: string[] = [];
      let triggeredConfetti = false;

      for (const action of rule.actions) {
        switch (action.type) {
          case 'set_status': {
            const newStatus = action.targetValue || '';
            currentCard.properties.status = newStatus;
            actionsExecuted.push(`Set status to "${newStatus}"`);
            break;
          }
          case 'set_priority': {
            const newPriority = (action.targetValue as any) || 'Medium';
            currentCard.properties.priority = newPriority;
            actionsExecuted.push(`Set priority to "${newPriority}"`);
            break;
          }
          case 'add_tag': {
            const tagToAdd = action.targetValue || '';
            if (tagToAdd) {
              const existingTags = currentCard.properties.tags || [];
              if (!existingTags.includes(tagToAdd)) {
                currentCard.properties.tags = [...existingTags, tagToAdd];
                actionsExecuted.push(`Added tag "${tagToAdd}"`);
              }
            }
            break;
          }
          case 'set_completed_date': {
            currentCard.properties.completed_at = new Date().toISOString();
            actionsExecuted.push('Set completed date to NOW()');
            triggeredConfetti = true;
            break;
          }
          case 'mark_checklist_done': {
            currentCard.blocks = currentCard.blocks.map((block) => {
              if (block.type === 'todo') {
                return { ...block, checked: true };
              }
              return block;
            });
            actionsExecuted.push('Marked all checklist items as completed');
            break;
          }
          case 'move_card': {
            const targetColId = action.targetValue;
            if (targetColId && targetColId !== currentCard.column_id) {
              // Remove from old column
              const oldCol = currentBoard.columns.find((c) => c.id === currentCard.column_id);
              if (oldCol) {
                oldCol.card_ids = oldCol.card_ids.filter((id) => id !== currentCard.id);
              }
              // Add to new column
              const newCol = currentBoard.columns.find((c) => c.id === targetColId);
              if (newCol) {
                newCol.card_ids.push(currentCard.id);
                currentCard.column_id = targetColId;
                actionsExecuted.push(`Moved card to column "${newCol.title}"`);
              }
            }
            break;
          }
        }
      }

      if (triggeredConfetti && typeof window !== 'undefined') {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch {}
      }

      executedRules.push({
        ruleName: rule.name,
        actionsExecuted,
        updatedCard: currentCard,
        triggeredConfetti
      });
    }
  }

  currentBoard.cards[cardId] = currentCard;
  return { updatedCard: currentCard, newBoardState: currentBoard, executedRules };
}

