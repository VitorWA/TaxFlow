import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Mail,
  MoreVertical,
  PenLine,
  PieChart,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DropdownMenu from "../components/ui/DropdownMenu";
import Toast from "../components/ui/Toast";
import {
  exportUsage,
  recentReports,
  reportCategoryOptions,
  reportFormatOptions,
  reportsByCategory,
  reportsChart,
  reportsSummary,
  scheduledReports,
} from "../data/reportsMock";

const summaryStyles = {
  orange: "bg-orange-50 text-orange-500",
  violet: "bg-violet-50 text-violet-500",
  blue: "bg-blue-50 text-blue-500",
  green: "bg-emerald-50 text-emerald-500",
};

const summaryIcons = {
  generated: FileText,
  queries: PieChart,
  downloads: Download,
  average: Clock3,
};

const toneDots = {
  orange: "bg-orange-500",
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
};

const categoryBadgeTone = {
  Tributario: "warning",
  Fiscal: "neutral",
  Contabil: "neutral",
  Financeiro: "success",
  Outros: "neutral",
};

const formatBadgeTone = {
  PDF: "warning",
  XLSX: "success",
  CSV: "neutral",
  JSON: "neutral",
};

function SummaryCard({ item }) {
  const Icon = summaryIcons[item.id];
  const isNegative = item.change.startsWith("-");

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-3xl ${summaryStyles[item.tone]}`}
        >
          <Icon size={24} />
        </div>
        <span
          className={`text-sm font-semibold ${isNegative ? "text-red-500" : "text-emerald-500"}`}
        >
          {item.change}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{item.title}</p>
      <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">{item.value}</p>
      <p className="mt-2 text-sm text-slate-400">{item.note}</p>
    </div>
  );
}

function ReportsChartCard() {
  const maxValue = Math.max(...reportsChart.map((point) => point.value));
  const chartHeight = 220;
  const chartWidth = 760;
  const paddingX = 26;
  const usableWidth = chartWidth - paddingX * 2;
  const stepX = usableWidth / (reportsChart.length - 1);

  const points = reportsChart.map((point, index) => {
    const x = paddingX + stepX * index;
    const y = chartHeight - (point.value / maxValue) * 160 - 24;
    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-2xl font-black tracking-tight text-slate-900">
          Relatorios gerados <span className="text-slate-400">(ultimos 6 meses)</span>
        </h3>
        <Button variant="secondary" className="gap-2">
          <CalendarDays size={16} />
          Ultimos 6 meses
          <ChevronDown size={16} />
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[720px]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 36}`} className="h-[280px] w-full">
            <defs>
              <linearGradient id="reportsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((line) => (
              <line
                key={line}
                x1="0"
                y1={32 + line * 48}
                x2={chartWidth}
                y2={32 + line * 48}
                stroke="#e2e8f0"
                strokeDasharray="4 6"
              />
            ))}
            <path d={areaPath} fill="url(#reportsArea)" />
            <path
              d={linePath}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point) => (
              <g key={point.month}>
                <circle cx={point.x} cy={point.y} r="6" fill="#f97316" stroke="white" strokeWidth="2" />
                <text
                  x={point.x}
                  y={chartHeight + 24}
                  textAnchor="middle"
                  className="fill-slate-400 text-[12px] font-medium"
                >
                  {point.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Card>
  );
}

function ReportDetailsContent({ report }) {
  if (!report) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h4 className="text-3xl font-black tracking-tight text-slate-900">{report.name}</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={formatBadgeTone[report.format] || "neutral"}>{report.format}</Badge>
              <Badge tone={categoryBadgeTone[report.category] || "neutral"}>{report.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Periodo</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{report.period}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Gerado em</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{report.generatedAt}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Tamanho</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{report.size}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Paginas</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{report.pages}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Gerado por</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{report.generatedBy}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Descricao</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">{report.description}</p>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Previa do relatorio</p>
        <div className="mt-3 rounded-[28px] border border-slate-100 bg-slate-50 p-4">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="mb-4 h-3 w-24 rounded-full bg-slate-200" />
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <div key={cellIndex} className="h-3 rounded-full bg-slate-100" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="grid grid-cols-4 items-end gap-3">
                  <div className="h-14 rounded-t-2xl bg-orange-200" />
                  <div className="h-20 rounded-t-2xl bg-sky-300" />
                  <div className="h-12 rounded-t-2xl bg-blue-400" />
                  <div className="h-16 rounded-t-2xl bg-cyan-300" />
                </div>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="mx-auto h-28 w-28 rounded-full bg-[conic-gradient(#fb923c_0deg_180deg,#7dd3fc_180deg_288deg,#cbd5e1_288deg_360deg)] p-4">
                  <div className="h-full w-full rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
              &lt;
            </button>
            <span className="text-sm font-semibold text-slate-500">Pagina 1 de 24</span>
            <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [newReportForm, setNewReportForm] = useState({
    name: "",
    category: "",
    startDate: "",
    endDate: "",
    format: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const menuItems = useMemo(
    () => [
      { label: "Renomear relatorio", icon: <PenLine size={16} /> },
      { label: "Agendar relatorio", icon: <Clock3 size={16} /> },
      { label: "Compartilhar", icon: <Share2 size={16} /> },
      { label: "Enviar por e-mail", icon: <Mail size={16} /> },
      { label: "Excluir relatorio", icon: <Trash2 size={16} />, danger: true },
    ],
    [],
  );

  function showToast(message) {
    setToastMessage(message);
  }

  function handleOpenDetails(report) {
    setSelectedReport(report);
    setDetailsOpen(true);
  }

  function handleMockDownload(report) {
    showToast(`Download iniciado (${report.format})`);
  }

  function handleCreateReport() {
    setCreateOpen(false);
    setNewReportForm({
      name: "",
      category: "",
      startDate: "",
      endDate: "",
      format: "",
      email: "",
      description: "",
    });
    showToast("Relatorio criado com sucesso");
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Relatorios Fiscais</h2>
              <p className="mt-3 text-base text-slate-500">
                Gere, visualize e exporte relatorios para analise e tomada de decisao.
              </p>
            </div>
            <Button className="gap-2 self-start" onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              Novo Relatorio
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportsSummary.map((item) => (
              <SummaryCard key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
          <div className="space-y-6">
            <ReportsChartCard />

            <Card className="p-0">
              <div className="border-b border-slate-100 px-6 py-5">
                <h3 className="text-2xl font-black tracking-tight text-slate-900">Relatorios recentes</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-[0.16em] text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Nome do relatorio</th>
                      <th className="px-4 py-4">Categoria</th>
                      <th className="px-4 py-4">Periodo</th>
                      <th className="px-4 py-4">Gerado em</th>
                      <th className="px-4 py-4">Formato</th>
                      <th className="px-4 py-4">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-100 text-sm last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                              <FileSpreadsheet size={18} />
                            </div>
                            <span className="font-semibold text-slate-800">{report.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={categoryBadgeTone[report.category] || "neutral"}>
                            {report.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-slate-500">{report.period}</td>
                        <td className="px-4 py-4 text-slate-500">{report.generatedAt}</td>
                        <td className="px-4 py-4">
                          <Badge tone={formatBadgeTone[report.format] || "neutral"}>{report.format}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:text-orange-500"
                              onClick={() => handleMockDownload(report)}
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:text-orange-500"
                              onClick={() => handleOpenDetails(report)}
                            >
                              <Eye size={16} />
                            </button>
                            <div className="relative">
                              <button
                                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:text-orange-500"
                                onClick={() =>
                                  setMenuOpenFor((current) => (current === report.id ? null : report.id))
                                }
                              >
                                <MoreVertical size={16} />
                              </button>
                              <DropdownMenu
                                open={menuOpenFor === report.id}
                                onClose={() => setMenuOpenFor(null)}
                                items={menuItems}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-5">
                <Button variant="secondary" className="w-full">
                  Ver todos os relatorios
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Relatorios por categoria</h3>
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#f97316_0deg_133deg,#8b5cf6_133deg_223deg,#3b82f6_223deg_292deg,#22c55e_292deg_339deg,#94a3b8_339deg_360deg)]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                    <PieChart size={28} className="text-slate-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {reportsByCategory.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <span className={`h-3 w-3 rounded-full ${toneDots[item.tone]}`} />
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {item.value} ({item.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                Exportacoes mais utilizadas
              </h3>
              <div className="mt-6 space-y-5">
                {exportUsage.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${toneDots[item.tone]}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Agendamentos ativos</h3>
              <div className="mt-6 flex items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Clock3 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{scheduledReports.total}</p>
                    <p className="mt-1 text-xs text-slate-500">{scheduledReports.nextRun}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        open={detailsOpen}
        title="Detalhes do Relatorio"
        onClose={() => setDetailsOpen(false)}
        maxWidth="max-w-5xl"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => selectedReport && handleMockDownload(selectedReport)}>Download</Button>
          </div>
        }
      >
        <ReportDetailsContent report={selectedReport} />
      </Modal>

      <Modal
        open={createOpen}
        title="Novo Relatorio"
        onClose={() => setCreateOpen(false)}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateReport}>Gerar Relatorio</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Nome do relatorio</span>
            <Input
              placeholder="Ex: Demonstrativo de ICMS"
              value={newReportForm.name}
              onChange={(event) =>
                setNewReportForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-600">Categoria</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={newReportForm.category}
                onChange={(event) =>
                  setNewReportForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option value="">Selecione uma categoria</option>
                {reportCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-600">Formato</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={newReportForm.format}
                onChange={(event) =>
                  setNewReportForm((current) => ({ ...current, format: event.target.value }))
                }
              >
                <option value="">Selecione o formato</option>
                {reportFormatOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-600">Data inicial</span>
              <Input
                type="date"
                value={newReportForm.startDate}
                onChange={(event) =>
                  setNewReportForm((current) => ({ ...current, startDate: event.target.value }))
                }
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-600">Data final</span>
              <Input
                type="date"
                value={newReportForm.endDate}
                onChange={(event) =>
                  setNewReportForm((current) => ({ ...current, endDate: event.target.value }))
                }
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Enviar por e-mail (opcional)</span>
            <Input
              type="email"
              placeholder="exemplo@email.com"
              value={newReportForm.email}
              onChange={(event) =>
                setNewReportForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Descricao (opcional)</span>
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              placeholder="Descreva o objetivo deste relatorio..."
              value={newReportForm.description}
              onChange={(event) =>
                setNewReportForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
        </div>
      </Modal>

      <Toast open={Boolean(toastMessage)} message={toastMessage} />
    </>
  );
}
