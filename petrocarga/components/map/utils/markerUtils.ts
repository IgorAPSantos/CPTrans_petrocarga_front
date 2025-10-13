import mapboxgl from "mapbox-gl";
import { Vaga } from "@/lib/types";

// Converte a String Localização em latitude e longitude
function parseCoordinates(coord: string): [number, number] {
  const [lat, lng] = coord.split(",").map((v) => parseFloat(v.trim()));
  return [lng, lat];
}

export function addVagaMarkers(
  map: mapboxgl.Map,
  vagas: Vaga[],
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>
) {
  // Remove marcadores antigos
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  vagas.forEach((vaga) => {
    if (!vaga.referenciaGeoInicio) return;

    const el = document.createElement("div");
    el.className =
      "vaga-marker w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg";

    const coordinates = parseCoordinates(vaga.referenciaGeoInicio);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${vaga.numeroEndereco}</strong><br/>${vaga.endereco.logradouro}, ${vaga.endereco.bairro}`
        )
      )
      .addTo(map);

    markersRef.current.push(marker);
  });
}
