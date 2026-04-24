export const alertsSummary = [
  {
    id: "unread",
    label: "Alertas nao lidos",
    value: "12",
    note: "Requerem sua atencao",
    tone: "orange",
  },
  {
    id: "today",
    label: "Atualizacoes hoje",
    value: "08",
    note: "Publicadas hoje",
    tone: "violet",
  },
  {
    id: "month",
    label: "Alteracoes este mes",
    value: "24",
    note: "Impactos fiscais",
    tone: "blue",
  },
  {
    id: "total",
    label: "Total de alertas",
    value: "156",
    note: "Ultimos 90 dias",
    tone: "green",
  },
];

export const alertsTabs = [
  { id: "todos", label: "Todos" },
  { id: "nao-lidos", label: "Nao lidos" },
  { id: "legislacao", label: "Legislacao" },
  { id: "tributario", label: "Tributario" },
  { id: "decreto", label: "Decreto" },
  { id: "normativa", label: "Normativa" },
];

export const alertsList = [
  {
    id: 1,
    title: "Atualizacao ICMS/MS - Novas Aliquotas Interestaduais",
    description:
      "Publicada a atualizacao das aliquotas interestaduais do ICMS para o ano de 2024.",
    category: "Legislacao",
    date: "Hoje, 09:15",
    publishedAt: "Publicado em 10/05/2024",
    isNew: true,
    unread: true,
    tone: "orange",
  },
  {
    id: 2,
    title: "Reforma Tributaria 2026 - IBS e CBS",
    description:
      "Novas informacoes sobre a implementacao do IBS e CBS a partir de 2026.",
    category: "Tributario",
    date: "Ontem, 16:40",
    publishedAt: "Publicado em 09/05/2024",
    isNew: true,
    unread: true,
    tone: "violet",
  },
  {
    id: 3,
    title: "Novo Decreto - Beneficios Fiscais",
    description:
      "Publicado decreto que altera beneficios fiscais para empresas do Simples Nacional.",
    category: "Decreto",
    date: "08/05/2024",
    publishedAt: "Publicado em 08/05/2024",
    isNew: true,
    unread: false,
    tone: "blue",
  },
  {
    id: 4,
    title: "Atualizacao do Sistema - Melhorias de Performance",
    description:
      "Implementamos melhorias que vao tornar suas consultas ainda mais rapidas.",
    category: "Normativa",
    date: "07/05/2024",
    publishedAt: "Publicado em 07/05/2024",
    isNew: false,
    unread: false,
    tone: "green",
  },
];

export const alertCategories = [
  { label: "Legislacao", count: 45, tone: "orange" },
  { label: "Tributario", count: 62, tone: "violet" },
  { label: "Decreto", count: 28, tone: "blue" },
  { label: "Normativa", count: 15, tone: "green" },
  { label: "Sistema", count: 6, tone: "slate" },
];

export const alertsImpact = [
  { label: "Alto impacto", count: 122, percent: 78, tone: "orange" },
  { label: "Medio impacto", count: 25, percent: 16, tone: "amber" },
  { label: "Baixo impacto", count: 9, percent: 6, tone: "green" },
];
