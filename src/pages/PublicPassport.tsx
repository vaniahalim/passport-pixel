import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { City } from "@/data/cities";
import PassportHeader from "@/components/PassportHeader";
import WorldMap from "@/components/WorldMap";

const noop = () => {};

const PublicPassport = () => {
  const { name = "" } = useParams();
  const [cities, setCities] = useState<City[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", name.replace(/[%_\\]/g, "\\$&"))
        .maybeSingle();
      if (!profile) { setNotFound(true); return; }
      const { data } = await supabase
        .from("visited_cities")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: true });
      setCities(
        (data ?? []).map((row) => ({
          name: row.city_name,
          country: row.country,
          emoji: row.emoji,
          coordinates: row.coordinates as unknown as [number, number],
          liked: row.liked ?? false,
          description: row.description ?? undefined,
        }))
      );
    })();
  }, [name]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 font-retro text-xl text-foreground">
        No passport found for "{name}".
        <Link to="/auth" className="text-accent underline">Back</Link>
      </div>
    );
  }
  if (!cities) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-bounce-pixel">✈️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-[8px] text-muted-foreground">👀 VIEWING {name.toUpperCase()}'S PASSPORT</span>
          <Link to="/auth" className="font-pixel text-[8px] text-muted-foreground hover:text-accent pixel-border-sm bg-card px-3 py-1">
            ◀ BACK
          </Link>
        </div>
        <PassportHeader
          citiesCount={cities.length}
          countriesCount={new Set(cities.map((c) => c.country)).size}
          visitedCities={cities}
        />
        <WorldMap visitedCities={cities} onRemoveCity={noop} onToggleLike={noop} />
      </div>
    </div>
  );
};

export default PublicPassport;
