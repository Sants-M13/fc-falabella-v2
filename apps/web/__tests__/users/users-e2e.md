# User Management E2E Test Plan

This document describes the E2E test scenarios for User Management functionality using MCP Playwright.

## Test Scenarios

### 1. User Creation Flow
- **Given**: Admin is logged in and on the users page
- **When**: Admin clicks "Nuevo Usuario" button
- **Then**: User creation form opens
- **When**: Admin fills in valid user data (email, password, role, store)
- **And**: Clicks "Crear Usuario"
- **Then**: New user is created and appears in the table
- **And**: Success message is displayed

### 2. User List Display
- **Given**: Admin is logged in and on the users page
- **When**: Page loads
- **Then**: Table displays all users with email, role, store, and creation date
- **And**: Search functionality is available
- **And**: User can filter by email, role, or store name

### 3. User Search Functionality
- **Given**: Admin is on the users page with multiple users
- **When**: Admin types in search field
- **Then**: Table filters to show matching results
- **And**: Results update in real-time

### 4. User Edit Flow
- **Given**: Admin is on the users page
- **When**: Admin clicks edit button for a user
- **Then**: Edit form opens with current user data
- **When**: Admin modifies user information
- **And**: Clicks "Actualizar Usuario"
- **Then**: User data is updated in the table
- **And**: Success message is displayed

### 5. Password Reset Flow
- **Given**: Admin is on the users page
- **When**: Admin clicks password reset button for a user
- **Then**: Password reset dialog opens
- **When**: Admin confirms the email and clicks "Enviar Correo"
- **Then**: Success message confirms email was sent
- **And**: Dialog closes

### 6. User Deletion Flow
- **Given**: Admin is on the users page
- **When**: Admin clicks delete button for a user
- **Then**: Confirmation dialog appears
- **When**: Admin confirms deletion
- **Then**: User is removed from the table
- **And**: Success message is displayed

### 7. Form Validation
- **Given**: Admin opens user creation form
- **When**: Admin tries to submit with invalid data (empty email, weak password, etc.)
- **Then**: Validation errors are displayed in Spanish
- **And**: Form cannot be submitted until errors are fixed

### 8. Responsive Design
- **Given**: Admin accesses users page on mobile device
- **When**: Page loads
- **Then**: Layout adapts to mobile view (cards instead of table)
- **And**: All functionality remains accessible

### 9. Access Control
- **Given**: Non-admin user tries to access /admin/users
- **When**: Page loads
- **Then**: User is redirected to login or access denied page

### 10. NFR1 Localization Validation
- **Given**: Admin is on the users page
- **When**: Page loads
- **Then**: All UI text is in Spanish (es-CO)
- **And**: Date formats use DD/MM/YYYY
- **And**: Form validation messages are in Spanish

## Implementation with MCP Playwright

These tests will be implemented using Claude Code's MCP Playwright integration. Each scenario will:

1. Navigate to the users page
2. Interact with UI elements using Playwright commands
3. Assert expected outcomes
4. Validate NFR compliance (especially es-CO localization)
5. Test responsive behavior across different viewport sizes

## Test Data

The tests will use:
- Test admin user from seed data
- Mock user data for creation/editing
- Various invalid inputs for validation testing
- Different viewport sizes for responsive testing

## Accessibility Testing

Each test will also validate:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Proper ARIA labels and descriptions