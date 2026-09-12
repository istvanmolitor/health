import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AppSidebar } from '@/components/app-sidebar'
import { EntryFormDialog } from '@/components/entry-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createEntry, deleteEntry, listEntries, updateEntry } from '@/lib/api'
import { moodEmoji, type HealthEntry, type HealthEntryInput } from '@/types'

export default function App() {
  const [entries, setEntries] = useState<HealthEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<HealthEntry | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      setEntries(await listEntries())
    } catch {
      toast.error('Nem sikerült betölteni a bejegyzéseket.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function openCreate() {
    setEditingEntry(null)
    setFormOpen(true)
  }

  function openEdit(entry: HealthEntry) {
    setEditingEntry(entry)
    setFormOpen(true)
  }

  async function handleSubmit(input: HealthEntryInput) {
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, input)
        toast.success('Bejegyzés frissítve.')
      } else {
        await createEntry(input)
        toast.success('Bejegyzés létrehozva.')
      }
      await refresh()
    } catch (error) {
      toast.error('A mentés nem sikerült.')
      throw error
    }
  }

  async function handleDelete() {
    if (!deletingEntry) return
    try {
      await deleteEntry(deletingEntry.id)
      toast.success('Bejegyzés törölve.')
      setDeletingEntry(null)
      await refresh()
    } catch {
      toast.error('A törlés nem sikerült.')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Toaster />
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Bejegyzések</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Bejegyzések</h1>
              <p className="text-muted-foreground text-sm">
                Napi súly, alvás és hangulat nyomon követése.
              </p>
            </div>
            <Button onClick={openCreate}>Új bejegyzés</Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum</TableHead>
                  <TableHead>Súly (kg)</TableHead>
                  <TableHead>Alvás (óra)</TableHead>
                  <TableHead>Hangulat</TableHead>
                  <TableHead>Jegyzet</TableHead>
                  <TableHead className="text-right">Műveletek</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                      Még nincs bejegyzés.
                    </TableCell>
                  </TableRow>
                )}
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.weight_kg ?? '–'}</TableCell>
                    <TableCell>{entry.sleep_hours ?? '–'}</TableCell>
                    <TableCell>{moodEmoji(entry.mood)}</TableCell>
                    <TableCell className="max-w-64 truncate">{entry.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(entry)}>
                        Szerkesztés
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setDeletingEntry(entry)}
                      >
                        Törlés
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>

      <EntryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törlöd?</AlertDialogTitle>
            <AlertDialogDescription>
              A(z) {deletingEntry?.date} dátumú bejegyzés véglegesen törlődik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
