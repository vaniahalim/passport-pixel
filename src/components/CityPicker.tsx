import { useState, useMemo, useEffect, useRef } from "react";
import { POPULAR_CITIES, City } from "@/data/cities";


interface CityPickerProps {
  visitedCities: City[];
  onAddCity: (city: City) => void;
}

const CityPicker = ({ visitedCities, onAddCity }: CityPickerProps) => {
  const [search, setSearch] = useState("");
  const [apiResults, setApiResults] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const visitedNames = new Set(visitedCities.map((c) => `${c.name}|${c.country}`));

  // Local filtered results for quick display
  const localFiltered = useMemo(
    () =>
      POPULAR_CITIES.filter(
        (city) =>
          !visitedNames.has(`${city.name}|${city.country}`) &&
          (city.name.toLowerCase().includes(search.toLowerCase()) ||
            city.country.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 20),
    [search, visitedNames]
  );

  // Debounced API search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim().length < 2) {
      setApiResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-cities?q=${encodeURIComponent(search.trim())}`;
        const res = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });

        if (res.ok) {
          const cities: City[] = await res.json();
          setApiResults(cities);
        }
      } catch (e) {
        console.error("City search error:", e);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Merge: API results first, then local matches not already in API results
  const combined = useMemo(() => {
    const apiFiltered = apiResults.filter(
      (c) => !visitedNames.has(`${c.name}|${c.country}`)
    );
    const apiKeys = new Set(apiFiltered.map((c) => `${c.name}|${c.country}`));
    const localOnly = localFiltered.filter(
      (c) => !apiKeys.has(`${c.name}|${c.country}`)
    );
    return [...apiFiltered, ...localOnly].slice(0, 25);
  }, [apiResults, localFiltered, visitedNames]);

  const displayResults = search.trim().length >= 2 ? combined : localFiltered;

  return (
    <div className="pixel-border bg-card p-4">
      <h2 className="font-pixel text-xs text-card-foreground mb-3">📍 ADD CITY</h2>
      <input
        type="text"
        placeholder="Search any city worldwide..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 mb-3 outline-none placeholder:text-muted-foreground"
      />
      {searching && (
        <p className="font-retro text-sm text-muted-foreground mb-2 animate-pulse">🔍 Searching worldwide...</p>
      )}
      <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
        {displayResults.map((city) => (
          <button
            key={`${city.name}-${city.country}`}
            onClick={() => {
              onAddCity({ ...city });
              setSearch("");
              setApiResults([]);
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
        {displayResults.length === 0 && !searching && (
          <p className="font-retro text-lg text-muted-foreground text-center py-4">
            No cities found! 🔍
          </p>
        )}
      </div>
    </div>
  );
};

export default CityPicker;
