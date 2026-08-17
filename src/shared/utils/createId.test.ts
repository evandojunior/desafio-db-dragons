import { afterEach, describe, expect, it, vi } from 'vitest';

import { createId } from './createId';

describe('createId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('usa randomUUID quando o navegador oferece', () => {
    expect(createId()).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('gera id sem randomUUID, que so existe em contexto seguro', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: crypto.getRandomValues.bind(crypto),
    });

    const id = createId();

    expect(id).toHaveLength(32);
    expect(id).not.toBe(createId());
  });
});
