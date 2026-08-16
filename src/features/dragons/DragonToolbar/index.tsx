import { useId } from 'react';

import { ALL_TYPES } from '../useDragonCatalog';

import styles from './DragonToolbar.module.scss';

interface DragonToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  availableTypes: string[];
  hasActiveFilters: boolean;
  onClear: () => void;
  resultLabel: string;
}

export function DragonToolbar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  availableTypes,
  hasActiveFilters,
  onClear,
  resultLabel,
}: DragonToolbarProps) {
  const searchId = useId();
  const typeId = useId();

  return (
    <div className={styles.toolbar}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={searchId}>
            Buscar
          </label>
          <input
            id={searchId}
            type="text"
            className={styles.input}
            placeholder="Nome ou tipo"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={typeId}>
            Tipo
          </label>
          <select
            id={typeId}
            className={styles.select}
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            <option value={ALL_TYPES}>Todos os tipos</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.clear}
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          Limpar filtros
        </button>

        <p className={styles.count} aria-live="polite">
          {resultLabel}
        </p>
      </div>
    </div>
  );
}
