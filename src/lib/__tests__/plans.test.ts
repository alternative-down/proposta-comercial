import { describe, it, expect } from 'vitest';
import { PLANS } from '../plans';

describe('PLANS', () => {
  it('has exactly 2 plans', () => {
    expect(PLANS).toHaveLength(2);
  });

  it('Avulso plan has correct values', () => {
    const avulso = PLANS.find(p => p.id === 'avulso');
    expect(avulso).toBeDefined();
    expect(avulso!.price).toBe(19);
    expect(avulso!.propostasPerMonth).toBeNull();
    expect(avulso!.recommended).toBeUndefined();
  });

  it('Mensal plan has correct values', () => {
    const mensal = PLANS.find(p => p.id === 'mensal');
    expect(mensal).toBeDefined();
    expect(mensal!.price).toBe(49);
    expect(mensal!.propostasPerMonth).toBeNull();
    expect(mensal!.recommended).toBe(true);
  });

  it('prices are positive integers', () => {
    PLANS.forEach(plan => {
      expect(plan.price).toBeGreaterThan(0);
      expect(Number.isInteger(plan.price)).toBe(true);
    });
  });

  it('both plans have required fields', () => {
    PLANS.forEach(plan => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(plan.price).toBeDefined();
      expect(plan.propostasPerMonth).toBeDefined(); // can be null
      expect(plan.features).toBeInstanceOf(Array);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it('features are all non-empty strings', () => {
    PLANS.forEach(plan => {
      plan.features.forEach(feature => {
        expect(typeof feature).toBe('string');
        expect(feature.trim().length).toBeGreaterThan(0);
      });
    });
  });
});