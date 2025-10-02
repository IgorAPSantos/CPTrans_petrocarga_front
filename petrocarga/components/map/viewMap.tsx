"use client"
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface MapProps {
  selectedPlace: MapboxFeature | null;
}

export function ViewMap({ selectedPlace }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-43.174627, -22.509600],
      zoom: 14,
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;

    const [lng, lat] = selectedPlace.geometry.coordinates;

    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
  }, [selectedPlace]);

  return <div ref={mapContainer} className="w-full h-[70vh] min-h-[300px]"/>;
}