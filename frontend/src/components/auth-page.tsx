import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, login, register } from '@/lib/api'
import type { AuthUser } from '@/types'

interface AuthPageProps {
  onAuthenticated: (user: AuthUser) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  function switchMode(next: 'login' | 'register') {
    setMode(next)
    setPassword('')
    setPassword2('')
    setErrors({})
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})
    try {
      const user =
        mode === 'login' ? await login(username, password) : await register(username, password, password2)
      onAuthenticated(user)
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors)
      } else {
        setErrors({ __all__: ['Váratlan hiba történt.'] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const nonFieldErrors = errors.__all__ ?? []

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}</CardTitle>
          <CardDescription>Egészségnapló admin felület</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {nonFieldErrors.map((message) => (
              <p key={message} className="text-sm text-destructive">
                {message}
              </p>
            ))}
            <div className="grid gap-2">
              <Label htmlFor="username">Felhasználónév</Label>
              <Input
                id="username"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
              {errors.password1?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
            </div>
            {mode === 'register' && (
              <div className="grid gap-2">
                <Label htmlFor="password2">Jelszó megerősítése</Label>
                <Input
                  id="password2"
                  type="password"
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                {errors.password2?.map((message) => (
                  <p key={message} className="text-sm text-destructive">
                    {message}
                  </p>
                ))}
              </div>
            )}
            <Button type="submit" disabled={submitting}>
              {mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Nincs még fiókod?{' '}
                <button type="button" className="underline" onClick={() => switchMode('register')}>
                  Regisztráció
                </button>
              </>
            ) : (
              <>
                Már van fiókod?{' '}
                <button type="button" className="underline" onClick={() => switchMode('login')}>
                  Bejelentkezés
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
