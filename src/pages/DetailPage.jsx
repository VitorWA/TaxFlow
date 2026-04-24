import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import { fiscalDetails } from "../data/mockData";

const tabs = [
  { id: "atual", label: "Tributação Atual (ICMS/PIS/COFINS)" },
  { id: "reforma", label: "Reforma Tributária 2026 (IBS/CBS)" },
];

function DetailSection({ title, items }) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_1.2fr]"
          >
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="text-sm text-slate-500">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DetailPage() {
  const [activeTab, setActiveTab] = useState("atual");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#ffffff_100%)] p-4 xl:p-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900">Detalhamento Fiscal</h1>
        </div>

        <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />

        <div className="space-y-5">
          <DetailSection title="Informações Gerais" items={fiscalDetails.general} />
          <DetailSection title="ICMS" items={fiscalDetails.icms} />
          <DetailSection title="PIS / COFINS" items={fiscalDetails.pisCofins} />
          <DetailSection title="Legislação" items={fiscalDetails.legal} />
          <Card>
            <h3 className="text-lg font-bold text-slate-900">Observações</h3>
            <div className="mt-4 space-y-3">
              {fiscalDetails.notes.map((note) => (
                <div key={note} className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
                  {note}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
