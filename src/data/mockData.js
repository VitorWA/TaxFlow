export const sidebarItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Nova Consulta", path: "/nova-consulta" },
  { label: "Histórico", path: "/historico" },
  { label: "Favoritos", path: "/favoritos" },
  { label: "Alertas", path: "/alertas" },
  { label: "Relatórios", path: "/relatorios" },
  { label: "Configurações", path: "/configuracoes" },
];

export const searchModes = [
  {
    id: "ncm",
    title: "Buscar por NCM",
    helper: "Digite o código NCM",
  },
  {
    id: "descricao",
    title: "Descrição do Produto",
    helper: "Digite o nome ou descrição",
  },
  {
    id: "imagem",
    title: "Imagem do Produto",
    helper: "Faça upload de uma imagem",
  },
];

export const latestQueries = [
  { ncm: "8481.30.00", product: "Válvula de retenção", time: "Hoje, 14:30" },
  { ncm: "9026.20.90", product: "Termômetro digital", time: "Hoje, 10:15" },
  { ncm: "8536.50.90", product: "Chave comutadora", time: "Ontem, 16:45" },
];

export const fiscalAlerts = [
  {
    title: "Atualização ICMS/MS",
    detail: "Novo decreto publicado em 10/05/2024",
    tone: "orange",
  },
  {
    title: "Reforma Tributária 2026",
    detail: "Atualizações sobre IBS/CBS e alíquotas",
    tone: "violet",
  },
  {
    title: "Disponibilidade do Sistema",
    detail: "Manutenção programada para 18/05",
    tone: "blue",
  },
];

export const transitionMetrics = [
  { label: "Produtos analisados", value: "1.248" },
  { label: "Adequações necessárias", value: "276" },
  { label: "Prontos para 2026", value: "972" },
];

export const historyRecords = [
  {
    date: "14/05/2024 14:30",
    product: "Válvula de retenção",
    ncm: "8481.30.00",
    type: "NCM",
  },
  {
    date: "14/05/2024 10:15",
    product: "Termômetro digital",
    ncm: "9026.20.90",
    type: "Descrição",
  },
  {
    date: "13/05/2024 16:45",
    product: "Chave comutadora",
    ncm: "8536.50.90",
    type: "Imagem",
  },
  {
    date: "13/05/2024 09:20",
    product: "Cabo de cobre flexível",
    ncm: "8544.42.00",
    type: "NCM",
  },
  {
    date: "12/05/2024 11:05",
    product: "Parafuso sextavado",
    ncm: "7318.15.00",
    type: "Descrição",
  },
  {
    date: "11/05/2024 15:30",
    product: "Bomba hidráulica",
    ncm: "8413.60.90",
    type: "Imagem",
  },
];

export const favorites = [
  {
    ncm: "8481.30.00",
    product: "Válvula de retenção",
    updatedAt: "Atualizado em 14/05/2024",
  },
  {
    ncm: "9026.20.90",
    product: "Termômetro digital",
    updatedAt: "Atualizado em 14/05/2024",
  },
  {
    ncm: "8536.50.90",
    product: "Chave comutadora",
    updatedAt: "Atualizado em 13/05/2024",
  },
  {
    ncm: "7318.15.00",
    product: "Parafuso sextavado",
    updatedAt: "Atualizado em 12/05/2024",
  },
  {
    ncm: "8413.60.90",
    product: "Bomba hidráulica",
    updatedAt: "Atualizado em 11/05/2024",
  },
];

export const companySettings = {
  companyName: "Empresa Exemplo LTDA",
  cnpj: "12.345.678/0001-90",
  state: "Mato Grosso do Sul (MS)",
  regime: "Lucro Presumido",
  showRates: true,
  notifications: true,
};

export const productResult = {
  product: "Válvula de Retenção",
  ncm: "8481.30.00",
  description: "Válvula de retenção de metal, para instalações hidráulicas.",
  badge: "NCM válido",
};

export const currentRules = [
  { label: "CFOP", value: "5.102" },
  { label: "CST ICMS", value: "060" },
  { label: "Alíquota ICMS", value: "18%" },
  { label: "Situação Tributária", value: "Substituição Tributária" },
  { label: "CEST", value: "17.050.00" },
  { label: "CST PIS", value: "01" },
  { label: "CST COFINS", value: "01" },
  {
    label: "Observação",
    value: "Produto sujeito à ST conforme Decreto 15.644/2021 - MS",
  },
];

export const futureRules = [
  { label: "Situação IBS/CBS", value: "Tributado" },
  { label: "Alíquota IBS", value: "17,70%" },
  { label: "Alíquota CBS", value: "8,80%" },
  { label: "Regime", value: "Padrão" },
  { label: "Cesta Básica Nacional", value: "Não" },
  { label: "Redução de Alíquota", value: "0%" },
  {
    label: "Observação",
    value: "Alíquotas padrão conforme LC 68/2024. Sujeito a alterações.",
  },
];

export const fiscalDetails = {
  general: [
    { label: "NCM", value: "8481.30.00" },
    { label: "Descrição NCM", value: "Válvulas de retenção, de metal." },
    { label: "Ex", value: "0" },
    { label: "Unidade de Medida", value: "UN - Unidade" },
  ],
  icms: [
    { label: "Origem da Mercadoria", value: "0 - Nacional" },
    { label: "CFOP", value: "5.102 - Venda de mercadoria adquirida" },
    { label: "CST", value: "060 - ICMS cobrado anteriormente por ST" },
    { label: "Alíquota Interna", value: "18%" },
    { label: "Alíquota Interestadual", value: "12%" },
    { label: "CEST", value: "17.050.00" },
    { label: "Decreto/Legislação", value: "Decreto 15.644/2021 - MS" },
  ],
  pisCofins: [
    { label: "CST PIS", value: "01" },
    { label: "Alíquota PIS", value: "1,65%" },
    { label: "CST COFINS", value: "01" },
    { label: "Alíquota COFINS", value: "7,60%" },
  ],
  legal: [
    { label: "Base Legal ICMS", value: "RICMS/MS e Decreto 15.644/2021" },
    { label: "Base Legal PIS/COFINS", value: "Lei 10.637/2002 e Lei 10.833/2003" },
    { label: "Reforma 2026", value: "LC 68/2024 - IBS/CBS" },
  ],
  notes: [
    "Mercadoria com incidência de ST em operações internas.",
    "Revisar benefícios fiscais aplicáveis por segmento.",
    "Monitorar atualização da transição IBS/CBS até 2026.",
  ],
};
