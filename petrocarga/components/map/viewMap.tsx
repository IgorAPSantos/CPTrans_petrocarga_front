"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface MapProps {
  selectedPlace: MapboxFeature | null;
  onSelectPlace?: (place: MapboxFeature) => void; // callback para o parent
}

interface GeocoderResultEvent {
  result: {
    id: string;
    place_name: string;
    geometry: { coordinates: [number, number] };
  };
}

export function ViewMap({ selectedPlace, onSelectPlace }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) throw new Error("MAPBOX TOKEN não definido");
    mapboxgl.accessToken = token;

    // Cria o mapa
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb",
      center: [-43.17572436276286, -22.5101573150628],
      zoom: 13,
    });

    // Botões de navegação
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Adiciona Geocoder como control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: "Pesquisar endereço",
    });

    mapRef.current.addControl(geocoder, "top-left");

    // Atualiza posição quando um endereço é selecionado
    geocoder.on("result", (e: GeocoderResultEvent) => {
      const [lng, lat] = e.result.geometry.coordinates;

      if (onSelectPlace) {
        onSelectPlace({
          id: e.result.id,
          place_name: e.result.place_name,
          geometry: { type: "Point", coordinates: [lng, lat] },
        });
      }

      mapRef.current?.flyTo({ center: [lng, lat], zoom: 16 });
    });

    // Cleanup
    return () => {
      mapRef.current?.remove();
    };
  }, [onSelectPlace]);

  // Atualiza marcador quando selectedPlace muda
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;

    const [lng, lat] = selectedPlace.geometry.coordinates;

    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });

    if (markerRef.current) markerRef.current.remove();

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  }, [selectedPlace]);

  return (
   <div className="w-full h-full rounded-lg overflow-visible">
  <div
    ref={mapContainer}
    className="w-full h-full rounded-lg shadow-md overflow-visible"
    style={{ minHeight: "300px" }}
  />
</div>


  );
}
