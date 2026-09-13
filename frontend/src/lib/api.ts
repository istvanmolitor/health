import type { AuthUser, HealthEntry, HealthEntryInput } from '@/types'

const BASE_URL = '/api/entries/'
const AUTH_BASE = '/api/auth/'

function getCsrfToken(): string {
  return document.cookie.match(/(?:^|; )csrftoken=([^;]+)/)?.[1] ?? ''
}

export class ApiError extends Error {
  errors?: Record<string, string[]>

  constructor(status: number, body: { errors?: Record<string, string[]> } | null) {
    super(`Kérés sikertelen: ${status}`)
    this.errors = body?.errors
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function listEntries(): Promise<HealthEntry[]> {
  return request<HealthEntry[]>(BASE_URL)
}

export function createEntry(input: HealthEntryInput): Promise<HealthEntry> {
  return request<HealthEntry>(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateEntry(id: number, input: HealthEntryInput): Promise<HealthEntry> {
  return request<HealthEntry>(`${BASE_URL}${id}/`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteEntry(id: number): Promise<void> {
  return request<void>(`${BASE_URL}${id}/`, { method: 'DELETE' })
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const data = await request<{ authenticated: boolean; user?: AuthUser }>(`${AUTH_BASE}user/`)
  return data.authenticated ? (data.user ?? null) : null
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>(`${AUTH_BASE}login/`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return data.user
}

export async function register(
  username: string,
  password1: string,
  password2: string,
): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>(`${AUTH_BASE}register/`, {
    method: 'POST',
    body: JSON.stringify({ username, password1, password2 }),
  })
  return data.user
}

export async function logout(): Promise<void> {
  await request<void>(`${AUTH_BASE}logout/`, { method: 'POST' })
}
