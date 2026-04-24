import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { companySettings } from "../data/mockData";

function Toggle({ enabled }) {
  return (
    <div
      className={`relative h-7 w-12 rounded-full transition ${
        enabled ? "bg-orange-500" : "bg-slate-200"
      }`}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="w-full max-w-none">
      <Card className="w-full">
        <h2 className="text-2xl font-black text-slate-900">Configurações</h2>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Empresa</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Razão Social</span>
                <Input value={companySettings.companyName} readOnly />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">CNPJ</span>
                <Input value={companySettings.cnpj} readOnly />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Estado</span>
                <Input value={companySettings.state} readOnly />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Preferências</h3>
            <div className="mt-4 space-y-5">
              <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Regime Tributário</span>
                  <Input value={companySettings.regime} readOnly />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Exibição de Alíquotas</p>
                  <p className="text-xs text-slate-500">Mostrar alíquotas efetivas</p>
                </div>
                <Toggle enabled={companySettings.showRates} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Notificações por e-mail</p>
                  <p className="text-xs text-slate-500">Receber alertas fiscais e atualizações</p>
                </div>
                <Toggle enabled={companySettings.notifications} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button>Salvar alterações</Button>
        </div>
      </Card>
    </div>
  );
}
