import { useState, useMemo } from "react";
import { POPULAR_CITIES, City } from "@/data/cities";
import PixelButton from "./PixelButton";

interface CityPickerProps {
  visitedCities: City[];
  onAddCity: (city: City) => void;
}

const CityPicker = ({ visitedCities, onAddCity }: CityPickerProps) => {
  const [search, setSearch] = useState("");

  const visitedNames = new Set(visitedCities.map((c) => c.name));

  const filtered = useMemo(
    () =>
      POPULAR_CITIES.filter(
        (city) =>
          !visitedNames.has(city.name) &&
          (city.name.toLowerCase().includes(search.toLowerCase()) ||
            city.country.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, visitedNames]
  );

  return (
    <div className="pixel-border bg-card p-4">
      <h2 className="font-pixel text-xs text-card-foreground mb-3">📍 ADD CITY</h2>
      <input
        type="text"
        placeholder="Search cities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 mb-3 outline-none placeholder:text-muted-foreground"
      />
      <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((city) => (
          <button
            key={city.name}
            onClick={() => {
              onAddCity({ ...city, date: new Date().toLocaleDateString() });
              setSearch("");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer pixel-border-sm text-left group"
          >
            <span className="text-lg">{city.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="font-pixel text-[8px] block truncate">{city.name}</span>
              <span className="font-retro text-sm text-muted-foreground group-hover:text-primary-foreground block">
                {city.country}
              </span>
            </div>
            <span className="font-pixel text-[8px] text-primary group-hover:text-primary-foreground">+ADD</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="font-retro text-lg text-muted-foreground text-center py-4">
            No cities found! 🔍
          </p>
        )}
      </div>
    </div>
  );
};

export default CityPicker;
