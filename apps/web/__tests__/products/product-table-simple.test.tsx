import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    ],
  },
];

describe('ProductTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('debe mostrar tabla de productos', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Check table headers are present
    expect(screen.getByText('SKU Padre')).toBeInTheDocument();
    expect(screen.getByText('Marca')).toBeInTheDocument();
    expect(screen.getByText('Estilo')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Variantes')).toBeInTheDocument();
  });

  it('debe mostrar contadores de variantes', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('1 variante')).toBeInTheDocument();
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

  it('debe tener botones de editar y eliminar', () => {
    render(
      <ProductTable 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getAllByTitle('Editar producto').length).toBeGreaterThan(0);
    expect(screen.getAllByTitle('Eliminar producto').length).toBeGreaterThan(0);
  });
});