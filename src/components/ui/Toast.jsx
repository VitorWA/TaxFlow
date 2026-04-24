export default function Toast({ open, message }) {
  if (!open || !message) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.28)]">
      {message}
    </div>
  );
}
