'use client';

import { useEffect, useRef } from 'react';

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export function DetailMap({ lat, lng, name }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstance.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      
      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const tilePane = map.getPane('tilePane');
      if (tilePane) {
        tilePane.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
      }

      // Marker icon
      const icon = L.divIcon({
        className: 'custom-marker-wrap',
        html: `<div class="custom-marker" style="width: 24px; height: 24px; border-radius: 50% 50% 50% 0; background: #c9a36a; border: 2px solid #fff; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(0,0,0,0.5);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      L.marker([lat, lng], { icon }).addTo(map);
      mapInstance.current = map;

      setTimeout(() => map.invalidateSize(), 300);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0b1424',
      }}
    />
  );
}