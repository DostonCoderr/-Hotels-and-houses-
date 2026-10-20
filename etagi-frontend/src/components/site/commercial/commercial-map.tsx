'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/lib/api-properties';
import { useTranslation } from '@/lib/i18n';

import { API_URL } from '@/lib/api';
const SERVER_URL = API_URL.replace('/api', '');



export function CommercialMap({ items, onMarkerClick }: { items: Property[], onMarkerClick: (item: Property) => void }) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const layerGroupRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstance.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      const map = L.map(mapRef.current!, {
        center: [41.311081, 69.240562],
        zoom: 11,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const tilePane = map.getPane('tilePane');
      if (tilePane) {
        tilePane.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
      }

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstance.current = map;

      setTimeout(() => map.invalidateSize(), 300);
      updateMarkers(L, map);
    };

    loadLeaflet();
  }, []);

  const updateMarkers = (L: any, map: any) => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();
    markersRef.current = {};

    const validItems = items.filter((p) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);
      return lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng);
    });

    if (validItems.length === 0) return;

    const bounds = L.latLngBounds([]);

    validItems.forEach((p) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);

      const imgUrl = p.images?.[0]?.url
        ? (p.images[0].url.startsWith('http') ? p.images[0].url : `${SERVER_URL}${p.images[0].url}`)
        : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';

      const icon = L.divIcon({
        className: 'cm-marker-wrap',
        html: `<div class="cm-marker" data-id="${p.id}"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(layerGroupRef.current);

      marker.bindTooltip(`
        <div style="width: 200px; font-family: Inter, sans-serif;">
          <img src="${imgUrl}" alt="" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 11px; color: #a9793a; margin-bottom: 2px;">${p.type?.name || t('cm_type_default')}</div>
          <b style="display: block; font-size: 13px; color: #1c1a16; margin-bottom: 4px; line-height: 1.2;">${p.name}</b>
          <div style="font-size: 11px; color: #6b6556; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.address}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <b style="font-size: 13px; color: #a9793a;">${p.price.toLocaleString('ru-RU')} ₽</b>
            <span style="background: #c9a36a; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 10px;">${t('map_tooltip_details')}</span>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -20],
        opacity: 1,
        className: 'custom-tooltip',
        permanent: false,
      });

      // ✅ Sichqoncha borganda Modalni yopish
      marker.on('mouseover', () => {
        onMarkerClick(null as any);
      });

      // ✅ Bosilganda Modal ochish
      marker.on('click', () => {
        map.flyTo([lat, lng], 14, { duration: 0.5 });
        onMarkerClick(p);
      });

      markersRef.current[p.id] = marker;
      bounds.extend([lat, lng]);
    });

    if (validItems.length === 1) {
      map.setView([Number(validItems[0].lat), Number(validItems[0].lng)], 14);
    } else {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  useEffect(() => {
    if (!mapInstance.current) return;
    (async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, mapInstance.current);
    })();
  }, [items]);

  return (
    <div className="cm-map-wrap" style={{ height: '100%', width: '100%', minHeight: '600px', position: 'relative' }}>
      <div
        id="cmMap"
        ref={mapRef}
        style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 1 }}
      />
      <div className="cm-map-hint" style={{ zIndex: 1000 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
        </svg>
        {t('cm_map_hint')}
      </div>
    </div>
  );
}