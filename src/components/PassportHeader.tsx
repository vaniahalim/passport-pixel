import { useState, useMemo } from "react";
import { City } from "@/data/cities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PassportHeaderProps {
  citiesCount: number;
  countriesCount: number;
  visitedCities?: City[];
}

const PassportHeader = ({ citiesCount, countriesCount, visitedCities = [] }: PassportHeaderProps) => {
  const [open, setOpen] = useState(false);

  const groupedByCountry = useMemo(() => {
    const groups: Record<string, City[]> = {};
    for (const city of visitedCities) {
      if (!groups[city.country]) groups[city.country] = [];
      groups[city.country].push(city);
    }
    // Sort countries alphabetically, then cities within each country
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, cities]) => ({
        country,
        cities: [...cities].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [visitedCities]);

  return (
    <header className="bg-card pixel-border-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-bounce-pixel">✈️</div>
          <div>
            <h1 className="text-lg sm:text-xl font-pixel pixel-text-shadow text-foreground leading-relaxed">
              PASSPORT PIXEL
            </h1>
            <p className="font-retro text-xl text-muted-foreground mt-1">
              Your Digital Travel Log
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex gap-4 cursor-pointer group">
              <div className="bg-pixel-green pixel-border-sm px-4 py-3 text-center group-hover:brightness-110 transition">
                <div className="font-pixel text-lg text-primary-foreground">{citiesCount}</div>
                <div className="font-retro text-sm text-primary-foreground">CITIES</div>
              </div>
              <div className="bg-pixel-blue pixel-border-sm px-4 py-3 text-center group-hover:brightness-110 transition">
                <div className="font-pixel text-lg text-secondary-foreground">{countriesCount}</div>
                <div className="font-retro text-sm text-secondary-foreground">COUNTRIES</div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="pixel-border bg-card max-w-md">
            <DialogHeader>
              <DialogTitle className="font-pixel text-xs text-card-foreground">
                🌍 VISITED PLACES ({citiesCount} cities, {countriesCount} countries)
              </DialogTitle>
            </DialogHeader>
            {groupedByCountry.length === 0 ? (
              <p className="font-retro text-lg text-muted-foreground text-center py-4">
                No cities visited yet! Start adding some 🗺️
              </p>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4 pr-3">
                  {groupedByCountry.map(({ country, cities }) => (
                    <div key={country}>
                      <h3 className="font-pixel text-[9px] text-accent mb-1.5 sticky top-0 bg-card py-1">
                        {country} ({cities.length})
                      </h3>
                      <div className="space-y-1 ml-2">
                        {cities.map((city) => (
                          <div key={city.name} className="flex items-center gap-2 font-retro text-lg text-foreground">
                            <span>{city.emoji}</span>
                            <span>{city.name}</span>
                            {city.date && (
                              <span className="text-muted-foreground text-sm ml-auto">{city.date}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default PassportHeader;
