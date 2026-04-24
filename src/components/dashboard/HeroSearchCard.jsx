import { Image, ScanSearch, Search } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { searchModes } from "../../data/mockData";

const icons = {
  ncm: Search,
  descricao: ScanSearch,
  imagem: Image,
};

export default function HeroSearchCard({ showSearch = true, onSearch }) {
  const [activeTab, setActiveTab] = useState("ncm");

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-6 text-white shadow-[0_24px_70px_rgba(249,115,22,0.35)] xl:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_24%)]" />
      <div className="relative grid gap-8 xl:grid-cols-[1.35fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Nova Consulta</h2>
          <p className="mt-2 text-sm text-orange-50">
            Selecione a forma de consulta do produto
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {searchModes.map((mode) => {
              const Icon = icons[mode.id];
              const active = mode.id === activeTab;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveTab(mode.id)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    active
                      ? "border-white/70 bg-white text-slate-800"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <Icon size={18} className={active ? "text-orange-500" : "text-white"} />
                  <p className="mt-3 text-sm font-semibold">{mode.title}</p>
                  <p className={`mt-1 text-xs ${active ? "text-slate-500" : "text-orange-50"}`}>
                    {mode.helper}
                  </p>
                </button>
              );
            })}
          </div>

          {showSearch && (
            <div className="mt-6 flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-[0_20px_40px_rgba(255,255,255,0.2)] md:flex-row">
              <Input placeholder="Digite o código NCM" className="border-orange-100" />
              <Button className="gap-2 md:min-w-[140px]" onClick={onSearch}>
                <Search size={16} />
                Buscar
              </Button>
            </div>
          )}
        </div>

        <div className="relative hidden xl:flex items-center justify-center">
          <div className="relative w-full max-w-[360px]">
            <div className="absolute -right-2 top-2 h-16 w-16 rounded-3xl bg-white/20 blur-xl" />
            <div className="rounded-[32px] border border-white/30 bg-white/20 p-6 backdrop-blur">
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
                <div className="rounded-[28px] bg-white/90 p-4 text-slate-800 shadow-lg">
                  <div className="rounded-[24px] bg-slate-900 px-4 py-10 text-center text-3xl font-black text-orange-400">
                    TF
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-200" />
                  <div className="mt-3 h-2 w-3/4 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-4">
                  <div className="rounded-[28px] bg-white/90 p-4 shadow-lg">
                    <div className="h-3 rounded-full bg-orange-200" />
                    <div className="mt-3 h-3 rounded-full bg-slate-200" />
                    <div className="mt-3 h-3 w-4/5 rounded-full bg-slate-200" />
                  </div>
                  <div className="rounded-[28px] bg-white/90 p-4 shadow-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 rounded-2xl bg-orange-100" />
                      <div className="h-16 rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
