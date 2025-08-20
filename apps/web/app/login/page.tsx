import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-20 h-20 bg-falabella-red rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-10 h-10 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"/>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              FC Falabella
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Inicia sesión para acceder a tu panel de control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        
        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 FC Falabella. Sistema de gestión de inventario.
          </p>
        </div>
      </div>
    </div>
  )
}