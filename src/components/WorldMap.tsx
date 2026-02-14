import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { City } from "@/data/cities";
import { useState } from "react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  visitedCities: City[];
  onRemoveCity: (name: string) => void;
}

const WorldMap = ({ visitedCities, onRemoveCity }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState<{ city: City; x: number; y: number } | null>(null);

  return (
    <div className="pixel-border-lg bg-pixel-sky relative overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [0, 30] }}
        style={{ width: "100%", height: "auto" }}
        height={450}
      >
        <ZoomableGroup>
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
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: isVisited ? "hsl(145, 70%, 50%)" : "hsl(120, 35%, 60%)" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {visitedCities.map((city) => (
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
              onClick={() => onRemoveCity(city.name)}
              style={{ cursor: "pointer" }}
            >
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
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="absolute pointer-events-none pixel-border-sm bg-card px-3 py-2 z-10"
          style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
        >
          <span className="font-pixel text-[8px] text-card-foreground">
            {tooltip.city.emoji} {tooltip.city.name}
          </span>
        </div>
      )}

      {/* Water label */}
      <div className="absolute bottom-2 left-2 font-retro text-sm text-foreground opacity-50">
        🌊 Scroll to zoom • Click marker to remove
      </div>
    </div>
  );
};

export default WorldMap;
