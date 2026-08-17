import { describe, expect, it, vi } from 'vitest';

import { createHttpClient } from './httpClient';
import { HttpError } from './httpError';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('createHttpClient', () => {
  it('monta a url a partir da base e devolve o corpo em json', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([{ id: '1' }]));
    const client = createHttpClient({ baseUrl: 'https://api.test/v1', fetchImpl });

    await expect(client.request('/dragon')).resolves.toEqual([{ id: '1' }]);
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.test/v1/dragon',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('serializa o corpo e define o content-type ao enviar dados', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ id: '1' }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await client.request('/dragon', { method: 'POST', body: { name: 'Sarai' } });

    expect(fetchImpl).toHaveBeenCalledWith(
      '/dragon',
      expect.objectContaining({
        method: 'POST',
        body: '{"name":"Sarai"}',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('traduz 404 em erro de cliente com mensagem propria', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon/999')).rejects.toMatchObject({
      kind: 'client',
      status: 404,
      message: 'Registro não encontrado.',
    });
  });

  it('classifica 500 como falha de servidor', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon')).rejects.toMatchObject({ kind: 'server' });
  });

  it('classifica falha de rede', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('failed to fetch'));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon')).rejects.toMatchObject({ kind: 'network' });
  });

  it('classifica estouro de tempo', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValue(new DOMException('tempo esgotado', 'TimeoutError'));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon')).rejects.toMatchObject({ kind: 'timeout' });
  });

  it('reporta corpo ilegivel como erro de parse', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('<html>', { status: 200 }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon')).rejects.toMatchObject({ kind: 'parse' });
  });

  it('nao tenta ler corpo em resposta sem conteudo', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('expoe HttpError como instancia de Error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));
    const client = createHttpClient({ baseUrl: '', fetchImpl });

    await expect(client.request('/dragon')).rejects.toBeInstanceOf(HttpError);
  });
});
