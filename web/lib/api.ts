const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message ?? 'Request failed')
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    login: (email: string, password: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  books: {
    search: (q: string) => request(`/books/search?q=${encodeURIComponent(q)}`),
  },

  collection: {
    list: () => request('/collection'),
    search: (q: string) => request(`/collection/search?q=${encodeURIComponent(q)}`),
    add: (body: {
      googleId: string
      title: string
      authors: string[]
      thumbnail: string
    }) =>
      request('/collection', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: { status?: string; rating?: number; notes?: string }) =>
      request(`/collection/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/collection/${id}`, { method: 'DELETE' }),
  },
}
