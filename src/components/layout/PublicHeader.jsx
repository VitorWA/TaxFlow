import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "./Brand";
import Button from "../ui/Button";

const navigation = [
  { label: "Recursos", href: "/#recursos" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Reforma Tributária", href: "/#reforma" },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link to="/" aria-label="TaxFlow - página inicial">
          <Brand dark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button as={Link} to="/login" variant="ghost">Entrar</Button>
          <Button as={Link} to="/cadastro">Começar agora</Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-orange-100 bg-white px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-[1240px] flex-col gap-2" aria-label="Navegação móvel">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button as={Link} to="/login" variant="secondary" className="w-full" onClick={() => setMobileOpen(false)}>Entrar</Button>
              <Button as={Link} to="/cadastro" className="w-full" onClick={() => setMobileOpen(false)}>Cadastrar</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
