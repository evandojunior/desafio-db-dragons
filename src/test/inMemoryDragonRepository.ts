import type { DragonRepository } from '@/shared/repositories/DragonRepository';
import { HttpError } from '@/shared/services/httpError';
import type { CreateDragonInput, Dragon, UpdateDragonInput } from '@/shared/types';

export interface InMemoryDragonRepository extends DragonRepository {
  seed: Dragon[];
}

export function buildDragon(overrides: Partial<Dragon> = {}): Dragon {
  return {
    id: '1',
    name: 'Fúria da Noite',
    type: 'Fogo',
    createdAt: '2026-03-12T18:46:34.760Z',
    histories: [],
    ...overrides,
  };
}

export function createInMemoryDragonRepository(initial: Dragon[] = []): InMemoryDragonRepository {
  const seed = [...initial];

  function findIndex(id: string): number {
    const index = seed.findIndex((dragon) => dragon.id === id);

    if (index === -1) {
      throw HttpError.fromStatus(404);
    }

    return index;
  }

  return {
    seed,

    async list() {
      return [...seed];
    },

    async findById(id: string) {
      return { ...seed[findIndex(id)]! };
    },

    async create(input: CreateDragonInput) {
      const dragon = buildDragon({
        ...input,
        id: String(seed.length + 1),
        createdAt: new Date().toISOString(),
      });

      seed.push(dragon);

      return dragon;
    },

    async update(id: string, input: UpdateDragonInput) {
      const index = findIndex(id);
      const updated = { ...seed[index]!, ...input };

      seed[index] = updated;

      return updated;
    },

    async remove(id: string) {
      seed.splice(findIndex(id), 1);
    },
  };
}
