export const reportsSummary = [
  {
    id: "generated",
    title: "Relatorios Gerados",
    value: "48",
    note: "Este mes",
    change: "+18%",
    tone: "orange",
  },
  {
    id: "queries",
    title: "Consultas Totais",
    value: "1.248",
    note: "Este mes",
    change: "+24%",
    tone: "violet",
  },
  {
    id: "downloads",
    title: "Downloads",
    value: "326",
    note: "Este mes",
    change: "+12%",
    tone: "blue",
  },
  {
    id: "average",
    title: "Tempo Medio",
    value: "2m 34s",
    note: "Por relatorio",
    change: "-8%",
    tone: "green",
  },
];

export const reportsChart = [
  { month: "Dez/2024", value: 20 },
  { month: "Jan/2025", value: 44 },
  { month: "Fev/2025", value: 28 },
  { month: "Mar/2025", value: 41 },
  { month: "Abr/2025", value: 54 },
  { month: "Mai/2025", value: 54 },
  { month: "Jun/2025", value: 80 },
];

export const reportCategoryOptions = [
  "Tributario",
  "Fiscal",
  "Contabil",
  "Financeiro",
  "Outros",
];

export const reportFormatOptions = ["PDF", "XLSX", "CSV", "JSON"];

export const recentReports = [
  {
    id: "icms-demo",
    name: "Demonstrativo de ICMS",
    category: "Tributario",
    period: "01/05/2025 - 31/05/2025",
    generatedAt: "Hoje, 14:30",
    format: "PDF",
    size: "1.2 MB",
    pages: "24 paginas",
    generatedBy: "Joao Silva",
    description:
      "Relatorio contendo o demonstrativo completo do ICMS relativo ao periodo selecionado, com resumo, detalhamento por operacoes e apuracao final.",
  },
  {
    id: "tax-apuracao",
    name: "Apuracao de Impostos",
    category: "Fiscal",
    period: "01/05/2025 - 31/05/2025",
    generatedAt: "Hoje, 10:15",
    format: "XLSX",
    size: "840 KB",
    pages: "12 abas",
    generatedBy: "Joao Silva",
    description:
      "Consolidado de apuracao tributaria com bases, aliquotas e valores recolhidos para acompanhamento interno.",
  },
  {
    id: "consultas-resumo",
    name: "Resumo de Consultas",
    category: "Contabil",
    period: "01/05/2025 - 31/05/2025",
    generatedAt: "Ontem, 16:45",
    format: "PDF",
    size: "960 KB",
    pages: "18 paginas",
    generatedBy: "Camila Rocha",
    description:
      "Resumo executivo com indicadores de uso, consultas mais recorrentes e tendencias do periodo.",
  },
  {
    id: "finance-report",
    name: "Relatorio Financeiro",
    category: "Financeiro",
    period: "01/05/2025 - 31/05/2025",
    generatedAt: "Ontem, 09:22",
    format: "XLSX",
    size: "1.8 MB",
    pages: "9 abas",
    generatedBy: "Mariana Costa",
    description:
      "Analise financeira consolidada com custos tributarios, projecoes e comparativos mensais.",
  },
  {
    id: "stats-general",
    name: "Estatisticas Gerais",
    category: "Outros",
    period: "01/05/2025 - 31/05/2025",
    generatedAt: "09/05/2025, 18:30",
    format: "CSV",
    size: "420 KB",
    pages: "Arquivo unico",
    generatedBy: "Equipe TaxFlow",
    description:
      "Extracao consolidada de estatisticas gerais para importacao em ferramentas externas.",
  },
];

export const reportsByCategory = [
  { label: "Tributario", value: 18, percent: 37, tone: "orange" },
  { label: "Fiscal", value: 12, percent: 25, tone: "violet" },
  { label: "Contabil", value: 9, percent: 19, tone: "blue" },
  { label: "Financeiro", value: 6, percent: 13, tone: "green" },
  { label: "Outros", value: 3, percent: 6, tone: "slate" },
];

export const exportUsage = [
  { label: "PDF", percent: 58, tone: "orange" },
  { label: "Excel (XLSX)", percent: 27, tone: "violet" },
  { label: "CSV", percent: 10, tone: "blue" },
  { label: "JSON", percent: 5, tone: "green" },
];

export const scheduledReports = {
  total: "3 relatorios agendados",
  nextRun: "Proximo envio: 11/05/2025, 08:00",
};
