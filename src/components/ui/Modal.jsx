import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children, footer, maxWidth = "max-w-3xl" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} rounded-[32px] border border-white/60 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]`}>
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <h3 className="text-2xl font-black tracking-tight text-slate-900">{title}</h3>
          <button
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:text-orange-500"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-slate-100 px-6 py-5">{footer}</div>}
      </div>
    </div>
  );
}
