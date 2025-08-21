import { render, screen } from '@testing-library/react'
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('AdminBreadcrumb', () => {
  it('renders single breadcrumb item correctly', () => {
    const items = [
      { label: 'Panel', href: '/admin', current: true }
    ]

    render(<AdminBreadcrumb items={items} />)
    
    expect(screen.getByText('Panel')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'breadcrumb')
  })

  it('renders multiple breadcrumb items with navigation', () => {
    const items = [
      { label: 'Panel', href: '/admin' },
      { label: 'Gestión de Usuarios', current: true }
    ]

    render(<AdminBreadcrumb items={items} />)
    
    expect(screen.getByText('Panel')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument()
    
    // Check that Panel is a link
    const panelLink = screen.getByRole('link', { name: 'Panel' })
    expect(panelLink).toHaveAttribute('href', '/admin')
    
    // Check that current item is not a link
    expect(screen.getByText('Gestión de Usuarios')).not.toHaveAttribute('href')
  })

  it('renders breadcrumb with proper ARIA attributes', () => {
    const items = [
      { label: 'Panel', href: '/admin' },
      { label: 'Gestión de Tiendas', current: true }
    ]

    render(<AdminBreadcrumb items={items} />)
    
    const currentPage = screen.getByText('Gestión de Tiendas')
    expect(currentPage).toHaveAttribute('aria-current', 'page')
    expect(currentPage).toHaveAttribute('aria-disabled', 'true')
  })

  it('handles empty items array gracefully', () => {
    render(<AdminBreadcrumb items={[]} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders separators correctly between items', () => {
    const items = [
      { label: 'Panel', href: '/admin' },
      { label: 'Usuarios', href: '/admin/users' },
      { label: 'Editar', current: true }
    ]

    render(<AdminBreadcrumb items={items} />)
    
    // Should have 2 separators for 3 items
    const separators = screen.getAllByRole('presentation')
    expect(separators).toHaveLength(2)
  })

  it('applies proper CSS classes for styling', () => {
    const items = [
      { label: 'Panel', href: '/admin' },
      { label: 'Test', current: true }
    ]

    render(<AdminBreadcrumb items={items} />)
    
    const breadcrumb = screen.getByRole('navigation')
    expect(breadcrumb).toHaveClass('mb-6')
  })
})