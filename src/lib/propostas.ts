export interface Plan {
  id: 'free' | 'individual' | 'ilimitado';
  name: string;
  price: number;
  propostasPerMonth: number;
  features: string[];
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: 0,
    propostasPerMonth: 3,
    features: [
      '3 faturas por mês',
      'Todos os campos fiscais',
      'Download em PDF',
      'Sem cadastro obrigatório',
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    price: 19,
    propostasPerMonth: 30,
    features: [
      'Até 30 faturas por mês',
      'Todos os campos fiscais',
      'Download em PDF',
      'Histórico completo',
      'Cálculo automático de impostos',
    ],
  },
  {
    id: 'ilimitado',
    name: 'Ilimitado',
    price: 49,
    propostasPerMonth: Infinity,
    features: [
      'Faturas ilimitadas',
      'Todos os campos fiscais',
      'Download em PDF',
      'Histórico completo',
      'Cálculo automático de impostos',
      'Modelos personalizados',
      'Prioridade no suporte',
    ],
    recommended: true,
  },
];