import { useCallback, useMemo, useState } from 'react';

import type { Dragon } from '@/shared/types';
import { compareText, normalizeForSearch } from '@/shared/utils';

import { DEFAULT_SORT, nextSortState, sortDragons, type SortField, type SortState } from './sorting';

export const ALL_TYPES = 'all';

function matchesSearch(dragon: Dragon, search: string): boolean {
  const term = normalizeForSearch(search);

  if (!term) {
    return true;
  }

  return (
    normalizeForSearch(dragon.name).includes(term) ||
    normalizeForSearch(dragon.type).includes(term)
  );
}

export function useDragonCatalog(dragons: Dragon[] | undefined) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(ALL_TYPES);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const availableTypes = useMemo(() => {
    const types = new Set((dragons ?? []).map((dragon) => dragon.type).filter(Boolean));
    return [...types].sort(compareText);
  }, [dragons]);

  const visibleDragons = useMemo(() => {
    const filtered = (dragons ?? []).filter(
      (dragon) =>
        matchesSearch(dragon, search) &&
        (selectedType === ALL_TYPES || dragon.type === selectedType),
    );

    return sortDragons(filtered, sort);
  }, [dragons, search, selectedType, sort]);

  const toggleSort = useCallback((field: SortField) => {
    setSort((current) => nextSortState(current, field));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedType(ALL_TYPES);
  }, []);

  return {
    search,
    setSearch,
    selectedType,
    setSelectedType,
    availableTypes,
    sort,
    toggleSort,
    visibleDragons,
    clearFilters,
    hasActiveFilters: search.trim() !== '' || selectedType !== ALL_TYPES,
  };
}
