import { ArrowLeft, ArrowRight, Building2, CheckCircle2, KeyRound, Mail, UserSearch } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthField from "../components/auth/AuthField";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { handleCnpjInput, isValidCnpj } from "../utils/cnpj";

const modes = [
  { id: "senha", label: "Recuperar senha", icon: KeyRound },
  { id: "email", label: "Recuperar e-mail", icon: UserSearch },
];

export default function RecoveryPage() {
  const [mode, setMode] = useState("senha");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function changeMode(nextMode) {
    setMode(nextMode);
    setSent(false);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requiredValue = mode === "senha" ? form.get("email") : form.get("cnpj");

    if (!requiredValue?.trim()) {
      setError(mode === "senha" ? "Informe o e-mail cadastrado." : "Informe o CNPJ da empresa.");
      return;
    }
    if (mode === "email" && !isValidCnpj(requiredValue)) {
      setError("Informe um CNPJ válido.");
      return;
    }

    setError("");
    setSent(true);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Ajuda com acesso</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Recupere seu acesso</h1>
        <p className="mt-4 text-base leading-7 text-slate-500">Escolha abaixo o dado que você precisa recuperar.</p>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-2 rounded-3xl bg-slate-100 p-2" role="tablist" aria-label="Tipo de recuperação">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            aria-controls={`recovery-panel-${id}`}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold transition ${mode === id ? "bg-white text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            onClick={() => changeMode(id)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>

      {sent ? (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-center" role="status" aria-live="polite">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
            <CheckCircle2 size={27} />
          </div>
          <h2 className="mt-5 text-xl font-black text-slate-900">Solicitação recebida</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {mode === "senha"
              ? "Se existir uma conta com esse e-mail, você receberá as instruções em alguns minutos."
              : "Se encontrarmos uma conta compatível, enviaremos instruções ao contato de recuperação."}
          </p>
          <Button variant="secondary" className="mt-6" type="button" onClick={() => setSent(false)}>Tentar novamente</Button>
        </div>
      ) : (
        <form id={`recovery-panel-${mode}`} role="tabpanel" className="space-y-5" onSubmit={handleSubmit} noValidate>
          {mode === "senha" ? (
            <>
              <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm leading-6 text-slate-600">Enviaremos um link seguro para você criar uma nova senha.</p>
              <AuthField label="E-mail cadastrado" error={error}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input name="email" type="email" autoComplete="email" inputMode="email" placeholder="voce@empresa.com.br" className="pl-11" aria-invalid={Boolean(error)} />
                </div>
              </AuthField>
              <Button type="submit" className="w-full gap-2 py-3.5">Enviar link de recuperação <ArrowRight size={17} /></Button>
            </>
          ) : (
            <>
              <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm leading-6 text-slate-600">Use os dados da empresa para solicitar ajuda sem expor informações da conta.</p>
              <AuthField label="CNPJ da empresa" error={error}>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    name="cnpj"
                    inputMode="text"
                    autoCapitalize="characters"
                    maxLength={18}
                    placeholder="12.ABC.345/01DE-35"
                    className="pl-11"
                    onInput={handleCnpjInput}
                    aria-invalid={Boolean(error)}
                  />
                </div>
              </AuthField>
              <AuthField label="Telefone para contato" hint="Opcional">
                <Input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" />
              </AuthField>
              <Button type="submit" className="w-full gap-2 py-3.5">Solicitar ajuda <ArrowRight size={17} /></Button>
            </>
          )}
        </form>
      )}

      <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-500">
        <ArrowLeft size={16} />
        Voltar para entrar
      </Link>
    </div>
  );
}
