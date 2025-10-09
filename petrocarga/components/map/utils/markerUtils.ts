import mapboxgl from "mapbox-gl";

interface Vaga {
  id: string;
  area: string;
  status: string;
  enderecoVagaResponseDTO: {
    logradouro: string;
    bairro: string;
  };
  coordinates?: [number, number];
}

/**
 * Adiciona marcadores de vagas no mapa.
 * @param map Instância do Mapbox
 * @param vagas Lista de vagas com coordenadas
 * @param markersRef Referência aos marcadores existentes
 */
export function addVagaMarkers(
  map: mapboxgl.Map,
  vagas: Vaga[],
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>
) {
  // Remove marcadores antigos
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  vagas.forEach((vaga) => {
    if (!vaga.coordinates) return;

    const el = document.createElement("div");
    el.className =
      "vaga-marker w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg";

    const marker = new mapboxgl.Marker(el)
      .setLngLat(vaga.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${vaga.status}</strong><br/>${vaga.enderecoVagaResponseDTO.logradouro}, ${vaga.enderecoVagaResponseDTO.bairro}`
        )
      )
      .addTo(map);

    markersRef.current.push(marker);
  });
}
