import {
  ArrowRight,
  BellRing,
  Check,
  FileBarChart,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/layout/PublicHeader";
import Brand from "../components/layout/Brand";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const features = [
  {
    icon: ScanSearch,
    title: "Consulta inteligente",
    description: "Encontre a classificação fiscal por NCM, descrição ou imagem do produto.",
    tone: "bg-orange-50 text-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Comparativo tributário",
    description: "Visualize regras atuais e os impactos previstos de IBS e CBS lado a lado.",
    tone: "bg-violet-50 text-violet-500",
  },
  {
    icon: BellRing,
    title: "Alertas relevantes",
    description: "Acompanhe mudanças de legislação e atualizações que afetam sua operação.",
    tone: "bg-blue-50 text-blue-500",
  },
  {
    icon: FileBarChart,
    title: "Relatórios organizados",
    description: "Consolide consultas e indicadores para apoiar decisões fiscais com clareza.",
    tone: "bg-emerald-50 text-emerald-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Informe o produto",
    description: "Use o código NCM, descreva a mercadoria ou envie uma imagem.",
  },
  {
    number: "02",
    title: "Analise as regras",
    description: "Receba uma visão organizada dos principais enquadramentos tributários.",
  },
  {
    number: "03",
    title: "Tome sua decisão",
    description: "Compare cenários, salve consultas e acompanhe alterações importantes.",
  },
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -left-8 top-16 h-36 w-36 rounded-full bg-amber-300/40 blur-3xl" />
      <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-violet-300/30 blur-3xl" />

      <div className="relative rounded-[36px] border border-white/80 bg-white/90 p-5 shadow-[0_32px_90px_rgba(124,45,18,0.18)] backdrop-blur sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Search size={25} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Resultado da consulta</p>
              <h3 className="mt-1 text-lg font-black text-slate-900">Válvula de retenção</h3>
            </div>
          </div>
          <Badge>NCM válido</Badge>
        </div>

        <div className="mt-5 rounded-3xl bg-[#071427] p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">NCM identificado</p>
              <p className="mt-1 text-2xl font-black tracking-tight">8481.30.00</p>
            </div>
            <ShieldCheck size={28} className="text-emerald-400" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">Regras atuais</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">CFOP</span><strong>5.102</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">ICMS</span><strong>18%</strong></div>
            </div>
          </div>
          <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-500">Reforma Tributária</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">IBS</span><strong>17,70%</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">CBS</span><strong>8,80%</strong></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          <Check size={16} />
          Consulta concluída e pronta para análise
        </div>
      </div>

      <div className="absolute -bottom-8 -left-4 hidden items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Sparkles size={17} />
        </div>
        <div>
          <p className="text-xs text-slate-400">Preparação 2026</p>
          <p className="text-sm font-black text-slate-900">78% concluída</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fffaf6] text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden px-5 pb-24 pt-16 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-orange-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-bold text-orange-600 shadow-sm">
                <Sparkles size={16} />
                Sua operação pronta para o novo cenário tributário
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl xl:text-7xl">
                Clareza fiscal do <span className="text-orange-500">NCM</span> à Reforma Tributária.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Consulte produtos, compare regras e acompanhe mudanças fiscais em uma experiência simples, organizada e preparada para sua empresa.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button as={Link} to="/cadastro" className="w-full gap-2 px-6 py-3.5 sm:w-auto">
                  Criar minha conta
                  <ArrowRight size={17} />
                </Button>
                <Button as="a" href="#como-funciona" variant="secondary" className="w-full px-6 py-3.5 sm:w-auto">
                  Ver como funciona
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />Consulta centralizada</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />Visão atual e futura</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />Dados organizados</span>
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="border-y border-orange-100 bg-white px-5 py-7 lg:px-8">
          <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <p className="text-sm font-semibold text-slate-500">Uma visão única para diferentes necessidades fiscais</p>
            <div className="flex flex-wrap items-center justify-center gap-7 text-sm font-black text-slate-400 sm:gap-12">
              <span>CONTABILIDADE</span>
              <span>FISCAL</span>
              <span>COMPRAS</span>
              <span>GESTÃO</span>
            </div>
          </div>
        </section>

        <section id="recursos" className="scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">Recursos</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Informação fiscal que vira decisão.</h2>
              <p className="mt-5 text-base leading-8 text-slate-500">O TaxFlow organiza os pontos essenciais da rotina tributária em uma experiência clara e direta.</p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, description, tone }) => (
                <article key={title} className="rounded-[30px] border border-orange-100 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-6 text-xl font-black text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 bg-[#071427] px-5 py-24 text-white lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-400">Como funciona</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Da dúvida ao direcionamento em três passos.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">Uma jornada simples para consultar, entender e acompanhar o cenário tributário dos seus produtos.</p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {steps.map((step) => (
                <article key={step.number} className="rounded-[30px] border border-white/10 bg-white/[0.06] p-7">
                  <span className="text-4xl font-black text-orange-400">{step.number}</span>
                  <h3 className="mt-8 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="reforma" className="scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-12 overflow-hidden rounded-[40px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-8 text-white shadow-[0_35px_90px_rgba(249,115,22,0.25)] sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-16">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-950/60">Reforma Tributária</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Prepare hoje o cadastro que sua empresa usará amanhã.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-orange-950/75">Visualize a transição para IBS e CBS, identifique produtos que precisam de revisão e acompanhe a evolução do seu cadastro.</p>
              <Link to="/cadastro" className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:bg-slate-800">
                Preparar minha empresa
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/40 bg-white/20 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-orange-950/65">Produtos analisados</p>
                <p className="mt-3 text-4xl font-black">1.248</p>
              </div>
              <div className="rounded-[28px] border border-white/40 bg-white/20 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-orange-950/65">Prontos para 2026</p>
                <p className="mt-3 text-4xl font-black">972</p>
              </div>
              <div className="rounded-[28px] border border-white/40 bg-white/20 p-6 backdrop-blur sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-orange-950/65">Preparação do cadastro</span>
                  <strong className="text-2xl">78%</strong>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-orange-950/15">
                  <div className="h-full w-[78%] rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Sua rotina fiscal pode ser mais simples.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500">Crie sua conta e conheça uma nova forma de organizar consultas e acompanhar o cenário tributário.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/cadastro" className="w-full gap-2 px-6 py-3.5 sm:w-auto">Começar agora <ArrowRight size={17} /></Button>
              <Button as={Link} to="/login" variant="secondary" className="w-full px-6 py-3.5 sm:w-auto">Já tenho uma conta</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-orange-100 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <Brand dark />
          <div className="text-sm text-slate-400 md:text-center">
            <p>© 2026 TaxFlow. Inteligência para uma gestão fiscal mais clara.</p>
            <p className="mt-1 text-xs">Protótipo em evolução — informações demonstrativas.</p>
          </div>
          <div className="flex gap-5 text-sm font-semibold text-slate-500">
            <a href="#recursos" className="hover:text-orange-500">Recursos</a>
            <Link to="/login" className="hover:text-orange-500">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
