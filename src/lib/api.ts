/**
 * Thin fetch wrapper that mimics the axios response shape ({ data: ... })
 * so existing code can switch from axios to fetch with minimal changes.
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const res = await api.get('/api/foo');
 *   console.log(res.data);
 */

const BASE = { credentials: 'include' as RequestCredentials };
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request(method: string, url: string, body?: unknown, opts?: RequestInit) {
  const res = await fetch(url, {
    ...BASE,
    method,
    headers: body !== undefined ? JSON_HEADERS : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...opts,
  });

  // For blob responses (file downloads)
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/octet-stream') ||
      contentType.includes('application/pdf') ||
      contentType.includes('image/')) {
    const blob = await res.blob();
    return { data: blob, status: res.status };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(data?.error || data?.message || `HTTP ${res.status}`);
    err.response = { data, status: res.status };
    throw err;
  }
  return { data, status: res.status };
}

const api = {
  get:    (url: string, opts?: RequestInit)              => request('GET',    url, undefined, opts),
  post:   (url: string, body?: unknown, opts?: RequestInit) => request('POST',   url, body, opts),
  patch:  (url: string, body?: unknown, opts?: RequestInit) => request('PATCH',  url, body, opts),
  put:    (url: string, body?: unknown, opts?: RequestInit) => request('PUT',    url, body, opts),
  delete: (url: string, opts?: RequestInit)              => request('DELETE', url, undefined, opts),
};

export default api;
