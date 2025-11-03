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
  enableSearch?: boolean;
  enableNavigation?: boolean;
  expandSearch?: boolean;
}

interface GeocoderResultEvent {
  result: {
    id: string;
    place_name: string;
    geometry: { coordinates: [number, number] };
  };
}

let globalMap: mapboxgl.Map | null = null;

export function useMapbox({
  containerRef,
  onSelectPlace,
  enableSearch = true,
  enableNavigation = true,
  expandSearch = false,
}: UseMapboxProps) {
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

      if (enableNavigation) {
        globalMap.addControl(new mapboxgl.NavigationControl(), "top-right");
      }

      if (enableSearch) {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl,
          marker: false,
          placeholder: "Pesquisar endereço",
        });

        globalMap.addControl(geocoder, "top-left");

        if (expandSearch) {
          const adjustGeocoder = () => {
            const wrapper = document.querySelector(
              ".mapboxgl-ctrl-top-left"
            ) as HTMLElement;
            const geocoderContainer = document.querySelector(
              ".mapboxgl-ctrl-geocoder"
            ) as HTMLElement;
            if (geocoderContainer) {
              geocoderContainer.classList.add("my-custom-geocoder");
            }

            if (wrapper && geocoderContainer) {
              // Centraliza horizontalmente
              wrapper.style.width = "100%";
              wrapper.style.display = "flex";
              wrapper.style.justifyContent = "center"; // centraliza
              wrapper.style.position = "absolute";
              wrapper.style.top = "10px";
              wrapper.style.left = "0";

              geocoderContainer.style.width = "80%"; // largura da barra
              geocoderContainer.style.maxWidth = "800px"; // limite máximo
              geocoderContainer.style.boxSizing = "border-box";

              const input = geocoderContainer.querySelector(
                "input"
              ) as HTMLInputElement;
              if (input) input.style.width = "100%";

              const dropdown = geocoderContainer.querySelector(
                ".suggestions"
              ) as HTMLElement;
              if (dropdown) dropdown.style.width = "100%";
            }
          };

          setTimeout(adjustGeocoder, 50);
          requestAnimationFrame(adjustGeocoder);

          const handleResize = () => {
            globalMap?.resize();
            adjustGeocoder();
          };
          window.addEventListener("resize", handleResize);
        }

        geocoder.on("result", (e: GeocoderResultEvent) => {
          const [lng, lat] = e.result.geometry.coordinates;

          onSelectPlace?.({
            id: e.result.id,
            place_name: e.result.place_name,
            geometry: { type: "Point", coordinates: [lng, lat] },
          });

          globalMap?.flyTo({ center: [lng, lat], zoom: 16 });
        });
      }

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
  }, [
    containerRef,
    onSelectPlace,
    enableSearch,
    enableNavigation,
    expandSearch,
  ]);

  return { map, mapLoaded };
}
