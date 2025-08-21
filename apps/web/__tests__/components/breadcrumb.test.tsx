import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@/components/ui/breadcrumb'

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('Breadcrumb Components', () => {
  describe('Breadcrumb', () => {
    it('renders with correct navigation attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb')
    })
  })

  describe('BreadcrumbList', () => {
    it('renders as ordered list with proper styling', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const list = screen.getByRole('list')
      expect(list.tagName).toBe('OL')
    })
  })

  describe('BreadcrumbItem', () => {
    it('renders as list item', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test Item</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const listItem = screen.getByRole('listitem')
      expect(listItem.tagName).toBe('LI')
    })
  })

  describe('BreadcrumbLink', () => {
    it('renders as anchor with hover styles', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">Link Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('transition-colors', 'hover:text-foreground')
    })
  })

  describe('BreadcrumbPage', () => {
    it('renders current page with correct ARIA attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const currentPage = screen.getByText('Current Page')
      expect(currentPage).toHaveAttribute('role', 'link')
      expect(currentPage).toHaveAttribute('aria-disabled', 'true')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('BreadcrumbSeparator', () => {
    it('renders separator with ChevronRight icon by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">First</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Second</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const separator = screen.getByRole('presentation')
      expect(separator).toHaveAttribute('aria-hidden', 'true')
      expect(separator.tagName).toBe('LI')
    })

    it('renders custom separator content', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">First</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Second</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      expect(screen.getByText('/')).toBeInTheDocument()
    })
  })

  describe('BreadcrumbEllipsis', () => {
    it('renders ellipsis with proper accessibility attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test">First</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Last</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      const ellipsis = screen.getByRole('presentation')
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByText('Más')).toBeInTheDocument() // Spanish text
    })
  })

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Panel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      // Should have navigation landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Should have ordered list
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have proper number of list items (including separators)
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      
      // Should have links for non-current items
      expect(screen.getAllByRole('link')).toHaveLength(2)
    })
  })

  describe('Spanish Localization', () => {
    it('includes Spanish text for screen readers', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

      expect(screen.getByText('Más')).toBeInTheDocument()
    })
  })
})