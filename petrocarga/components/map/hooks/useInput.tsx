"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

interface AddressInputProps {
  onSelectAddress?: (address: {
    id: string;
    place_name: string;
    coordinates: [number, number];
  }) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressInput({
  onSelectAddress,
  placeholder = "Pesquisar endereço",
  className,
}: AddressInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) throw new Error("MAPBOX TOKEN não definido");
    mapboxgl.accessToken = token;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder,
      container: inputRef.current,
    });

    geocoder.on("result", (e: any) => {
      const [lng, lat] = e.result.geometry.coordinates;
      onSelectAddress?.({
        id: e.result.id,
        place_name: e.result.place_name,
        coordinates: [lng, lat],
      });
    });

    return () => {
      // Limpa o container para evitar problemas ao desmontar
      if (inputRef.current) {
        inputRef.current.innerHTML = "";
      }
    };
  }, [onSelectAddress, placeholder]);

  return <div ref={inputRef} className={className} style={{ width: "100%" }} />;
}
