"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
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
  onSelectPlace?: (place: MapboxFeature) => void;
}

interface GeocoderResultEvent {
  result: {
    id: string;
    place_name: string;
    geometry: { coordinates: [number, number] };
  };
}

interface Vaga {
  id: string;
  area: string;
  localizacao: string;
  enderecoVagaResponseDTO: {
    id: string;
    codidoPmp: string;
    logradouro: string;
    bairro: string;
  };
}

export function ViewMap({ selectedPlace, onSelectPlace }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicializa o mapa
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) throw new Error("MAPBOX TOKEN não definido");
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb",
      center: [-43.17572436276286, -22.5101573150628],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", () => setMapLoaded(true));

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: "Pesquisar endereço",
    });

    map.addControl(geocoder, "top-left");

    geocoder.on("result", (e: GeocoderResultEvent) => {
      const [lng, lat] = e.result.geometry.coordinates;
      onSelectPlace?.({
        id: e.result.id,
        place_name: e.result.place_name,
        geometry: { type: "Point", coordinates: [lng, lat] },
      });
      map.flyTo({ center: [lng, lat], zoom: 16 });
    });

    return () => map.remove();
  }, [onSelectPlace]);

  // Busca as vagas
  useEffect(() => {
    async function fetchVagas() {
      try {
        const res = await fetch("http://localhost:8000/petrocarga/vagas");
        const data: Vaga[] = await res.json();
        setVagas(data);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
      }
    }
    fetchVagas();
  }, []);

  // Adiciona marcadores somente quando mapa estiver carregado
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Remove marcadores antigos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    vagas.forEach((vaga) => {
      const [lat, lng] = vaga.localizacao
        .split(",")
        .map((v) => parseFloat(v.trim()));

      const marker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${vaga.area}</strong><br>${vaga.enderecoVagaResponseDTO.logradouro}`
          )
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, vagas]);

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
