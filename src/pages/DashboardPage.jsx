import { Check, Clock3, FileWarning, Search, SearchCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSearchCard from "../components/dashboard/HeroSearchCard";
import InfoListCard from "../components/common/InfoListCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import {
  fiscalAlerts,
  latestQueries,
  transitionMetrics,
} from "../data/mockData";

const alertDots = {
  orange: "bg-orange-500",
  violet: "bg-violet-500",
  blue: "bg-blue-500",
};

export default function DashboardPage({ activeSection = "dashboard" }) {
  const navigate = useNavigate();
  const isNewConsultation = activeSection === "nova-consulta";

  return (
    <div className="space-y-6">
      {isNewConsultation && (
        <Card className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input placeholder="Digite NCM, descrição ou nome do produto" />
            <Button className="gap-2 md:min-w-[140px]" onClick={() => navigate("/resultado")}>
              <Search size={16} />
              Buscar
            </Button>
          </div>
        </Card>
      )}

      <HeroSearchCard
        showSearch={!isNewConsultation}
        onSearch={() => navigate("/resultado")}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr_1.2fr]">
        <InfoListCard title="Últimas Consultas">
          <div className="space-y-3">
            {latestQueries.map((item) => (
              <button
                key={`${item.ncm}-${item.time}`}
                onClick={() => navigate("/resultado")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 text-left transition hover:border-orange-100 hover:bg-orange-50/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <SearchCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{item.ncm}</p>
                  <p className="truncate text-xs text-slate-500">{item.product}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </button>
            ))}
          </div>
          <Button variant="secondary" className="mt-5 w-full" onClick={() => navigate("/historico")}>
            Ver todas
          </Button>
        </InfoListCard>

        <InfoListCard
          title="Alertas Fiscais"
          action={
            <button className="text-sm font-semibold text-orange-500">Ver todos</button>
          }
        >
          <div className="space-y-3">
            {fiscalAlerts.map((alert) => (
              <div
                key={alert.title}
                className="rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-orange-100"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${alertDots[alert.tone]}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{alert.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfoListCard>

        <InfoListCard title="Transição 2026">
          <div className="flex items-center gap-4 rounded-3xl bg-orange-50 p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-orange-500 text-xl font-black text-slate-900">
              78%
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Preparação do seu cadastro para a Reforma Tributária
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Visão consolidada de aderência às regras futuras.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {transitionMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Check size={16} className="text-emerald-500" />
                  {metric.label}
                </span>
                <span className="font-semibold text-slate-900">{metric.value}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-5 w-full" onClick={() => navigate("/detalhamento")}>
            Ver relatório completo
          </Button>
        </InfoListCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InfoListCard title="Nova Consulta">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Clock3 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Use a busca por NCM, descrição ou imagem para gerar um comparativo instantâneo.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Fluxo mockado pronto para evoluir para backend depois.
              </p>
            </div>
          </div>
        </InfoListCard>
        <InfoListCard title="Alertas">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <FileWarning size={20} />
            </div>
            <p className="text-sm text-slate-600">
              Notificações visuais destacam novas obrigações e mudanças de regra por UF.
            </p>
          </div>
        </InfoListCard>
        <InfoListCard title="Próximos passos">
          <p className="text-sm text-slate-600">
            Estrutura pronta para conectar autenticação, APIs fiscais, geração de PDF e persistência real.
          </p>
        </InfoListCard>
      </div>
    </div>
  );
}
