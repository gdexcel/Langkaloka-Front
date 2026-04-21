//langkaloka-v1\components\store\StoreCard.tsx
import { Store } from "lucide-react";

interface StoreCardProps {
  store: {
    id: string;
    name: string;
    image?: string | null;
  };
  onClick?: () => void;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <div
      onClick={onClick}
      className="min-w-0 flex flex-col items-center gap-2 p-3 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
    >
      {store.image ? (
        <img
          src={store.image}
          alt={store.name}
          draggable={false}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-400 group-hover:shadow-md transition-all duration-200 shadow-sm flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-yellow-300 flex items-center justify-center font-bold text-yellow-700 text-xl border-2 border-gray-100 group-hover:border-blue-400 group-hover:shadow-md transition-all duration-200 shadow-sm select-none flex-shrink-0">
          {store.name?.charAt(0)?.toUpperCase() || (
            <Store className="h-5 w-5" />
          )}
        </div>
      )}
      <p
        className="text-[11px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center leading-tight select-none w-full"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
          minHeight: "2.4em",
        }}
      >
        {store.name}
      </p>
    </div>
  );
}
