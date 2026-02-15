import { City } from "@/data/cities";
import { useState } from "react";

interface VisitedListProps {
  cities: City[];
  onRemove: (name: string) => void;
  onToggleLike?: (name: string) => void;
  onUpdateDescription?: (name: string, description: string) => void;
}

const VisitedList = ({ cities, onRemove, onToggleLike, onUpdateDescription }: VisitedListProps) => {
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [draftDesc, setDraftDesc] = useState("");

  if (cities.length === 0) {
    return (
      <div className="pixel-border bg-card p-6 text-center">
        <div className="text-4xl mb-3">🌍</div>
        <p className="font-pixel text-[10px] text-card-foreground">NO STAMPS YET!</p>
        <p className="font-retro text-lg text-muted-foreground mt-1">
          Add cities to start your adventure
        </p>
      </div>
    );
  }

  return (
    <div className="pixel-border bg-card p-4">
      <h2 className="font-pixel text-xs text-card-foreground mb-3">
        🛂 PASSPORT STAMPS ({cities.length})
      </h2>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {cities.map((city) => (
          <div
            key={city.name}
            className="px-3 py-2 bg-muted pixel-border-sm group"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike?.(city.name)}
                className="text-lg cursor-pointer hover:scale-110 transition-transform"
                title={city.liked ? "Unlike" : "Like"}
              >
                {city.liked ? "❤️" : city.emoji}
              </button>
              <div className="flex-1 min-w-0">
                <span className="font-pixel text-[8px] block truncate text-foreground">{city.name}</span>
                <span className="font-retro text-sm text-muted-foreground">
                  {city.country}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingCity(editingCity === city.name ? null : city.name);
                  setDraftDesc(city.description ?? "");
                }}
                className="text-base text-muted-foreground hover:text-foreground cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                title="Add note"
              >
                📝
              </button>
              <button
                onClick={() => onRemove(city.name)}
                className="text-base text-accent hover:text-accent/80 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
            {city.description && editingCity !== city.name && (
              <p className="font-retro text-sm text-muted-foreground mt-1 pl-8 italic">
                "{city.description}"
              </p>
            )}
            {editingCity === city.name && (
              <div className="mt-2 pl-8 flex gap-1">
                <input
                  className="flex-1 font-retro text-sm bg-background text-foreground px-2 py-1 pixel-border-sm outline-none"
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value.slice(0, 500))}
                  placeholder="Add a memory... (max 500 chars)"
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateDescription?.(city.name, draftDesc);
                      setEditingCity(null);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    onUpdateDescription?.(city.name, draftDesc);
                    setEditingCity(null);
                  }}
                  className="font-pixel text-[8px] bg-primary text-primary-foreground px-2 py-1 pixel-border-sm cursor-pointer"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitedList;
