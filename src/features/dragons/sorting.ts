import type { Dragon } from '@/shared/types';
import { compareText } from '@/shared/utils';

export type SortField = 'registration' | 'name' | 'type' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export const DEFAULT_SORT: SortState = { field: 'name', direction: 'asc' };

function toRegistrationOrder(id: string): number {
  const numericId = Number(id);
  return Number.isNaN(numericId) ? Number.POSITIVE_INFINITY : numericId;
}

const COMPARATOR_BY_FIELD: Record<SortField, (a: Dragon, b: Dragon) => number> = {
  registration: (a, b) => toRegistrationOrder(a.id) - toRegistrationOrder(b.id),
  name: (a, b) => compareText(a.name, b.name),
  type: (a, b) => compareText(a.type, b.type) || compareText(a.name, b.name),
  createdAt: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
};

export function sortDragons(dragons: readonly Dragon[], { field, direction }: SortState): Dragon[] {
  const compare = COMPARATOR_BY_FIELD[field];
  const orientation = direction === 'asc' ? 1 : -1;

  return [...dragons].sort((a, b) => compare(a, b) * orientation);
}

export function nextSortState(current: SortState, field: SortField): SortState {
  if (current.field !== field) {
    return { field, direction: 'asc' };
  }

  return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}
