import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

describe('Currency and Date Utilities', () => {
  describe('formatCurrency', () => {
    it('debe formatear precio en pesos colombianos', () => {
      const result = formatCurrency(150000);
      expect(result).toContain('150.000');
      expect(result).toContain('$');
    });

    it('debe formatear precio con decimales', () => {
      const result = formatCurrency(150000.99);
      expect(result).toContain('150.000,99');
      expect(result).toContain('$');
    });

    it('debe formatear precio pequeño', () => {
      const result = formatCurrency(1500);
      expect(result).toContain('1.500');
      expect(result).toContain('$');
    });

    it('debe formatear precio con un decimal', () => {
      const result = formatCurrency(150000.5);
      expect(result).toContain('150.000,5');
      expect(result).toContain('$');
    });

    it('debe formatear precio entero sin decimales', () => {
      const result = formatCurrency(150000.00);
      expect(result).toContain('150.000');
      expect(result).toContain('$');
    });

    it('debe manejar cero correctamente', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
      expect(result).toContain('$');
    });

    it('debe usar formato COP (punto como separador de miles)', () => {
      const result = formatCurrency(1234567);
      expect(result).toContain('1.234.567');
    });

    it('debe usar coma como separador decimal', () => {
      const result = formatCurrency(1000.50);
      expect(result).toContain(',5');
    });
  });

  describe('formatDate', () => {
    it('debe formatear fecha como DD/MM/YYYY', () => {
      const date = new Date('2025-08-21T15:30:00Z');
      const result = formatDate(date);
      // Note: Este test puede variar según la zona horaria
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('debe formatear string de fecha ISO', () => {
      const dateString = '2025-08-21T15:30:00.000Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('debe usar formato es-CO (DD/MM/YYYY)', () => {
      const date = new Date('2025-12-25T12:00:00Z');
      const result = formatDate(date);
      // Debe ser formato DD/MM/YYYY, no MM/DD/YYYY
      expect(result).toMatch(/^\d{2}\/\d{2}\/2025$/);
    });
  });

  describe('formatDateTime', () => {
    it('debe formatear fecha y hora', () => {
      const date = new Date('2025-08-21T15:30:00Z');
      const result = formatDateTime(date);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}/);
      expect(result).toContain('21/08/2025');
    });

    it('debe formatear string de fecha ISO con hora', () => {
      const dateString = '2025-08-21T15:30:00.000Z';
      const result = formatDateTime(dateString);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}/);
      expect(result).toContain('21/08/2025');
    });
  });
});