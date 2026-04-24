import { MoreVertical, Search, Star } from "lucide-react";
import InfoListCard from "../components/common/InfoListCard";
import Input from "../components/ui/Input";
import { favorites } from "../data/mockData";

export default function FavoritesPage() {
  return (
    <div className="w-full max-w-none">
      <InfoListCard title="Favoritos" className="min-h-[720px] w-full">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="Buscar favorito..." className="pl-11" />
        </div>

        <div className="w-full space-y-3">
          {favorites.map((item) => (
            <div
              key={item.ncm}
              className="flex w-full items-center gap-4 rounded-3xl border border-slate-100 px-4 py-4 transition hover:border-orange-100 hover:bg-orange-50/40"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">{item.ncm}</p>
                <p className="mt-1 text-sm text-slate-600">{item.product}</p>
                <p className="mt-1 text-xs text-slate-400">{item.updatedAt}</p>
              </div>
              <button className="text-orange-500">
                <Star size={18} fill="currentColor" />
              </button>
              <button className="text-slate-400">
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </div>
      </InfoListCard>
    </div>
  );
}
