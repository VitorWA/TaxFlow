import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import Brand from "./Brand";

const benefits = [
  "Consultas fiscais organizadas em um só lugar",
  "Comparativo entre regras atuais e IBS/CBS",
  "Alertas para acompanhar mudanças tributárias",
];

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-[#fffaf6] lg:grid lg:grid-cols-[minmax(380px,0.9fr)_minmax(560px,1.1fr)]">
      <section className="relative hidden overflow-hidden bg-[#071427] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-28 top-1/3 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

        <Link to="/" className="relative inline-flex self-start" aria-label="Voltar para o TaxFlow">
          <Brand />
        </Link>

        <div className="relative my-auto max-w-xl py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-200">
            <Sparkles size={16} />
            Inteligência fiscal para decisões melhores
          </div>
          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight xl:text-5xl">
            Simplifique a rotina fiscal da sua empresa.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
            Consulte produtos, acompanhe mudanças legais e prepare seu cadastro para a Reforma Tributária.
          </p>

          <div className="mt-10 space-y-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 size={19} className="shrink-0 text-orange-400" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-slate-400">
          <ShieldCheck size={17} className="text-emerald-400" />
          Ambiente protegido e preparado para sua operação fiscal
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <Link to="/" className="lg:hidden" aria-label="TaxFlow - página inicial">
            <Brand compact dark />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500"
          >
            <ArrowLeft size={16} />
            Voltar para o início
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-1 items-center py-10">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
