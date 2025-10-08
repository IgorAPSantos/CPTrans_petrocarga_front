"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const MapContext = createContext<mapboxgl.Map | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      mapboxgl.accessToken = token!;
      mapRef.current = new mapboxgl.Map({
        container: document.createElement("div"), // container temporário
        style: "mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb",
        center: [-43.1757, -22.5101],
        zoom: 13,
      });
    }

    return () => {
    };
  }, []);

  return <MapContext.Provider value={mapRef.current}>{children}</MapContext.Provider>;
}

export function useGlobalMap() {
  return useContext(MapContext);
}