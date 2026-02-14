import { useState, useCallback, useEffect } from "react";
import { City } from "@/data/cities";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PassportHeader from "@/components/PassportHeader";
import WorldMap from "@/components/WorldMap";
import CityPicker from "@/components/CityPicker";
import VisitedList from "@/components/VisitedList";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuth();
  const [visitedCities, setVisitedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from("visited_cities")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load cities");
        console.error(error);
      } else if (data) {
        setVisitedCities(
          data.map((row) => ({
            name: row.city_name,
            country: row.country,
            emoji: row.emoji,
            coordinates: row.coordinates as unknown as [number, number],
            date: row.visited_date ?? undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetchCities();
  }, [user]);

  const addCity = useCallback(
    async (city: City) => {
      if (!user || visitedCities.find((c) => c.name === city.name)) return;

      const { error } = await supabase.from("visited_cities").insert({
        user_id: user.id,
        city_name: city.name,
        country: city.country,
        emoji: city.emoji,
        coordinates: city.coordinates,
        visited_date: city.date ?? null,
      });

      if (error) {
        toast.error("Failed to add city");
        console.error(error);
      } else {
        setVisitedCities((prev) => [...prev, city]);
      }
    },
    [user, visitedCities]
  );

  const removeCity = useCallback(
    async (name: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("visited_cities")
        .delete()
        .eq("user_id", user.id)
        .eq("city_name", name);

      if (error) {
        toast.error("Failed to remove city");
        console.error(error);
      } else {
        setVisitedCities((prev) => prev.filter((c) => c.name !== name));
      }
    },
    [user]
  );

  const uniqueCountries = new Set(visitedCities.map((c) => c.country)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-bounce-pixel">✈️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={signOut}
            className="font-pixel text-[8px] text-muted-foreground hover:text-accent cursor-pointer pixel-border-sm bg-card px-3 py-1"
          >
            🚪 LOG OUT
          </button>
        </div>

        <PassportHeader citiesCount={visitedCities.length} countriesCount={uniqueCountries} />

        <div className="mb-6">
          <WorldMap visitedCities={visitedCities} onRemoveCity={removeCity} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CityPicker visitedCities={visitedCities} onAddCity={addCity} />
          <VisitedList cities={visitedCities} onRemove={removeCity} />
        </div>

        <footer className="mt-8 text-center font-retro text-lg text-muted-foreground">
          🎮 Passport Pixel v1.0 — Keep exploring! 🌎
        </footer>
      </div>
    </div>
  );
};

export default Index;
