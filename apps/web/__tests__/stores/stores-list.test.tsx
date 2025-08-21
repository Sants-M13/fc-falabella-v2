import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import StoresPage from '../../app/(admin)/admin/stores/page'
import { StoreService } from '../../lib/stores'
import type { Store } from '../../../../packages/types'

// Mock do StoreService
vi.mock('../../lib/stores', () => ({
  StoreService: {
    getAllStores: vi.fn(),
  }
}))

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Tienda Centro',
    max_skus: 1000,
    max_brands: 50,
    max_inventory: 10000,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2', 
    name: 'Tienda Norte',
    max_skus: 1500,
    max_brands: 75,
    max_inventory: 15000,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('StoresPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title and description', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    expect(screen.getByText('Gestión de Tiendas')).toBeInTheDocument()
    expect(screen.getByText('Administra las tiendas y sus límites de capacidad')).toBeInTheDocument()
  })

  it('should render "Nueva Tienda" button', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    const buttons = screen.getAllByRole('button', { name: /nueva tienda/i })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should render search input', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    expect(screen.getByPlaceholderText('Buscar tiendas por nombre...')).toBeInTheDocument()
  })

  it('should display stores after loading', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Tienda Centro')).toBeInTheDocument()
      expect(screen.getByText('Tienda Norte')).toBeInTheDocument()
    })
  })

  it('should filter stores by search term', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Tienda Centro')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar tiendas por nombre...')
    await user.type(searchInput, 'Centro')

    expect(screen.getByText('Tienda Centro')).toBeInTheDocument()
    expect(screen.queryByText('Tienda Norte')).not.toBeInTheDocument()
  })

  it('should display capacity information with correct formatting', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getAllByText('SKUs')).toHaveLength(2) // Uma para cada store
      expect(screen.getAllByText('Marcas')).toHaveLength(2) 
      expect(screen.getAllByText('Inventario')).toHaveLength(2)
    })

    // Verificar formatação de números es-CO
    await waitFor(() => {
      const capacityTexts = screen.getAllByText(/1\.000/)
      expect(capacityTexts.length).toBeGreaterThan(0)
    })
  })

  it('should display error state when API fails', async () => {
    vi.mocked(StoreService.getAllStores).mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Error al cargar las tiendas. Por favor, intenta de nuevo.')).toBeInTheDocument()
    })
  })

  it('should display empty state when no stores exist', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue([])

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('No hay tiendas registradas')).toBeInTheDocument()
      expect(screen.getByText('Comienza creando tu primera tienda para gestionar el inventario')).toBeInTheDocument()
      const buttons = screen.getAllByRole('button', { name: /crear primera tienda|nueva tienda/i })
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  it('should display "no results" message when search has no matches', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Tienda Centro')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar tiendas por nombre...')
    await user.type(searchInput, 'xyz123')

    await waitFor(() => {
      expect(screen.getByText('No se encontraron tiendas')).toBeInTheDocument()
      expect(screen.getByText('No hay tiendas que coincidan con "xyz123"')).toBeInTheDocument()
    })
  })

  it('should render action buttons for each store', async () => {
    vi.mocked(StoreService.getAllStores).mockResolvedValue(mockStores)

    render(
      <TestWrapper>
        <StoresPage />
      </TestWrapper>
    )

    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /editar/i })
      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
      
      expect(editButtons).toHaveLength(2) // Uma para cada tienda
      expect(deleteButtons).toHaveLength(2)
    })
  })
})