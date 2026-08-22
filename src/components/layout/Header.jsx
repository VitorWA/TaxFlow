import { Bell, CircleHelp, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ mobileMenuOpen, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const subtitles = {
    "/relatorios": "Acompanhe seus relatorios fiscais e exporte os dados que precisa.",
  };

  const subtitle =
    subtitles[location.pathname] ||
    "Veja o resumo das suas consultas e acompanhe as novidades fiscais.";

  return (
    <header className="flex items-center justify-between gap-4 rounded-[28px] border border-white/60 bg-white/80 px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur xl:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
          title={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 xl:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div className="xl:hidden">
          <Brand compact />
        </div>
        <div className="hidden xl:block">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Olá, {user?.name?.split(" ")[0]}!</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600"
          onClick={() => navigate("/alertas")}
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600">
          <CircleHelp size={18} />
        </button>
      </div>
    </header>
  );
}
