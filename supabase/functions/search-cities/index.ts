import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Nominatim (OpenStreetMap) geocoding - free, no API key needed
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=15&featuretype=city&accept-language=en`;

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'PassportPixel/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error [${response.status}]`);
    }

    const results = await response.json();

    // Map to our City format, filtering for places (cities/towns)
    const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
    const cities = results
      .filter((r: any) => r.type && (validTypes.includes(r.type) || r.class === 'place' || r.class === 'boundary'))
      .map((r: any) => {
        const addr = r.address || {};
        const country = addr.country || '';
        const cityName = addr.city || addr.town || addr.village || addr.municipality || r.name || '';
        // Get country code for flag emoji
        const countryCode = (addr.country_code || '').toUpperCase();
        const flagEmoji = countryCode.length === 2
          ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
          : '🌍';

        return {
          name: cityName,
          country,
          coordinates: [parseFloat(r.lon), parseFloat(r.lat)] as [number, number],
          emoji: flagEmoji,
        };
      })
      .filter((c: any) => c.name && c.country)
      // Deduplicate by city name + country
      .filter((c: any, i: number, arr: any[]) => arr.findIndex((x: any) => x.name === c.name && x.country === c.country) === i);

    return new Response(JSON.stringify(cities), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search cities error:', error);
    return new Response(JSON.stringify({ error: 'Failed to search cities' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
