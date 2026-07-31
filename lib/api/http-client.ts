export const API_BASE_URL = (process.env.NEXT_PUBLIC_URL_BASE ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

type JsonBody = Record<string, unknown> | unknown[];

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  accessToken?: string;
  body?: BodyInit | JsonBody | null;
};

function assertBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_URL_BASE is not configured');
  }
}

function resolveUrl(path: string) {
  assertBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function isJsonBody(body: ApiRequestOptions['body']): body is JsonBody {
  return Boolean(body) && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof ArrayBuffer);
}

export async function apiRequest<T>(path: string, { accessToken, body, headers, ...init }: ApiRequestOptions = {}): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  let requestBody: BodyInit | undefined;
  if (isJsonBody(body)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  } else {
    requestBody = body ?? undefined;
  }

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(resolveUrl(path), {
    ...init,
    body: requestBody,
    headers: requestHeaders
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, init?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'GET' });
}

export function apiPost<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'POST', body });
}

export function apiPatch<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'PATCH', body });
}

export function apiDelete<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'DELETE', body });
}
