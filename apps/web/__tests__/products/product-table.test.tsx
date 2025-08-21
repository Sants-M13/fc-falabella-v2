import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductTable } from '@/components/admin/products/product-table';
import { ProductWithVariants } from '@/lib/types/products';

const mockProducts: ProductWithVariants[] = [
  {
    id: '1',
    sku_parent: 'ABC123',
    brand: 'Nike',
    style: 'Air Max',
    price: 150000,
    cost: 100000,
    created_at: '2025-08-21T10:00:00.000Z',
    updated_at: '2025-08-21T10:00:00.000Z',
    variants: [
      {
        id: '1-1',
        product_id: '1',
        sku_child: 'ABC123M',
        size: 'M',
        created_at: '2025-08-21T10:00:00.000Z',
        updated_at: '2025-08-21T10:00:00.000Z',
      },
      {
        id: '1-2',
        product_id: '1',
        sku_child: 'ABC123L',
        size: 'L',
        created_at: '2025-08-21T10:00:00.000Z',
        updated_at: '2025-08-21T10:00:00.000Z',
      },
    ],
  },
  {
    id: '2',
    sku_parent: 'XYZ789',
    brand: 'Adidas',
    style: 'Stan Smith',
    price: 120000,
    cost: 80000,
    created_at: '2025-08-20T10:00:00.000Z',
    updated_at: '2025-08-20T10:00:00.000Z',
    variants: [],
  },
];

describe('ProductTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar lista de productos', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByText('ABC123')).toHaveLength(2); // Desktop and mobile views
    expect(screen.getByText('Nike')).toBeInTheDocument();
    expect(screen.getByText('Air Max')).toBeInTheDocument();
    expect(screen.getAllByText('XYZ789')).toHaveLength(2); // Desktop and mobile views
    expect(screen.getByText('Adidas')).toBeInTheDocument();
    expect(screen.getByText('Stan Smith')).toBeInTheDocument();
  });

  it('debe mostrar precios formateados en COP', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByText(/150\.000/)).toHaveLength(2); // Desktop and mobile views
    expect(screen.getAllByText(/120\.000/)).toHaveLength(2); // Desktop and mobile views
  });

  it('debe mostrar contador de variantes', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('2 variantes')).toBeInTheDocument();
    expect(screen.getByText('0 variantes')).toBeInTheDocument();
  });

  it('debe llamar onEdit cuando se hace clic en editar', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButtons = screen.getAllByTitle('Editar producto');
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe llamar onDelete cuando se hace clic en eliminar', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButtons = screen.getAllByTitle('Eliminar producto');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe mostrar mensaje cuando no hay productos', () => {
    render(
      <ProductTable 
        products={[]} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('No hay productos')).toBeInTheDocument();
    expect(screen.getByText('Comience creando un nuevo producto')).toBeInTheDocument();
  });

  it('debe expandir/colapsar variantes en vista móvil', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const toggleButton = screen.getByText('Ver 2 variantes');
    expect(toggleButton).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.getByText('ABC123M')).toBeInTheDocument();
    expect(screen.getByText('ABC123L')).toBeInTheDocument();
  });

  it('debe mostrar indicadores de variantes correctamente', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Product with variants should show plural
    expect(screen.getByText('2 variantes')).toBeInTheDocument();
    // Product without variants should show singular with 0
    expect(screen.getByText('0 variantes')).toBeInTheDocument();
  });
});