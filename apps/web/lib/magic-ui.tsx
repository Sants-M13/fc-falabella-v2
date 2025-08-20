import React from 'react'

interface MagicUIProps {
  className?: string
  children?: React.ReactNode
}

interface BorderBeamProps extends MagicUIProps {
  size?: number
  duration?: number  
  delay?: number
}

interface NumberTickerProps extends MagicUIProps {
  value?: number
}

// Fallback components para Magic UI - implementações simples e elegantes
export const BorderBeam = ({ className, ...props }: BorderBeamProps) => (
  <div className={`absolute inset-0 rounded-lg border-2 border-falabella-red opacity-20 ${className || ''}`} {...props} />
)

export const ShimmerButton = ({ children, className, ...props }: MagicUIProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button 
    className={`relative overflow-hidden bg-gradient-to-r from-falabella-red to-falabella-darkRed hover:from-falabella-darkRed hover:to-falabella-red transition-all duration-300 ${className || ''}`} 
    {...props}
  >
    {children}
  </button>
)

export const NumberTicker = ({ value, className, ...props }: NumberTickerProps) => (
  <span className={`animate-pulse ${className || ''}`} {...props}>
    {value?.toLocaleString('es-CO') || value}
  </span>
)

export const GradientText = ({ children, className, ...props }: MagicUIProps) => (
  <span 
    className={`bg-gradient-to-r from-falabella-red to-falabella-darkRed bg-clip-text text-transparent ${className || ''}`} 
    {...props}
  >
    {children}
  </span>
)

export const DotPattern = ({ className, ...props }: MagicUIProps) => (
  <div 
    className={`absolute inset-0 opacity-10 ${className || ''}`}
    style={{
      backgroundImage: 'radial-gradient(circle, #e31837 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}
    {...props}
  />
)

// Componente wrapper para Suspense
export const MagicUIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="magic-ui-provider">
      {children}
    </div>
  )
}