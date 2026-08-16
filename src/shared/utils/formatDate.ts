const LOCALE = 'pt-BR';
const INVALID_DATE_PLACEHOLDER = '—';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function toValidDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string): string {
  const date = toValidDate(value);
  return date ? dateFormatter.format(date) : INVALID_DATE_PLACEHOLDER;
}

export function formatDateTime(value: string): string {
  const date = toValidDate(value);
  return date ? dateTimeFormatter.format(date) : INVALID_DATE_PLACEHOLDER;
}

export function toDateTimeAttribute(value: string): string | undefined {
  return toValidDate(value)?.toISOString();
}
