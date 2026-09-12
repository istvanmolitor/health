import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MOOD_OPTIONS, type HealthEntry, type HealthEntryInput } from '@/types'

const emptyForm: HealthEntryInput = {
  date: new Date().toISOString().slice(0, 10),
  weight_kg: '',
  sleep_hours: '',
  mood: 3,
  notes: '',
}

interface EntryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: HealthEntry | null
  onSubmit: (input: HealthEntryInput) => Promise<void>
}

export function EntryFormDialog({ open, onOpenChange, entry, onSubmit }: EntryFormDialogProps) {
  const [form, setForm] = useState<HealthEntryInput>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        entry
          ? {
              date: entry.date,
              weight_kg: entry.weight_kg ?? '',
              sleep_hours: entry.sleep_hours ?? '',
              mood: entry.mood,
              notes: entry.notes,
            }
          : emptyForm,
      )
    }
  }, [open, entry])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        ...form,
        weight_kg: form.weight_kg || null,
        sleep_hours: form.sleep_hours || null,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{entry ? 'Bejegyzés szerkesztése' : 'Új bejegyzés'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Dátum</Label>
              <Input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Súly (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={form.weight_kg ?? ''}
                  onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sleep">Alvás (óra)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.1"
                  value={form.sleep_hours ?? ''}
                  onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mood">Hangulat</Label>
              <Select
                value={String(form.mood)}
                onValueChange={(value) => setForm({ ...form, mood: Number(value) })}
              >
                <SelectTrigger id="mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.emoji} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Jegyzet</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? 'Mentés…' : 'Mentés'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
