import { useMemo, useState } from "react";
import {
  AlertCircle,
  BellRing,
  CheckCheck,
  ChevronDown,
  FileText,
  Scale,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tabs from "../components/ui/Tabs";
import {
  alertCategories,
  alertsImpact,
  alertsList,
  alertsSummary,
  alertsTabs,
} from "../data/alertsMock";

const summaryStyles = {
  orange: "bg-orange-50 text-orange-500",
  violet: "bg-violet-50 text-violet-500",
  blue: "bg-blue-50 text-blue-500",
  green: "bg-emerald-50 text-emerald-500",
};

const alertDots = {
  orange: "bg-orange-500",
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  slate: "bg-slate-400",
};

const categoryBadgeTone = {
  Legislacao: "warning",
  Tributario: "neutral",
  Decreto: "neutral",
  Normativa: "success",
};

const alertIcons = {
  Legislacao: AlertCircle,
  Tributario: Scale,
  Decreto: FileText,
  Normativa: CheckCheck,
};

function SummaryIcon({ id }) {
  const icons = {
    unread: AlertCircle,
    today: BellRing,
    month: FileText,
    total: CheckCheck,
  };
  const Icon = icons[id];
  return <Icon size={22} />;
}

function AlertItem({ alert }) {
  const Icon = alertIcons[alert.category] || BellRing;

  return (
    <Card className="p-0">
      <div className="flex items-start gap-4 p-5">
        <span className={`mt-2 h-3 w-3 rounded-full ${alertDots[alert.tone]}`} />
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${
            summaryStyles[alert.tone]
          }`}
        >
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{alert.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{alert.description}</p>
            </div>
            <div className="flex items-center gap-3 lg:flex-col lg:items-end">
              <span className="text-sm text-slate-400">{alert.date}</span>
              {alert.isNew && <Badge tone="warning">Novo</Badge>}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge tone={categoryBadgeTone[alert.category] || "neutral"}>{alert.category}</Badge>
            <span className="text-sm text-slate-400">{alert.publishedAt}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("todos");
  const [search, setSearch] = useState("");

  const filteredAlerts = useMemo(() => {
    return alertsList.filter((alert) => {
      const matchesTab =
        activeTab === "todos" ||
        (activeTab === "nao-lidos" && alert.unread) ||
        alert.category.toLowerCase() === activeTab;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.category.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-orange-200 bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f3_100%)]">
        <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr] xl:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Alertas Fiscais</h2>
            <p className="mt-3 text-base text-slate-500">
              Acompanhe atualizacoes, mudancas na legislacao e comunicados importantes.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {alertsSummary.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${summaryStyles[item.tone]}`}
                  >
                    <SummaryIcon id={item.id} />
                  </div>
                  <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{item.label}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden xl:flex items-center justify-center">
            <div className="relative flex h-[260px] w-full max-w-[320px] items-center justify-center">
              <div className="absolute inset-x-10 bottom-6 h-10 rounded-full bg-orange-200/50 blur-xl" />
              <div className="absolute right-10 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-300 text-white shadow-lg">
                <BellRing size={26} />
              </div>
              <div className="absolute left-10 top-16 h-4 w-16 rounded-full bg-orange-300" />
              <div className="absolute left-6 top-28 h-4 w-10 rounded-full bg-orange-200" />
              <div className="relative flex h-44 w-44 items-center justify-center rounded-[42px] bg-gradient-to-br from-orange-400 to-amber-300 text-white shadow-[0_35px_80px_rgba(249,115,22,0.35)]">
                <BellRing size={84} strokeWidth={1.8} />
              </div>
              <div className="absolute bottom-0 right-4 rounded-[28px] border border-white/80 bg-white px-6 py-4 shadow-lg">
                <div className="h-3 w-20 rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-16 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Tabs items={alertsTabs} activeId={activeTab} onChange={setActiveTab} />
            <div className="flex flex-col gap-3 md:flex-row xl:min-w-[420px] xl:justify-end">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar alertas..."
                  className="pl-11"
                />
              </div>
              <Button variant="secondary" className="gap-2">
                <SlidersHorizontal size={16} />
                Filtrar
                <ChevronDown size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
            ) : (
              <Card>
                <p className="text-base font-semibold text-slate-800">
                  Nenhum alerta encontrado para os filtros atuais.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Ajuste a busca ou selecione outra categoria para visualizar os alertas mockados.
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Categorias</h3>
            <div className="mt-5 space-y-4">
              {alertCategories.map((category) => (
                <div key={category.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className={`h-3 w-3 rounded-full ${alertDots[category.tone]}`} />
                    {category.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{category.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Impacto dos Alertas
            </h3>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#f97316_0deg_281deg,#f59e0b_281deg_339deg,#4ade80_339deg_360deg)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-4xl font-black text-slate-900">78%</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {alertsImpact.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className={`h-3 w-3 rounded-full ${alertDots[item.tone]}`} />
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{item.count} alertas</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="secondary" className="mt-6 w-full">
              Ver analise completa
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
