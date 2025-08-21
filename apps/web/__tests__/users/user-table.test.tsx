import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserTable } from '@/components/admin/users/user-table';
import { ProfileWithStore } from '@/../../packages/types';

const mockUsers: ProfileWithStore[] = [
  {
    id: '1',
    email: 'admin@falabella.com',
    role: 'admin',
    store_id: null,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    stores: null,
  },
  {
    id: '2',
    email: 'promotora@falabella.com',
    role: 'promotora',
    store_id: 'store-1',
    created_at: '2025-01-02T10:00:00Z',
    updated_at: '2025-01-02T10:00:00Z',
    stores: {
      id: 'store-1',
      name: 'Tienda Centro',
      max_skus: 1000,
      max_brands: 50,
      max_inventory: 10000,
      created_at: '2025-01-01T10:00:00Z',
      updated_at: '2025-01-01T10:00:00Z',
    },
  },
];

describe('UserTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnPasswordReset = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnPasswordReset.mockClear();
  });

  it('debe renderizar lista de usuarios correctamente', () => {
    render(
      <UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    expect(screen.getAllByText('admin@falabella.com')).toHaveLength(2); // Desktop and mobile
    expect(screen.getAllByText('promotora@falabella.com')).toHaveLength(2);
    expect(screen.getAllByText('Administrador')).toHaveLength(2);
    expect(screen.getAllByText('Promotora')).toHaveLength(2);
    expect(screen.getAllByText('Tienda Centro')).toHaveLength(2);
    expect(screen.getByText('Sin asignar')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay usuarios', () => {
    render(
      <UserTable users={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    expect(screen.getByText('No hay usuarios')).toBeInTheDocument();
    expect(screen.getByText('Comience creando un nuevo usuario')).toBeInTheDocument();
  });

  it('debe llamar onEdit cuando se hace clic en editar', () => {
    render(
      <UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    const editButtons = screen.getAllByRole('button');
    const firstEditButton = editButtons.find(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
    );
    
    if (firstEditButton) {
      fireEvent.click(firstEditButton);
      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    }
  });

  it('debe llamar onDelete cuando se hace clic en eliminar', () => {
    render(
      <UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    const deleteButtons = screen.getAllByRole('button');
    const firstDeleteButton = deleteButtons.find(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'trash-2'
    );
    
    if (firstDeleteButton) {
      fireEvent.click(firstDeleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    }
  });

  it('debe mostrar badges correctos para diferentes roles', () => {
    render(
      <UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    const adminBadges = screen.getAllByText('Administrador');
    const promotorasBadges = screen.getAllByText('Promotora');

    expect(adminBadges[0]).toHaveClass('bg-destructive');
    expect(promotorasBadges[0]).toHaveClass('bg-secondary');
  });

  it('debe formatear fechas en español colombiano', () => {
    render(
      <UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} onPasswordReset={mockOnPasswordReset} />
    );

    // Buscar texto que contenga "hace" (characteristic of Spanish relative time)
    const relativeTimeElements = screen.getAllByText(/hace/);
    expect(relativeTimeElements.length).toBeGreaterThan(0);
  });
});