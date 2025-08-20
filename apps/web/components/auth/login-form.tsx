'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Get user profile to determine redirect
      const { getUserProfile } = await import('@/lib/auth')
      const profile = await getUserProfile(data.session.user.id)
      
      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'promotora') {
        router.push('/promotora')
      } else {
        router.push('/')
      }
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Correo Electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12"
              placeholder="tu.email@falabella.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 h-12"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-falabella-red hover:bg-falabella-darkRed text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </form>
  )
}