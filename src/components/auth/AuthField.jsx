export default function AuthField({ label, error, hint, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs font-medium text-red-500">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}
