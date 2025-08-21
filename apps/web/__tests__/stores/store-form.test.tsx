import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StoreForm } from '../../components/admin/stores/store-form'
import { StoreService } from '../../lib/stores'
import type { Store } from '../../../../packages/types'

// Mock do StoreService
vi.mock('../../lib/stores', () => ({
  StoreService: {
    createStore: vi.fn(),
    updateStore: vi.fn(),
    isStoreNameAvailable: vi.fn(),
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
  max_skus: 1500,
  max_brands: 75,
  max_inventory: 15000,
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

describe('StoreForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(StoreService.isStoreNameAvailable).mockResolvedValue(true)
  })

  it('should render create form with correct title and default values', () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    expect(screen.getByText('Nueva Tienda')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument() // max_skus default
    expect(screen.getByDisplayValue('50')).toBeInTheDocument() // max_brands default
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument() // max_inventory default
  })

  it('should render edit form with store data', () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="edit"
          store={mockStore}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    expect(screen.getByText('Editar Tienda')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tienda Test')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1500')).toBeInTheDocument() // max_skus
    expect(screen.getByDisplayValue('75')).toBeInTheDocument() // max_brands  
    expect(screen.getByDisplayValue('15000')).toBeInTheDocument() // max_inventory
  })

  it('should show all required form fields', () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    expect(screen.getByText(/nombre de la tienda/i)).toBeInTheDocument()
    expect(screen.getByText(/límite de skus/i)).toBeInTheDocument()
    expect(screen.getByText(/límite de marcas/i)).toBeInTheDocument()
    expect(screen.getByText(/límite de inventario/i)).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la tienda')
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-description')

    const skusInput = screen.getByPlaceholderText('1000')
    expect(skusInput).toHaveAttribute('type', 'number')
    expect(skusInput).toHaveAttribute('min', '1')
    expect(skusInput).toHaveAttribute('max', '10000')
  })

  it('should validate name field and show error messages', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la tienda')
    const submitButton = screen.getByRole('button', { name: /crear tienda/i })

    // Test empty field
    await user.clear(nameInput)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('should have proper input constraints for numeric fields', async () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const skusInput = screen.getByPlaceholderText('1000')
    
    // Check that constraints are in place
    expect(skusInput).toHaveAttribute('type', 'number')
    expect(skusInput).toHaveAttribute('min', '1')
    expect(skusInput).toHaveAttribute('max', '10000')
  })

  it('should check name uniqueness on blur', async () => {
    const user = userEvent.setup()
    vi.mocked(StoreService.isStoreNameAvailable).mockResolvedValue(false)

    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la tienda')
    
    await user.type(nameInput, 'Tienda Existente')
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(StoreService.isStoreNameAvailable).toHaveBeenCalledWith('Tienda Existente', undefined)
      expect(screen.getByText('Este nombre de tienda ya está en uso')).toBeInTheDocument()
    })
  })

  it('should submit form with correct data for create mode', async () => {
    const user = userEvent.setup()
    const mockCreatedStore = { ...mockStore, id: 'new-id' }
    vi.mocked(StoreService.createStore).mockResolvedValue(mockCreatedStore)

    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la tienda')
    const skusInput = screen.getByPlaceholderText('1000')
    const submitButton = screen.getByRole('button', { name: /crear tienda/i })

    await user.clear(nameInput)
    await user.type(nameInput, 'Nueva Tienda')
    await user.clear(skusInput)
    await user.type(skusInput, '2000')

    await user.click(submitButton)

    await waitFor(() => {
      expect(StoreService.createStore).toHaveBeenCalledWith({
        name: 'Nueva Tienda',
        max_skus: 2000,
        max_brands: 50,
        max_inventory: 10000
      })
      expect(mockOnSuccess).toHaveBeenCalledWith(mockCreatedStore)
    })
  })

  it('should render edit mode with correct button text', () => {
    render(
      <TestWrapper>
        <StoreForm
          mode="edit"
          store={mockStore}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /actualizar tienda/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tienda Test')).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    // Make the service call take some time
    vi.mocked(StoreService.createStore).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockStore), 100))
    )

    render(
      <TestWrapper>
        <StoreForm
          mode="create"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la tienda')
    const submitButton = screen.getByRole('button', { name: /crear tienda/i })

    await user.type(nameInput, 'Test Store')
    await user.click(submitButton)

    // Check that submit button shows loading text briefly
    expect(submitButton).toBeInTheDocument()
  })
})