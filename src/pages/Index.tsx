import { useState, useCallback } from "react";
import { City } from "@/data/cities";
import PassportHeader from "@/components/PassportHeader";
import WorldMap from "@/components/WorldMap";
import CityPicker from "@/components/CityPicker";
import VisitedList from "@/components/VisitedList";

const Index = () => {
  const [visitedCities, setVisitedCities] = useState<City[]>(() => {
    const saved = localStorage.getItem("passport-cities");
    return saved ? JSON.parse(saved) : [];
  });

  const save = (cities: City[]) => {
    setVisitedCities(cities);
    localStorage.setItem("passport-cities", JSON.stringify(cities));
  };

  const addCity = useCallback(
    (city: City) => {
      if (!visitedCities.find((c) => c.name === city.name)) {
        save([...visitedCities, city]);
      }
    },
    [visitedCities]
  );

  const removeCity = useCallback(
    (name: string) => {
      save(visitedCities.filter((c) => c.name !== name));
    },
    [visitedCities]
  );

  const uniqueCountries = new Set(visitedCities.map((c) => c.country)).size;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <PassportHeader citiesCount={visitedCities.length} countriesCount={uniqueCountries} />

        <div className="mb-6">
          <WorldMap visitedCities={visitedCities} onRemoveCity={removeCity} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CityPicker visitedCities={visitedCities} onAddCity={addCity} />
          <VisitedList cities={visitedCities} onRemove={removeCity} />
        </div>

        <footer className="mt-8 text-center font-retro text-lg text-muted-foreground">
          🎮 Pixel Passport v1.0 — Keep exploring! 🌎
        </footer>
      </div>
    </div>
  );
};

export default Index;
