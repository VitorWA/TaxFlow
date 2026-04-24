import { useEffect, useRef } from "react";

export default function DropdownMenu({ open, onClose, items, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`absolute right-0 top-12 z-30 min-w-[220px] rounded-3xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${className}`}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
            item.danger
              ? "text-red-500 hover:bg-red-50"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
