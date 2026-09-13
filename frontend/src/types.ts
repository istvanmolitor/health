export interface AuthUser {
  id: number
  username: string
}

export interface HealthEntry {
  id: number
  date: string
  weight_kg: string | null
  sleep_hours: string | null
  mood: number
  notes: string
  created_at: string
}

export type HealthEntryInput = Omit<HealthEntry, 'id' | 'created_at'>

export const MOOD_OPTIONS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Nagyon rossz' },
  { value: 2, emoji: '🙁', label: 'Rossz' },
  { value: 3, emoji: '😐', label: 'Semleges' },
  { value: 4, emoji: '🙂', label: 'Jó' },
  { value: 5, emoji: '😄', label: 'Nagyon jó' },
]

export function moodEmoji(mood: number): string {
  return MOOD_OPTIONS.find((option) => option.value === mood)?.emoji ?? '❓'
}
