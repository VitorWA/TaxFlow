import Card from "../ui/Card";

export default function InfoListCard({ title, action, children, className = "" }) {
  return (
    <Card className={className}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}
