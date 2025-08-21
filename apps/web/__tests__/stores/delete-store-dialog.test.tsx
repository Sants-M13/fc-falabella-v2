import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeleteStoreDialog } from '../../components/admin/stores/delete-store-dialog'
import { StoreService } from '../../lib/stores'
import type { Store } from '../../../../packages/types'

// Mock do StoreService
vi.mock('../../lib/stores', () => ({
  StoreService: {
    checkStoreDependencies: vi.fn(),
    deleteStore: vi.fn(),
  }
}))

// Mock do useToast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

const mockStore: Store = {
  id: '1',
  name: 'Tienda Test',
  max_skus: 1000,
  max_brands: 50,
  max_inventory: 10000,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
}

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

describe('DeleteStoreDialog', () => {
  const mockOnSuccess = vi.fn()
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dialog with store information', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    expect(screen.getByText('Eliminar Tienda')).toBeInTheDocument()
    expect(screen.getByText('Tienda Test')).toBeInTheDocument()
    expect(screen.getByText('ID: 1')).toBeInTheDocument()
  })

  it('should show loading state while checking dependencies', () => {
    vi.mocked(StoreService.checkStoreDependencies).mockImplementation(() => new Promise(() => {}))

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    expect(screen.getByText('Verificando dependencias...')).toBeInTheDocument()
  })

  it('should allow deletion when no dependencies exist', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('✅ No se encontraron usuarios asociados a esta tienda.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /eliminar tienda/i })).toBeInTheDocument()
    })
  })

  it('should prevent deletion when profiles are associated', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: true,
      profileCount: 3
    })

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('⚠️ No se puede eliminar esta tienda')).toBeInTheDocument()
      expect(screen.getByText(/Esta tienda tiene.*3.*usuarios asociados/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /entendido/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /eliminar tienda/i })).not.toBeInTheDocument()
    })
  })

  it('should handle singular vs plural users correctly', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: true,
      profileCount: 1
    })

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/Esta tienda tiene.*1.*usuario asociado/)).toBeInTheDocument()
    })
  })

  it('should delete store when confirmed', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })
    vi.mocked(StoreService.deleteStore).mockResolvedValue()

    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /eliminar tienda/i })).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /eliminar tienda/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(StoreService.deleteStore).toHaveBeenCalledWith(mockStore.id)
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should show loading state during deletion', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })
    vi.mocked(StoreService.deleteStore).mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /eliminar tienda/i })).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /eliminar tienda/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Eliminando...')).toBeInTheDocument()
    })
  })

  it('should close dialog when cancel is clicked', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })

    const user = userEvent.setup()

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should display error message when dependency check fails', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockRejectedValue(
      new Error('Error de conexión')
    )

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument()
    })
  })

  it('should not render when store is null', () => {
    const { container } = render(
      <TestWrapper>
        <DeleteStoreDialog
          store={null}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should show confirmation message with store name', async () => {
    vi.mocked(StoreService.checkStoreDependencies).mockResolvedValue({
      hasProfiles: false,
      profileCount: 0
    })

    render(
      <TestWrapper>
        <DeleteStoreDialog
          store={mockStore}
          open={true}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/¿Está seguro que desea eliminar la tienda "Tienda Test"\?/)).toBeInTheDocument()
    })
  })
})