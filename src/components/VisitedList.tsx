import { City } from "@/data/cities";

interface VisitedListProps {
  cities: City[];
  onRemove: (name: string) => void;
}

const VisitedList = ({ cities, onRemove }: VisitedListProps) => {
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
            className="flex items-center gap-2 px-3 py-2 bg-muted pixel-border-sm group"
          >
            <span className="text-lg">{city.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="font-pixel text-[8px] block truncate text-foreground">{city.name}</span>
              <span className="font-retro text-sm text-muted-foreground">
                {city.country} {city.date && `• ${city.date}`}
              </span>
            </div>
            <button
              onClick={() => onRemove(city.name)}
              className="font-pixel text-[8px] text-accent hover:text-accent/80 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitedList;
