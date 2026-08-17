import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime, toDateTimeAttribute } from './formatDate';

describe('formatDate', () => {
  it('formata uma data ISO no padrao brasileiro', () => {
    expect(formatDate('2026-03-12T18:46:34.760Z')).toMatch(/^\d{2}\/\d{2}\/2026$/);
  });

  it('devolve um travessao quando a data e invalida', () => {
    expect(formatDate('nao-e-data')).toBe('—');
    expect(formatDateTime('')).toBe('—');
  });
});

describe('toDateTimeAttribute', () => {
  it('normaliza a data para o atributo datetime', () => {
    expect(toDateTimeAttribute('2026-03-12T18:46:34.760Z')).toBe('2026-03-12T18:46:34.760Z');
  });

  it('devolve indefinido quando a data e invalida', () => {
    expect(toDateTimeAttribute('nao-e-data')).toBeUndefined();
  });
});
