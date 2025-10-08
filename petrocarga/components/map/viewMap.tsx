"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

// Interface para tipos do Mapbox
interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface MapProps {
  selectedPlace: MapboxFeature | null;
  onSelectPlace?: (place: MapboxFeature) => void;
}

interface GeocoderResultEvent {
  result: {
    id: string;
    place_name: string;
    geometry: { coordinates: [number, number] };
  };
}

// Instância global reutilizável
let globalMap: mapboxgl.Map | null = null;

export function ViewMap({ selectedPlace, onSelectPlace }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

 useEffect(() => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) throw new Error("MAPBOX TOKEN não definido");
  mapboxgl.accessToken = token;

  if (!mapContainer.current) return;
  const container = mapContainer.current;

  // Se já existe um mapa global, só reanexa o container
  if (globalMap) {
    if (!container.contains(globalMap.getContainer())) {
      container.appendChild(globalMap.getContainer());
    }
    // Força o mapa a redimensionar
    globalMap.resize();
  } else {
    // Cria o mapa apenas uma vez
    globalMap = new mapboxgl.Map({
      container,
      style: "mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb",
      center: [-43.17572436276286, -22.5101573150628],
      zoom: 13,
    });

    // Controles de navegação
    globalMap.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: "Pesquisar endereço",
    });

    globalMap.addControl(geocoder, "top-left");

    // Evento quando um endereço é selecionado
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

    // Também chama resize depois que o mapa é criado
    globalMap.on("load", () => {
      globalMap?.resize();
    });
  }

  // Listener para redimensionamento da janela
  const handleResize = () => globalMap?.resize();
  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
    if (globalMap && globalMap.getContainer().parentNode === container) {
      container.appendChild(globalMap.getContainer());
    }
  };
}, [onSelectPlace]);


  // Atualiza marcador e posição quando selectedPlace muda
  useEffect(() => {
    if (!globalMap || !selectedPlace) return;

    const [lng, lat] = selectedPlace.geometry.coordinates;
    globalMap.flyTo({ center: [lng, lat], zoom: 14 });

    // Remove marcador anterior
    if (markerRef.current) markerRef.current.remove();

    // Cria novo marcador
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(globalMap);
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
