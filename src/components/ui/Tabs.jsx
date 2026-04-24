export default function Tabs({ items, activeId, onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-orange-200 bg-orange-50 text-orange-600"
                : "border-slate-200 bg-white text-slate-500 hover:border-orange-100 hover:text-orange-500"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
