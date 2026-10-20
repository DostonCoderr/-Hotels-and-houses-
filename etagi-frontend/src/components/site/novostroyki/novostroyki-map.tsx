'use client';

import { useEffect, useRef } from 'react';
import { Novostroyka } from '@/lib/static-data';
import { useTranslation } from '@/lib/i18n';

export function NovostroykiMap({ items, activeId }: { items: Novostroyka[]; activeId: number | null }) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstance.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      const map = L.map(mapRef.current!, {
        center: [41.311081, 69.240562], // Toshkent markazi
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
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

    items.forEach((p) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);

      if (isNaN(lat) || isNaN(lng)) return;

      const icon = L.divIcon({
        className: 'nz-marker-wrap',
        html: `<div class="nz-marker" data-id="${p.id}"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(layerGroupRef.current);

      // 🔥 LEAFTLET TOOLTIP — Avtomatik ochiladi va yopiladi (pirillash yo'q)
      // ✅ Tarjima: "Подробнее" tugmasi + metro/address matnlari
      marker.bindTooltip(`
        <div style="width: 220px; font-family: Inter, sans-serif;">
          <img src="${p.img}" alt="" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 11px; color: #a9793a; margin-bottom: 2px;">${p.metro}</div>
          <b style="display: block; font-size: 14px; color: #1c1a16; margin-bottom: 4px; line-height: 1.2;">${p.name}</b>
          <div style="font-size: 11px; color: #6b6556; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.address}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <b style="font-size: 15px; color: #a9793a;">${p.price.toLocaleString('ru-RU')} ₽</b>
            <a href="/novostroyki/${p.id}" style="background: #c9a36a; color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 11px; text-decoration: none;">${t('map_tooltip_details')}</a>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -20],
        opacity: 1,
        className: 'custom-tooltip',
        permanent: false,
      });

      // 🔥 CLICK — xarita o'sha joyga uchadi
      marker.on('click', () => {
        map.flyTo([lat, lng], 14, { duration: 0.8 });
      });

      markersRef.current[p.id] = marker;
    });

    // Xarita o'rtasiga birinchi markerni qo'yish
    if (Object.keys(markersRef.current).length > 0 && map) {
      const firstId = Object.keys(markersRef.current)[0];
      const firstMarker = markersRef.current[Number(firstId)];
      if (firstMarker) map.setView(firstMarker.getLatLng(), 12);
    }
  };

  useEffect(() => {
    if (!mapInstance.current) return;
    (async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, mapInstance.current);
    })();
  }, [items]);

  // Kartochka hover bo'lganda xarita markazlashadi
  useEffect(() => {
    if (!mapInstance.current) return;

    Object.values(markersRef.current).forEach((m: any) => {
      const el = m.getElement();
      if (el) el.querySelector('.nz-marker')?.classList.remove('active');
    });

    if (activeId !== null) {
      const marker = markersRef.current[activeId];
      if (marker) {
        const el = marker.getElement();
        if (el) el.querySelector('.nz-marker')?.classList.add('active');
        mapInstance.current.flyTo(marker.getLatLng(), 14, { duration: 0.8 });
      }
    }
  }, [activeId]);

  return (
    <div className="nz-map-wrap" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div id="nzMap" ref={mapRef} style={{ height: '100%', width: '100%' }} />

      <div className="nz-map-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        {t('map_hover_hint')}
      </div>
    </div>
  );
}