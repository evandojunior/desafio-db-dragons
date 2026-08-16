import { dragonAdapter } from '@/shared/adapters/dragon.adapter';
import type { HttpClient } from '@/shared/services/httpClient';
import type { CreateDragonInput, Dragon, UpdateDragonInput } from '@/shared/types';

import type { DragonRepository } from './DragonRepository';

const RESOURCE = '/dragon';

export function createHttpDragonRepository(http: HttpClient): DragonRepository {
  return {
    async list(signal) {
      const raw = await http.request<unknown>(RESOURCE, { signal });
      return dragonAdapter.fromResponseList(raw);
    },

    async findById(id, signal) {
      const raw = await http.request<unknown>(`${RESOURCE}/${id}`, { signal });
      return dragonAdapter.fromResponse(raw);
    },

    async create(input: CreateDragonInput): Promise<Dragon> {
      const raw = await http.request<unknown>(RESOURCE, {
        method: 'POST',
        body: dragonAdapter.toCreatePayload(input),
      });
      return dragonAdapter.fromResponse(raw);
    },

    async update(id: string, input: UpdateDragonInput): Promise<Dragon> {
      const raw = await http.request<unknown>(`${RESOURCE}/${id}`, {
        method: 'PUT',
        body: dragonAdapter.toUpdatePayload(input),
      });
      return dragonAdapter.fromResponse(raw);
    },

    async remove(id: string): Promise<void> {
      await http.request<unknown>(`${RESOURCE}/${id}`, { method: 'DELETE' });
    },
  };
}
