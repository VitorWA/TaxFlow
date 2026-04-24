export default function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </section>
  );
}
