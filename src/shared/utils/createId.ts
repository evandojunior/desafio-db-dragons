const ID_BYTES = 16;

export function createId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(ID_BYTES));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
