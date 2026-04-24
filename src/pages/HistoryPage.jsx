import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Eye, Filter, Search } from "lucide-react";
import InfoListCard from "../components/common/InfoListCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import Toast from "../components/ui/Toast";
import { historyRecords } from "../data/historyMock";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function handleOpenDetails(record) {
    setSelectedRecord(record);
    setDetailsOpen(true);
  }

  return (
    <>
      <InfoListCard title="Historico de Consultas" className="min-h-[720px]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Buscar consulta..." className="pl-11" />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Data</th>
                  <th className="px-4 py-4">Produto</th>
                  <th className="px-4 py-4">NCM</th>
                  <th className="px-4 py-4">Tipo de Consulta</th>
                  <th className="px-4 py-4">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100 text-sm">
                    <td className="px-4 py-4 text-slate-500">{record.date}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{record.product}</td>
                    <td className="px-4 py-4 text-slate-500">{record.ncm}</td>
                    <td className="px-4 py-4 text-slate-500">{record.type}</td>
                    <td className="px-4 py-4">
                      <button
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:text-orange-500"
                        onClick={() => handleOpenDetails(record)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400">
            <ChevronLeft size={18} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white">
            1
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-sm text-slate-500">
            2
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-sm text-slate-500">
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-sm text-slate-500">
            12
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </InfoListCard>

      <Modal
        open={detailsOpen}
        title="Detalhes da Consulta"
        onClose={() => setDetailsOpen(false)}
        maxWidth="max-w-5xl"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
              Fechar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDetailsOpen(false);
                navigate("/resultado");
              }}
            >
              Ver resultado completo
            </Button>
            <Button className="gap-2" onClick={() => setToastMessage("Download iniciado")}>
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        }
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-3xl font-black tracking-tight text-slate-900">
                  {selectedRecord.product}
                </h4>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-slate-700">NCM: {selectedRecord.ncm}</p>
                  <Badge tone="success">{selectedRecord.status}</Badge>
                </div>
              </div>
              <div className="rounded-3xl bg-orange-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Data da consulta</p>
                <p className="mt-1">{selectedRecord.date}</p>
                <p className="mt-3 font-semibold text-slate-800">Tipo</p>
                <p className="mt-1">{selectedRecord.type}</p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <h5 className="text-xl font-black tracking-tight text-slate-900">
                  Resultado fiscal resumido
                </h5>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CFOP</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.cfop}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CST ICMS</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.cstIcms}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">Aliquota ICMS</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.aliquotaIcms}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CEST</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.cest}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CST PIS</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.cstPis}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CST COFINS</span>
                    <span className="text-slate-900">{selectedRecord.fiscal.cstCofins}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <h5 className="text-xl font-black tracking-tight text-slate-900">
                  Resultado Reforma Tributaria 2026
                </h5>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">IBS</span>
                    <span className="text-slate-900">{selectedRecord.reform2026.ibs}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">CBS</span>
                    <span className="text-slate-900">{selectedRecord.reform2026.cbs}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">Situacao IBS/CBS</span>
                    <span className="text-right text-slate-900">
                      {selectedRecord.reform2026.situacao}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                    Observacao fiscal
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{selectedRecord.note}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Toast open={Boolean(toastMessage)} message={toastMessage} />
    </>
  );
}
