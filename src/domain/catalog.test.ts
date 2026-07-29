import { describe, expect, it } from 'vitest';
import { productBySlug, products } from './catalog';

describe('catalog', () => {
  it('mantém slugs e ids únicos', () => {
    expect(new Set(products.map((item) => item.id)).size).toBe(products.length);
    expect(new Set(products.map((item) => item.slug)).size).toBe(products.length);
  });

  it('mantém nome, descrição e imagem em todos os produtos', () => {
    for (const product of products) {
      expect(product.name.trim().length).toBeGreaterThan(3);
      expect(product.description.trim().length).toBeGreaterThan(10);
      expect(product.image).toMatch(/\/products\/[a-z-]+\.png$/);
    }
  });

  it('localiza produto por slug', () => {
    expect(productBySlug('pulse-headphone-pro')?.name).toBe('Fone de Ouvido Bluetooth Pulse ANC 700');
  });
});
