import { HttpError } from './httpError';

const DEFAULT_TIMEOUT_MS = 12_000;
const NO_CONTENT = 204;

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export interface HttpClient {
  request<T>(path: string, options?: HttpRequestOptions): Promise<T>;
}

export interface HttpClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function combineSignals(timeoutMs: number, external?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(timeoutMs);
  return external ? AbortSignal.any([timeout, external]) : timeout;
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === NO_CONTENT) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new HttpError('parse');
  }
}

export function createHttpClient({
  baseUrl,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl = globalThis.fetch,
}: HttpClientConfig): HttpClient {
  return {
    async request<T>(path: string, { method = 'GET', body, signal }: HttpRequestOptions = {}) {
      let response: Response;

      try {
        response = await fetchImpl(`${baseUrl}${path}`, {
          method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined,
          signal: combineSignals(timeoutMs, signal),
        });
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'TimeoutError';
        throw new HttpError(aborted ? 'timeout' : 'network');
      }

      if (!response.ok) {
        throw HttpError.fromStatus(response.status);
      }

      return parseBody<T>(response);
    },
  };
}
