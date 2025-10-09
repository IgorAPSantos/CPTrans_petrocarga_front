import { useEffect, useState, MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

// Interfaces
interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface UseMapboxProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  onSelectPlace?: (place: MapboxFeature) => void;
}

interface GeocoderResultEvent {
  result: {
    id: string;
    place_name: string;
    geometry: { coordinates: [number, number] };
  };
}

let globalMap: mapboxgl.Map | null = null; // instância global reutilizável

export function useMapbox({ containerRef, onSelectPlace }: UseMapboxProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) throw new Error("MAPBOX TOKEN não definido");
    mapboxgl.accessToken = token;

    if (!containerRef.current) return;
    const container = containerRef.current;

    if (globalMap) {
      if (!container.contains(globalMap.getContainer())) {
        container.appendChild(globalMap.getContainer());
      }
      globalMap.resize();
      setMap(globalMap);
    } else {
      globalMap = new mapboxgl.Map({
        container,
        style: "mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb",
        center: [-43.17572436276286, -22.5101573150628],
        zoom: 13,
      });

      globalMap.addControl(new mapboxgl.NavigationControl(), "top-right");

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        placeholder: "Pesquisar endereço",
      });

      globalMap.addControl(geocoder, "top-left");

      geocoder.on("result", (e: GeocoderResultEvent) => {
        const [lng, lat] = e.result.geometry.coordinates;

        if (onSelectPlace) {
          onSelectPlace({
            id: e.result.id,
            place_name: e.result.place_name,
            geometry: { type: "Point", coordinates: [lng, lat] },
          });
        }

        globalMap?.flyTo({ center: [lng, lat], zoom: 16 });
      });

      globalMap.on("load", () => setMapLoaded(true));
      setMap(globalMap);
    }

    const handleResize = () => globalMap?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (globalMap && globalMap.getContainer().parentNode === container) {
        container.appendChild(globalMap.getContainer());
      }
    };
  }, [containerRef, onSelectPlace]);

  return { map, mapLoaded };
}
