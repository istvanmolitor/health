import type { HealthEntry, HealthEntryInput } from '@/types'

const BASE_URL = '/api/entries/'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Kérés sikertelen: ${response.status}`)
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
