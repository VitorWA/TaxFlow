export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${className}`}
      {...props}
    />
  );
}
