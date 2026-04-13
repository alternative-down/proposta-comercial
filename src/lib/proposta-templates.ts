export interface PropostaTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  sections: string[];
}

export const TEMPLATES: PropostaTemplate[] = [
  {
    id: 'padrao',
    name: 'Padrão',
    description: 'Modelo clássico para prestação de serviços.',
    color: 'from-slate-700 to-slate-900',
    icon: '📋',
    sections: ['header', 'cliente', 'itens', 'validade', 'pagamento', 'termos', 'footer'],
  },
  {
    id: 'moderno',
    name: 'Moderno',
    description: 'Visual limpo com destaque para valor total.',
    color: 'from-amber-600 to-orange-500',
    icon: '✨',
    sections: ['header', 'cliente', 'itens', 'validade', 'pagamento', 'footer'],
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Direto ao ponto, sem firulas.',
    color: 'from-slate-400 to-slate-600',
    icon: '◻',
    sections: ['header', 'cliente', 'itens', 'validade', 'footer'],
  },
];

export function getTemplateById(id: string): PropostaTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}
