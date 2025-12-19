'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vaga } from '@/lib/types/vaga';

interface CardMapProps {
  vaga: Vaga;
}

export default function CardMap({ vaga }: CardMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !mapContainer.current ||
      !vaga.referenciaGeoInicio ||
      !vaga.referenciaGeoFim
    )
      return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    // Converte "lat, lng" para [lng, lat]
    const parseCoordinates = (coord: string) => {
      const [lat, lng] = coord.split(',').map((v) => parseFloat(v.trim()));
      return [lng, lat] as [number, number];
    };

    const start = parseCoordinates(vaga.referenciaGeoInicio);
    const end = parseCoordinates(vaga.referenciaGeoFim);

    // Função para criar retângulo rotacionado baseado em dois pontos
    function getRotatedRectangle(
      start: [number, number],
      end: [number, number],
      widthMeters: number,
    ): [number, number][] {
      const [lng1, lat1] = start;
      const [lng2, lat2] = end;

      // Calcula ângulo da linha
      const dx = lng2 - lng1;
      const dy = lat2 - lat1;
      const angle = Math.atan2(dy, dx);

      // Conversão aproximada de metros para graus
      const metersToDeg = 0.00001 * widthMeters;

      const offsetLng = metersToDeg * Math.sin(angle);
      const offsetLat = metersToDeg * Math.cos(angle);

      return [
        [lng1 - offsetLng, lat1 + offsetLat],
        [lng2 - offsetLng, lat2 + offsetLat],
        [lng2 + offsetLng, lat2 - offsetLat],
        [lng1 + offsetLng, lat1 - offsetLat],
        [lng1 - offsetLng, lat1 + offsetLat],
      ];
    }

    const rectangleCoordinates = getRotatedRectangle(start, end, 2.5); // largura ~2.5m

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/jusenx/cmg9pmy5d006b01s2959hdkmb',
      center: start,
      zoom: 18,
      attributionControl: false,
    });

    const handleResize = () => map.resize();
    window.addEventListener('resize', handleResize);

    map.on('load', () => {
      map.resize(); // garante que o mapa fique dentro da div

      // Cria polígono da vaga
      map.addSource(`vaga-${vaga.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [rectangleCoordinates],
          },
          properties: {},
        },
      });

      map.addLayer({
        id: `vaga-polygon-${vaga.id}`,
        type: 'fill',
        source: `vaga-${vaga.id}`,
        layout: {},
        paint: {
          'fill-color': '#2563EB',
          'fill-opacity': 0.4,
        },
      });

      map.addLayer({
        id: `vaga-outline-${vaga.id}`,
        type: 'line',
        source: `vaga-${vaga.id}`,
        layout: {},
        paint: {
          'line-color': '#2563EB',
          'line-width': 2,
        },
      });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
    };
  }, [vaga]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-48 rounded-lg shadow-md"
      style={{ minHeight: '200px' }}
    />
  );
}
