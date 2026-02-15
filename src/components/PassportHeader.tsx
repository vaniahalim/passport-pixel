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

const COUNTRY_TO_CODE: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Argentina": "AR", "Armenia": "AM",
  "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH",
  "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ",
  "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", "Brunei": "BN",
  "Bulgaria": "BG", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Chile": "CL",
  "China": "CN", "Colombia": "CO", "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU",
  "Cyprus": "CY", "Czech Republic": "CZ", "Denmark": "DK", "Dominican Republic": "DO",
  "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Estonia": "EE", "Ethiopia": "ET",
  "Fiji": "FJ", "Finland": "FI", "France": "FR", "Georgia": "GE", "Germany": "DE",
  "Ghana": "GH", "Greece": "GR", "Guatemala": "GT", "Honduras": "HN", "Hong Kong": "HK",
  "Hungary": "HU", "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR",
  "Iraq": "IQ", "Ireland": "IE", "Israel": "IL", "Italy": "IT", "Jamaica": "JM",
  "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kuwait": "KW",
  "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lithuania": "LT", "Luxembourg": "LU",
  "Madagascar": "MG", "Malaysia": "MY", "Maldives": "MV", "Malta": "MT", "Mauritius": "MU",
  "Mexico": "MX", "Moldova": "MD", "Mongolia": "MN", "Montenegro": "ME", "Morocco": "MA",
  "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nepal": "NP", "Netherlands": "NL",
  "New Zealand": "NZ", "Nicaragua": "NI", "Nigeria": "NG", "North Macedonia": "MK",
  "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palestine": "PS", "Panama": "PA",
  "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL", "Portugal": "PT",
  "Qatar": "QA", "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saudi Arabia": "SA",
  "Senegal": "SN", "Serbia": "RS", "Singapore": "SG", "Slovakia": "SK", "Slovenia": "SI",
  "South Africa": "ZA", "South Korea": "KR", "Spain": "ES", "Sri Lanka": "LK", "Sweden": "SE",
  "Switzerland": "CH", "Taiwan": "TW", "Tanzania": "TZ", "Thailand": "TH", "Trinidad and Tobago": "TT",
  "Tunisia": "TN", "Turkey": "TR", "UAE": "AE", "Uganda": "UG", "UK": "GB",
  "Ukraine": "UA", "Uruguay": "UY", "USA": "US", "Uzbekistan": "UZ", "Venezuela": "VE",
  "Vietnam": "VN", "Zimbabwe": "ZW",
};

const countryFlag = (country: string): string => {
  const code = COUNTRY_TO_CODE[country];
  if (!code) return "🏳️";
  return String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
};

interface PassportHeaderProps {
  citiesCount: number;
  countriesCount: number;
  visitedCities?: City[];
}

const PassportHeader = ({ citiesCount, countriesCount, visitedCities = [] }: PassportHeaderProps) => {
  const [openDialog, setOpenDialog] = useState<"cities" | "countries" | "loved" | null>(null);

  const lovedCities = useMemo(() => visitedCities.filter(c => c.liked), [visitedCities]);

  const groupedByCountry = useMemo(() => {
    const groups: Record<string, City[]> = {};
    for (const city of visitedCities) {
      if (!groups[city.country]) groups[city.country] = [];
      groups[city.country].push(city);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, cities]) => ({
        country,
        cities: [...cities].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [visitedCities]);

  const uniqueCountries = useMemo(() =>
    [...new Set(visitedCities.map(c => c.country))].sort(),
    [visitedCities]
  );

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

        <div className="flex gap-4">
          <div
            className="bg-pixel-green pixel-border-sm px-4 py-3 text-center cursor-pointer hover:brightness-110 transition"
            onClick={() => setOpenDialog("cities")}
          >
            <div className="font-pixel text-lg text-primary-foreground">{citiesCount}</div>
            <div className="font-retro text-sm text-primary-foreground">CITIES</div>
          </div>
          <div
            className="bg-pixel-blue pixel-border-sm px-4 py-3 text-center cursor-pointer hover:brightness-110 transition"
            onClick={() => setOpenDialog("countries")}
          >
            <div className="font-pixel text-lg text-secondary-foreground">{countriesCount}</div>
            <div className="font-retro text-sm text-secondary-foreground">COUNTRIES</div>
          </div>
          <div
            className="bg-accent pixel-border-sm px-4 py-3 text-center cursor-pointer hover:brightness-110 transition"
            onClick={() => setOpenDialog("loved")}
          >
            <div className="font-pixel text-lg text-accent-foreground">{lovedCities.length}</div>
            <div className="font-retro text-sm text-accent-foreground">❤️ LOVED</div>
          </div>
        </div>
      </div>

      {/* Cities dialog */}
      <Dialog open={openDialog === "cities"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent className="pixel-border bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs text-card-foreground">
              🏙️ VISITED CITIES ({citiesCount})
            </DialogTitle>
          </DialogHeader>
          {groupedByCountry.length === 0 ? (
            <p className="font-retro text-lg text-muted-foreground text-center py-4">
              No cities visited yet! 🗺️
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
                          <span>{city.liked ? "❤️" : city.emoji}</span>
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

      {/* Countries dialog */}
      <Dialog open={openDialog === "countries"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent className="pixel-border bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs text-card-foreground">
              🌍 COUNTRIES VISITED ({countriesCount})
            </DialogTitle>
          </DialogHeader>
          {uniqueCountries.length === 0 ? (
            <p className="font-retro text-lg text-muted-foreground text-center py-4">
              No countries yet! 🗺️
            </p>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-3">
                {uniqueCountries.map((country) => (
                  <div key={country} className="flex items-center gap-2 font-retro text-lg text-foreground px-2 py-1 bg-muted pixel-border-sm">
                    <span>{countryFlag(country)}</span>
                    <span>{country}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Loved dialog */}
      <Dialog open={openDialog === "loved"} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent className="pixel-border bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs text-card-foreground">
              ❤️ LOVED CITIES ({lovedCities.length})
            </DialogTitle>
          </DialogHeader>
          {lovedCities.length === 0 ? (
            <p className="font-retro text-lg text-muted-foreground text-center py-4">
              No loved cities yet! Click pins on the map to ❤️
            </p>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-3">
                {[...lovedCities].sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
                  <div key={city.name} className="flex items-center gap-2 font-retro text-lg text-foreground px-2 py-1 bg-muted pixel-border-sm">
                    <span>❤️</span>
                    <span>{city.name}</span>
                    <span className="text-muted-foreground text-sm ml-auto">{city.country}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default PassportHeader;
