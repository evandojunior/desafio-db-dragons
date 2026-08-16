import type { CreateDragonInput, Dragon, UpdateDragonInput } from '@/shared/types';

export interface DragonRepository {
  list(signal?: AbortSignal): Promise<Dragon[]>;
  findById(id: string, signal?: AbortSignal): Promise<Dragon>;
  create(input: CreateDragonInput): Promise<Dragon>;
  update(id: string, input: UpdateDragonInput): Promise<Dragon>;
  remove(id: string): Promise<void>;
}
