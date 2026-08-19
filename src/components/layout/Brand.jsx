export default function Brand({ compact = false, dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-300 text-lg font-black text-slate-950">
        TF
      </div>
      {!compact && (
        <div>
          <div className={`text-2xl font-black tracking-tight ${dark ? "text-slate-950" : "text-white"}`}>
            Tax<span className="text-orange-400">Flow</span>
          </div>
          <p className="text-xs text-slate-400">Fiscal intelligence workspace</p>
        </div>
      )}
    </div>
  );
}
