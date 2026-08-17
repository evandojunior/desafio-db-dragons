import { describe, expect, it } from 'vitest';

import { dragonAdapter } from './dragon.adapter';

describe('dragonAdapter.fromResponse', () => {
  it('converte a resposta da api para o dominio', () => {
    const dragon = dragonAdapter.fromResponse({
      id: 162,
      name: 'Alcione 2',
      type: 'Draconico 2',
      createdAt: '2026-02-23T10:30:08.949Z',
      histories: ['Dragão violentíssimo'],
    });

    expect(dragon).toEqual({
      id: '162',
      name: 'Alcione 2',
      type: 'Draconico 2',
      createdAt: '2026-02-23T10:30:08.949Z',
      histories: ['Dragão violentíssimo'],
    });
  });

  it('usa string vazia quando o campo esta ausente ou com tipo inesperado', () => {
    const dragon = dragonAdapter.fromResponse({ id: '1', name: 42 });

    expect(dragon.name).toBe('');
    expect(dragon.type).toBe('');
    expect(dragon.createdAt).toBe('');
  });

  it('descarta entradas nao textuais e vazias de histories', () => {
    const dragon = dragonAdapter.fromResponse({
      id: '1',
      histories: ['válida', '   ', 7, null],
    });

    expect(dragon.histories).toEqual(['válida']);
  });

  it('usa lista vazia quando histories nao e um array', () => {
    expect(dragonAdapter.fromResponse({ id: '1', histories: 'nao-e-array' }).histories).toEqual([]);
  });

  it('rejeita uma resposta que nao seja objeto', () => {
    expect(() => dragonAdapter.fromResponse('texto')).toThrow(TypeError);
  });
});

describe('dragonAdapter.fromResponseList', () => {
  it('devolve lista vazia quando a resposta nao e um array', () => {
    expect(dragonAdapter.fromResponseList({ erro: true })).toEqual([]);
  });
});

describe('dragonAdapter payloads', () => {
  it('remove espacos das pontas ao criar', () => {
    expect(dragonAdapter.toCreatePayload({ name: '  Sarai  ', type: '  Luz ' })).toEqual({
      name: 'Sarai',
      type: 'Luz',
    });
  });

  it('envia apenas os campos informados ao atualizar', () => {
    expect(dragonAdapter.toUpdatePayload({ name: ' Harry ' })).toEqual({ name: 'Harry' });
  });
});
