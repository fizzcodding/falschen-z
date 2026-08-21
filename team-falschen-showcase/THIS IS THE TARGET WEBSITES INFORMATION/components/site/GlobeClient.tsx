import { Suspense, lazy, useEffect, useState } from "react";

const World = lazy(() =>
  import("@/components/ui/globe").then((m) => ({ default: m.World })),
);

const INK = "#0f1b2d";
const SHELL = "#ffffff";
const PHOSPHOR = "#e56a00";

const globeConfig = {
  pointSize: 2,
  globeColor: SHELL,
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.08,
  emissive: SHELL,
  emissiveIntensity: 0.12,
  shininess: 0,
  polygonColor: "rgba(15,27,45,0.75)",
  ambientLight: "#f6f6f6",
  directionalLeftLight: "#f6f6f6",
  directionalTopLight: "#f6f6f6",
  pointLight: "#f6f6f6",
  arcTime: 1400,
  arcLength: 0.85,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 23.8103, lng: 90.4125 },
  autoRotate: true,
  autoRotateSpeed: 0.45,
};

// Dhaka outbound to every place the team has competed.
const DHAKA = { lat: 23.8103, lng: 90.4125 };
const DESTINATIONS = [
  { lat: 3.139, lng: 101.6869 }, // Kuala Lumpur, WICE 2025
  { lat: -8.4095, lng: 115.1889 }, // Bali, ISIF 2025
  { lat: 45.4642, lng: 9.19 }, // Milan, Reply
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 25.2048, lng: 55.2708 }, // Dubai
  { lat: 1.3521, lng: 103.8198 }, // Singapore
];

const arcs = DESTINATIONS.map((d, i) => ({
  order: (i % 4) + 1,
  startLat: DHAKA.lat,
  startLng: DHAKA.lng,
  endLat: d.lat,
  endLng: d.lng,
  arcAlt: 0.18 + (i % 4) * 0.08,
  color: PHOSPHOR,
}));

export function GlobeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="label-mono text-muted-foreground">
          LOADING COVERAGE MAP <span className="caret-blink">_</span>
        </span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="label-mono text-muted-foreground">
            LOADING COVERAGE MAP <span className="caret-blink">_</span>
          </span>
        </div>
      }
    >
      <World globeConfig={globeConfig} data={arcs} />
    </Suspense>
  );
}
