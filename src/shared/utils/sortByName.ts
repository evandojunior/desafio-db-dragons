import { compareText } from './compareText';

export function sortByName<T extends { name: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => compareText(a.name, b.name));
}
