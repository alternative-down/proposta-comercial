import { describe, it, expect } from 'vitest';
import { TEMPLATES, getTemplateById } from '../proposta-templates';
import type { PropostaTemplate } from '../proposta-templates';

describe('TEMPLATES', () => {
  it('has 3 proposal templates', () => {
    expect(TEMPLATES).toHaveLength(3);
  });

  it('each template has a unique id', () => {
    const ids = TEMPLATES.map(t => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('each template has required fields', () => {
    TEMPLATES.forEach(t => {
      expect(typeof t.id).toBe('string');
      expect(t.id.length).toBeGreaterThan(0);
      expect(typeof t.name).toBe('string');
      expect(typeof t.description).toBe('string');
      expect(typeof t.color).toBe('string');
      expect(typeof t.icon).toBe('string');
      expect(t.sections).toBeInstanceOf(Array);
      expect(t.sections.length).toBeGreaterThan(0);
    });
  });

  it('sections are all non-empty strings', () => {
    TEMPLATES.forEach(t => {
      t.sections.forEach(section => {
        expect(typeof section).toBe('string');
        expect(section.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('padrao template has correct sections', () => {
    const padrao = TEMPLATES.find(t => t.id === 'padrao') as PropostaTemplate;
    expect(padrao).toBeDefined();
    expect(padrao.sections).toContain('header');
    expect(padrao.sections).toContain('cliente');
    expect(padrao.sections).toContain('itens');
    expect(padrao.sections).toContain('validade');
    expect(padrao.sections).toContain('pagamento');
    expect(padrao.sections).toContain('footer');
  });

  it('moderno template has fewer sections than padrao', () => {
    const moderno = TEMPLATES.find(t => t.id === 'moderno') as PropostaTemplate;
    const padrao = TEMPLATES.find(t => t.id === 'padrao') as PropostaTemplate;
    expect(moderno.sections.length).toBeLessThan(padrao.sections.length);
  });
});

describe('getTemplateById', () => {
  it('returns template for valid id', () => {
    const padrao = getTemplateById('padrao');
    expect(padrao).toBeDefined();
    expect(padrao!.name).toBe('Padrão');
  });

  it('returns template for moderno id', () => {
    const moderno = getTemplateById('moderno');
    expect(moderno).toBeDefined();
    expect(moderno!.name).toBe('Moderno');
  });

  it('returns template for minimal id', () => {
    const minimal = getTemplateById('minimal');
    expect(minimal).toBeDefined();
    expect(minimal!.name).toBe('Minimalista');
  });

  it('returns undefined for invalid id', () => {
    expect(getTemplateById('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getTemplateById('')).toBeUndefined();
  });
});