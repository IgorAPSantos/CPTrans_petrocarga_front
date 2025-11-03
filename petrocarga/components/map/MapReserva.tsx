"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { useVagas } from "./hooks/useVagas";
import { useMapbox } from "./hooks/useMapbox";
import { addVagaMarkersReserva } from "./utils/markerUtilsReserva";
import { Vaga } from "@/lib/types/vaga";

interface MapReservaProps {
  onClickVaga?: (vaga: Vaga) => void;
}

export function MapReserva({ onClickVaga }: MapReservaProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const { vagas, loading, error } = useVagas();
  const { map, mapLoaded } = useMapbox({
    containerRef: mapContainer,
    enableSearch: true,
    enableNavigation: false, // desativa os botões
    expandSearch: true,
    onSelectPlace: (place) => console.log(place),
  });

  // Cria marcadores das vagas
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Limpa marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Cria novos marcadores se houver vagas
    if (vagas.length > 0) {
      addVagaMarkersReserva(map, vagas, markersRef, onClickVaga);
    }
  }, [vagas, map, mapLoaded, onClickVaga]);

  return (
    <div className="w-full h-full rounded-lg overflow-visible relative">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg shadow-md overflow-visible"
        style={{ minHeight: "300px" }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          Carregando vagas...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 z-10">
          Erro: {error}
        </div>
      )}
    </div>
  );
}
