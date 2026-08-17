import { describe, expect, it } from 'vitest';

import { sortByName } from './sortByName';

describe('sortByName', () => {
  it('ordena alfabeticamente ignorando caixa', () => {
    const sorted = sortByName([{ name: 'zephyr' }, { name: 'Alcione' }, { name: 'harry' }]);

    expect(sorted.map((item) => item.name)).toEqual(['Alcione', 'harry', 'zephyr']);
  });

  it('ignora acento ao comparar', () => {
    const sorted = sortByName([{ name: 'Zumbi' }, { name: 'Álvaro' }, { name: 'Bruno' }]);

    expect(sorted.map((item) => item.name)).toEqual(['Álvaro', 'Bruno', 'Zumbi']);
  });

  it('ordena numeros embutidos por valor e nao por caractere', () => {
    const sorted = sortByName([{ name: 'Dragão 10' }, { name: 'Dragão 2' }]);

    expect(sorted.map((item) => item.name)).toEqual(['Dragão 2', 'Dragão 10']);
  });

  it('nao altera o array recebido', () => {
    const original = [{ name: 'Zephyr' }, { name: 'Alcione' }];

    sortByName(original);

    expect(original[0]?.name).toBe('Zephyr');
  });
});
