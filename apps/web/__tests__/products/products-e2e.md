# E2E Testing for Products Management

## Test Overview
Complete E2E testing for Product Management (Story 1.4) using MCP Playwright integration.

## Test Scenarios

### Setup Requirements
- Admin user authenticated with role 'admin'
- Clean database state for products and variants
- Products page accessible at `/admin/products`

### TC001: Product List Display
**Objective**: Verify products are displayed correctly with Spanish localization
**Steps**:
1. Navigate to `/admin/products`
2. Verify page title "Gestión de Productos"
3. Verify breadcrumb shows "Panel > Gestión de Productos"
4. Verify statistics cards show correct counts
5. Verify currency formatting displays COP format

**Expected Results**:
- Page loads in < 3 seconds
- All text is in Spanish (es-CO)
- Currency values show COP format ($12.345)
- Responsive design works on mobile/desktop

### TC002: Create Product with Variants
**Objective**: Test complete product creation workflow
**Steps**:
1. Click "Nuevo Producto" button
2. Fill product form:
   - SKU Padre: "TEST001"
   - Marca: "Nike"
   - Estilo: "Air Max Test"
   - Precio: 150000
   - Costo: 100000
3. Add variant:
   - Click "Agregar Variante"
   - SKU Hijo: "TEST001M"
   - Tamaño: "M"
4. Add second variant:
   - SKU Hijo: "TEST001L"
   - Tamaño: "L"
5. Submit form

**Expected Results**:
- Form validation works correctly
- Success toast appears in Spanish
- Product appears in list with 2 variants
- Prices formatted in COP

### TC003: Product Search and Filter
**Objective**: Test search and sorting functionality
**Steps**:
1. Create test products with different brands/SKUs
2. Use search input with various terms:
   - Search by SKU
   - Search by brand
   - Search by style
   - Search by variant SKU
3. Test sorting options:
   - Sort by SKU Padre
   - Sort by Brand
   - Sort by Price
   - Sort by Date

**Expected Results**:
- Search results filter correctly
- Sorting works in both directions
- No performance issues with filtering

### TC004: Edit Product and Variants
**Objective**: Test product editing workflow
**Steps**:
1. Click edit button on existing product
2. Modify product fields
3. Add/remove variants
4. Submit changes

**Expected Results**:
- Pre-populated form with existing data
- Changes saved correctly
- Updated data reflected in list
- Success feedback in Spanish

### TC005: Delete Product with Confirmation
**Objective**: Test deletion with proper warnings
**Steps**:
1. Attempt to delete product with variants
2. Verify warning dialog appears
3. Confirm deletion
4. Verify product and variants removed

**Expected Results**:
- Confirmation dialog shows variant details
- Spanish warning messages
- Cascading deletion works correctly
- Success feedback provided

### TC006: SKU Uniqueness Validation
**Objective**: Test SKU uniqueness enforcement
**Steps**:
1. Create product with SKU "UNIQUE001"
2. Attempt to create another product with same SKU
3. Attempt to create variant with existing variant SKU

**Expected Results**:
- Form validation prevents duplicate SKUs
- Error messages in Spanish
- Database constraints enforced

### TC007: Admin Access Control
**Objective**: Test RLS policy enforcement
**Steps**:
1. Test with admin user (should work)
2. Test with promotora user (should fail)
3. Test with unauthenticated user (should redirect)

**Expected Results**:
- Admin has full access
- Promotora gets access denied
- Unauthenticated redirects to login

### TC008: Responsive Design
**Objective**: Test mobile/tablet responsiveness
**Steps**:
1. Test on mobile viewport (375px)
2. Test on tablet viewport (768px)
3. Test on desktop viewport (1024px+)
4. Verify table/card switching

**Expected Results**:
- Layout adapts correctly
- All functionality accessible
- Touch interactions work
- Performance acceptable

### TC009: Accessibility Testing
**Objective**: Test WCAG 2.1 AA compliance
**Steps**:
1. Navigate using keyboard only
2. Test with screen reader
3. Verify ARIA labels
4. Test form validation announcements

**Expected Results**:
- All interactive elements keyboard accessible
- Proper ARIA labels present
- Form errors announced correctly
- Color contrast meets AA standards

### TC010: Currency Formatting Edge Cases
**Objective**: Test COP formatting with various values
**Steps**:
1. Test with large numbers (> 1 million)
2. Test with decimals (.50, .99, .01)
3. Test with zero values
4. Test with very small numbers

**Expected Results**:
- All values formatted correctly as COP
- Decimals handled properly
- No formatting errors or crashes

## Performance Requirements
- Initial page load: < 3 seconds
- Search/filter response: < 500ms
- Form submission: < 2 seconds
- Data refresh: < 1 second

## Localization Validation
- All UI text in Spanish (es-CO)
- Currency formatted as Colombian Pesos
- Dates in DD/MM/YYYY format
- Error messages in Spanish
- HTML lang="es-CO" attribute set

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)