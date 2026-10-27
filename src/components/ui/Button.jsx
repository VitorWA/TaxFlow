export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] hover:brightness-105",
    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  return (
    <Component
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
