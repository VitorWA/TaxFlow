import { ArrowRight, CheckCircle2, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthField from "../components/auth/AuthField";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const accountCreated = location.state?.accountCreated;

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.trim();
    const password = form.get("password")?.trim();
    const nextErrors = {};

    if (!email) nextErrors.email = "Informe seu e-mail.";
    if (!password) nextErrors.password = "Informe sua senha.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      navigate("/dashboard");
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Acesse sua conta</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Bem-vindo de volta</h1>
        <p className="mt-4 text-base leading-7 text-slate-500">Entre para acessar suas consultas, alertas e relatórios.</p>
      </div>

      {accountCreated && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <span>Sua conta foi criada. Agora você já pode entrar.</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField label="E-mail" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@empresa.com.br"
              className="pl-11"
              aria-invalid={Boolean(errors.email)}
            />
          </div>
        </AuthField>

        <AuthField label="Senha" error={errors.password}>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={18} />
            <PasswordInput
              name="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className="pl-11 pr-12"
              aria-invalid={Boolean(errors.password)}
            />
          </div>
        </AuthField>

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3 font-medium text-slate-600">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 accent-orange-500" />
            Lembrar de mim
          </label>
          <Link to="/recuperar-acesso" className="font-bold text-orange-500 transition hover:text-orange-600">Esqueci minha senha ou e-mail</Link>
        </div>

        <Button type="submit" className="w-full gap-2 py-3.5">
          Entrar
          <ArrowRight size={17} />
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-100/80 px-4 py-3 text-center text-xs leading-5 text-slate-500">
        Ambiente demonstrativo: a autenticação real será conectada ao backend em uma próxima etapa.
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Ainda não tem uma conta?{" "}
        <Link to="/cadastro" className="font-black text-orange-500 hover:text-orange-600">Criar conta</Link>
      </p>
    </div>
  );
}
