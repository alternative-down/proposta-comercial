export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  price: number;
  planType: string;
  icon: string;
  fields: Array<{ label: string; key: string; required: boolean; placeholder: string }>;
}

export const TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'padrao',
    name: 'Padrao',
    description: 'Modelo empresarial classico.',
    price: 0,
    planType: 'free',
    icon: 'F',
    fields: [
      { label: 'Razao Social do Emissor', key: 'issuerName', required: true, placeholder: 'Empresa XYZ Ltda' },
      { label: 'CNPJ do Emissor', key: 'issuerCNPJ', required: true, placeholder: '12.345.678/0001-90' },
      { label: 'IE (Inscricao Estadual)', key: 'issuerIE', required: false, placeholder: '123.456.789' },
      { label: 'Endereco do Emissor', key: 'issuerAddress', required: true, placeholder: 'Rua Example, 100, Sao Paulo - SP' },
      { label: 'Razao Social do Cliente', key: 'clientName', required: true, placeholder: 'Cliente ABC S.A.' },
      { label: 'CNPJ do Cliente', key: 'clientCNPJ', required: true, placeholder: '98.765.432/0001-10' },
      { label: 'Endereco do Cliente', key: 'clientAddress', required: true, placeholder: 'Av. Paulista, 1000, Sao Paulo - SP' },
      { label: 'Numero da Fatura', key: 'invoiceNumber', required: true, placeholder: 'FAT-0001' },
      { label: 'Data de Emissao', key: 'issueDate', required: true, placeholder: '13/04/2026' },
      { label: 'Data de Vencimento', key: 'dueDate', required: true, placeholder: '28/04/2026' },
      { label: 'Descricao do Servico', key: 'description', required: true, placeholder: 'Consultoria em gestao empresarial' },
      { label: 'Quantidade', key: 'quantity', required: true, placeholder: '1' },
      { label: 'Valor Unitario (R$)', key: 'unitPrice', required: true, placeholder: '2.500,00' },
      { label: 'Valor Total (R$)', key: 'totalPrice', required: true, placeholder: '2.500,00' },
      { label: 'Forma de Pagamento', key: 'paymentMethod', required: true, placeholder: 'PIX / Transferencia' },
    ],
  },
  {
    id: 'simples',
    name: 'Simples',
    description: 'Minimalista e direto.',
    price: 0,
    planType: 'free',
    icon: '+',
    fields: [
      { label: 'Razao Social do Emissor', key: 'issuerName', required: true, placeholder: 'Empresa XYZ Ltda' },
      { label: 'CNPJ do Emissor', key: 'issuerCNPJ', required: true, placeholder: '12.345.678/0001-90' },
      { label: 'Razao Social do Cliente', key: 'clientName', required: true, placeholder: 'Cliente ABC S.A.' },
      { label: 'CNPJ do Cliente', key: 'clientCNPJ', required: true, placeholder: '98.765.432/0001-10' },
      { label: 'Descricao', key: 'description', required: true, placeholder: 'Servicos prestados' },
      { label: 'Valor Total (R$)', key: 'totalPrice', required: true, placeholder: '2.500,00' },
      { label: 'Data', key: 'date', required: true, placeholder: '13/04/2026' },
      { label: 'Vencimento', key: 'dueDate', required: true, placeholder: '28/04/2026' },
    ],
  },
];

export function getTemplateById(id: string): InvoiceTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function renderInvoice(template: InvoiceTemplate, formData: Record<string, string>): string {
  const get = (key: string) => formData[key] || '[---]';
  const rawAmount = (get('totalPrice') || '0').replace(/[^\d,]/g, '').replace(',', '.');
  const subtotal = parseFloat(rawAmount) || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const formatBRL = (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const issuerIE = formData['issuerIE'];
  const lines: string[] = [
    '============================================================',
    '                        FATURA',
    '============================================================',
    '',
    'N.: ' + get('invoiceNumber'),
    'Emissao: ' + get('issueDate'),
    'Vencimento: ' + get('dueDate'),
    '',
    '------------------------------------------------------------',
    'EMISSOR:',
    get('issuerName'),
    'CNPJ: ' + get('issuerCNPJ'),
  ];
  if (issuerIE) lines.push('IE: ' + issuerIE);
  lines.push(
    get('issuerAddress'),
    '',
    'CLIENTE:',
    get('clientName'),
    'CNPJ: ' + get('clientCNPJ'),
    get('clientAddress'),
    '------------------------------------------------------------',
    '',
    'DESCRICAO                          QTD     VALOR UNIT.   TOTAL',
    get('description'),
    get('quantity') + 'x                            ' + get('unitPrice') + '  ' + get('totalPrice'),
    '',
    '------------------------------------------------------------',
    'Subtotal:                                   ' + formatBRL(subtotal),
    'Impostos (10%):                             ' + formatBRL(tax),
    '------------------------------------------------------------',
    'TOTAL A PAGAR:                               ' + formatBRL(total),
    '============================================================',
    '',
    'Forma de pagamento: ' + get('paymentMethod'),
    '',
    'Aprovado por:',
    '',
    '___________________________________________    ___________',
    '        Emitente                                        Cliente',
  );
  return lines.join('\n');
}