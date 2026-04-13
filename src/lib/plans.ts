export interface Plan {
  id: 'avulso' | 'mensal';
  name: string;
  price: number;
  propostasPerMonth: number | null;
  features: string[];
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'avulso',
    name: 'Avulso',
    price: 19,
    propostasPerMonth: null,
    features: [
      '1 proposta comercial',
      'Todos os campos profissionais',
      'Download em PDF',
      'Link para compartilhar',
      'Validade configurável',
    ],
  },
  {
    id: 'mensal',
    name: 'Mensal',
    price: 49,
    propostasPerMonth: null,
    features: [
      'Propostas ilimitadas',
      'Todos os campos profissionais',
      'Download em PDF',
      'Link para compartilhar',
      'Validade configurável',
      'Múltiplos modelos',
      'Histórico completo',
      'Prioridade no suporte',
    ],
    recommended: true,
  },
];
