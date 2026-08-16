const textCollator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });

export function compareText(a: string, b: string): number {
  return textCollator.compare(a, b);
}

export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}
