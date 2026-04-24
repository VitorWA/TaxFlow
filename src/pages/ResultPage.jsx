import { ArrowLeft, Download, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import { currentRules, futureRules, productResult } from "../data/mockData";

const tabs = [
  { id: "geral", label: "Visão Geral" },
  { id: "detalhamento", label: "Detalhamento" },
  { id: "legal", label: "Base Legal" },
  { id: "observacoes", label: "Observações" },
];

function RuleColumn({ title, subtitle, accent, items }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={`px-6 py-5 text-center text-white ${accent}`}>
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="mt-1 text-sm text-white/90">{subtitle}</p>
      </div>
      <div className="p-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 border-b border-slate-100 py-4 last:border-b-0 md:grid-cols-[1fr_1fr]"
          >
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="text-sm text-slate-500">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ResultPage() {
  const [activeTab, setActiveTab] = useState("geral");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#ffffff_100%)] p-4 xl:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <h1 className="text-center text-xl font-black text-slate-900 xl:text-2xl">
            Resultado da Consulta
          </h1>
          <span className="hidden text-sm text-slate-400 xl:block">ID: #CONS-2024-001245</span>
        </div>

        <Card className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-orange-50 text-5xl shadow-inner">
              ⚙️
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">{productResult.product}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-xl font-bold text-slate-800">NCM: {productResult.ncm}</p>
                <Badge>{productResult.badge}</Badge>
              </div>
              <p className="mt-3 text-sm text-slate-500">{productResult.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2">
              <Star size={16} />
              Favoritar
            </Button>
            <Button className="gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </Card>

        <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />

        <div className="grid gap-6 xl:grid-cols-2">
          <RuleColumn
            title="HOJE (Regras Atuais)"
            subtitle="ICMS / PIS / COFINS"
            accent="bg-[linear-gradient(135deg,#fff1e6,#ffe2c8)] text-slate-900"
            items={currentRules}
          />
          <RuleColumn
            title="2026 (Reforma Tributária)"
            subtitle="IBS / CBS"
            accent="bg-[linear-gradient(135deg,#f97316,#fb923c)]"
            items={futureRules}
          />
        </div>

        <div className="rounded-3xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm text-orange-700">
          Atenção: As alíquotas e regras da reforma tributária podem sofrer alterações até 2026.
        </div>
      </div>
    </div>
  );
}
