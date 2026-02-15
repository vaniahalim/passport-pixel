import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoBounds, geoCentroid } from "d3-geo";
import { City } from "@/data/cities";
import { useState, useMemo } from "react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  visitedCities: City[];
  onRemoveCity: (name: string) => void;
  onToggleLike?: (name: string) => void;
}

const WorldMap = ({ visitedCities, onToggleLike }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState<{ city: City; x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 30],
    zoom: 1,
  });

  const likedSet = useMemo(() => new Set(visitedCities.filter(c => c.liked).map(c => c.name)), [visitedCities]);

  const [selectedCountry, setSelectedCountry] = useState<{ name: string; coordinates: [number, number] } | null>(null);

  const handleGeographyClick = (geo: any) => {
    try {
      const [[x0, y0], [x1, y1]] = geoBounds(geo);
      const [cLng, cLat] = geoCentroid(geo);
      const widthSpan = x1 >= x0 ? (x1 - x0) : (360 - x0 + x1);
      const heightSpan = Math.abs(y1 - y0);
      const maxSpan = Math.max(widthSpan, heightSpan);
      const zoom = Math.min(Math.max(300 / maxSpan, 2), 20);
      setPosition({ coordinates: [cLng, cLat], zoom });
      setSelectedCountry({ name: geo.properties.name, coordinates: [cLng, cLat] });
    } catch {
      // fallback
    }
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 30], zoom: 1 });
    setSelectedCountry(null);
  };

  const markerScale = 1 / position.zoom;

  return (
    <div className="pixel-border-lg bg-pixel-sky relative overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [0, 30] }}
        style={{ width: "100%", height: "auto" }}
        height={450}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates: coordinates as [number, number], zoom })}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isVisited = visitedCities.some(
                  (city) => city.country === geo.properties.name
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isVisited ? "hsl(145, 70%, 45%)" : "hsl(120, 35%, 55%)"}
                    stroke="hsl(220, 30%, 15%)"
                    strokeWidth={0.8}
                    onClick={() => handleGeographyClick(geo)}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: { outline: "none", fill: isVisited ? "hsl(145, 70%, 50%)" : "hsl(120, 35%, 60%)", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Country name label when zoomed */}
          {selectedCountry && position.zoom > 1 && (
            <Marker coordinates={selectedCountry.coordinates}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: `${Math.max(6, 10 / position.zoom * 3)}px`,
                  fill: "hsl(220, 30%, 15%)",
                  stroke: "hsl(0, 0%, 100%)",
                  strokeWidth: 3 / position.zoom,
                  paintOrder: "stroke",
                  pointerEvents: "none",
                }}
              >
                {selectedCountry.name}
              </text>
            </Marker>
          )}

          {visitedCities.map((city) => {
            const isLiked = likedSet.has(city.name);
            return (
              <Marker
                key={city.name}
                coordinates={city.coordinates}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      city,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => onToggleLike?.(city.name)}
                style={{ cursor: "pointer" }}
              >
                <g transform={`scale(${markerScale})`}>
                  {isLiked ? (
                    // Heart shape
                    <g>
                      <path
                        d="M0 -4 C-2 -8, -8 -8, -8 -4 C-8 0, 0 6, 0 8 C0 6, 8 0, 8 -4 C8 -8, 2 -8, 0 -4Z"
                        fill="hsl(350, 85%, 55%)"
                        stroke="hsl(220, 30%, 15%)"
                        strokeWidth={1.5}
                      />
                    </g>
                  ) : (
                    // Pixel pin
                    <g>
                      <rect
                        x={-8}
                        y={-8}
                        width={16}
                        height={16}
                        fill="hsl(350, 85%, 55%)"
                        stroke="hsl(220, 30%, 15%)"
                        strokeWidth={2}
                      />
                      <rect
                        x={-4}
                        y={-4}
                        width={8}
                        height={8}
                        fill="hsl(45, 95%, 58%)"
                      />
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="absolute pointer-events-none pixel-border-sm bg-card px-3 py-2 z-10"
          style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
        >
          <span className="font-pixel text-[8px] text-card-foreground block">
            {tooltip.city.emoji} {tooltip.city.name}
          </span>
          {tooltip.city.description && (
            <span className="font-retro text-sm text-muted-foreground block mt-0.5">
              {tooltip.city.description}
            </span>
          )}
          {tooltip.city.liked && (
            <span className="font-retro text-[10px] text-muted-foreground block mt-0.5">
              ❤️ Loved
            </span>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="font-retro text-sm text-foreground opacity-50">
          🌊 Pinch/scroll to zoom · Click country to expand · Click pin to ❤️
        </span>
        <div className="flex items-center gap-2">
          {position.zoom > 1 && (
            <button
              onClick={handleReset}
              className="font-pixel text-[8px] bg-card text-card-foreground pixel-border-sm px-2 py-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              🌍 RESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
