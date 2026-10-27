import { ArrowRight, Building2, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../components/auth/AuthField";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const nextErrors = {};

    if (!values.name?.trim()) nextErrors.name = "Informe seu nome completo.";
    if (!values.email?.trim()) nextErrors.email = "Informe seu e-mail profissional.";
    if (!values.password || values.password.length < 8) nextErrors.password = "A senha precisa ter pelo menos 8 caracteres.";
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = "As senhas não coincidem.";
    if (!values.terms) nextErrors.terms = "Você precisa aceitar os termos para continuar.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      navigate("/login", { state: { accountCreated: true } });
    }
  }

  return (
    <div className="w-full py-4">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Primeiros passos</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Crie sua conta</h1>
        <p className="mt-4 text-base leading-7 text-slate-500">Comece a organizar suas consultas e acompanhar mudanças fiscais.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField label="Nome completo" error={errors.name}>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input name="name" autoComplete="name" placeholder="Seu nome completo" className="pl-11" aria-invalid={Boolean(errors.name)} />
          </div>
        </AuthField>

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField label="Empresa" hint="Opcional">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input name="company" autoComplete="organization" placeholder="Nome da empresa" className="pl-11" />
            </div>
          </AuthField>
          <AuthField label="CNPJ" hint="Opcional">
            <Input name="cnpj" inputMode="numeric" placeholder="00.000.000/0000-00" />
          </AuthField>
        </div>

        <AuthField label="E-mail profissional" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input name="email" type="email" autoComplete="email" inputMode="email" placeholder="voce@empresa.com.br" className="pl-11" aria-invalid={Boolean(errors.email)} />
          </div>
        </AuthField>

        <AuthField label="Senha" error={errors.password} hint="Use pelo menos 8 caracteres.">
          <PasswordInput name="password" autoComplete="new-password" placeholder="Crie uma senha segura" aria-invalid={Boolean(errors.password)} />
        </AuthField>

        <AuthField label="Confirmar senha" error={errors.confirmPassword}>
          <PasswordInput name="confirmPassword" autoComplete="new-password" placeholder="Digite a senha novamente" aria-invalid={Boolean(errors.confirmPassword)} />
        </AuthField>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
            <input type="checkbox" name="terms" className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-orange-500" />
            <span>Li e aceito os <strong className="font-bold text-slate-700">Termos de Uso</strong> e a <strong className="font-bold text-slate-700">Política de Privacidade</strong>.</span>
          </label>
          {errors.terms && <p className="mt-2 text-xs font-medium text-red-500" role="alert">{errors.terms}</p>}
        </div>

        <Button type="submit" className="w-full gap-2 py-3.5">
          Criar conta
          <ArrowRight size={17} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Já tem uma conta?{" "}
        <Link to="/login" className="font-black text-orange-500 hover:text-orange-600">Entrar</Link>
      </p>
    </div>
  );
}
