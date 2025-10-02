"use client"

import React, { useRef, useEffect } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";

// TOKEN TEMPORARIO
mapboxgl.accessToken = "pk.eyJ1IjoianVzZW54IiwiYSI6ImNtZmlmMWs0NjBvNGEya3B5YzA0YTM3MmcifQ.-eHRdTokXwHzK8Z9S28tjQ";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);

  useEffect(() => {
    if (map.current) return; // mapa já inicializado
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-43.2, -22.5], // longitude, latitude
      zoom: 12,
    });
  }, []);

  return <div ref={mapContainer} className="w-full h-full"  />;
};

export default Map;
