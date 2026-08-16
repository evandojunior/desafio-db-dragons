import type { CreateDragonInput, Dragon, UpdateDragonInput } from '@/shared/types';

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

function readStringList(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const dragonAdapter = {
  fromResponse(raw: unknown): Dragon {
    if (!isRecord(raw)) {
      throw new TypeError('Resposta de dragão em formato inesperado.');
    }

    return {
      id: String(raw.id ?? ''),
      name: readString(raw, 'name'),
      type: readString(raw, 'type'),
      createdAt: readString(raw, 'createdAt'),
      histories: readStringList(raw, 'histories'),
    };
  },

  fromResponseList(raw: unknown): Dragon[] {
    return Array.isArray(raw) ? raw.map((item) => dragonAdapter.fromResponse(item)) : [];
  },

  toCreatePayload({ name, type }: CreateDragonInput) {
    return { name: name.trim(), type: type.trim() };
  },

  toUpdatePayload({ name, type, histories }: UpdateDragonInput) {
    return {
      ...(name === undefined ? {} : { name: name.trim() }),
      ...(type === undefined ? {} : { type: type.trim() }),
      ...(histories === undefined
        ? {}
        : { histories: histories.map((entry) => entry.trim()).filter(Boolean) }),
    };
  },
};
