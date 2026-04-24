export default function Badge({ children, tone = "success" }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-200",
    warning: "bg-orange-50 text-orange-600 border-orange-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
