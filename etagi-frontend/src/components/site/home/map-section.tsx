'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/lib/types';        // ✅ static-data → types
import { useTranslation } from '@/lib/i18n';

export function MapSection({ items }: { items: Property[] }) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const [hovered, setHovered] = useState<Property | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstance.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [55.7558, 37.6173],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const tilePane = map.getPane('tilePane');
      if (tilePane) {
        tilePane.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
      }

      items.forEach((p) => {
        const icon = L.divIcon({
          className: 'custom-marker-wrap',
          html: `<div class="custom-marker" data-id="${p.id}"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);

        marker.on('mouseover', (e: any) => {
          if (!map) return;
          const point = map.latLngToContainerPoint(e.latlng);
          setHovered(p);
          setHoverPos({ x: point.x, y: point.y });
        });

        marker.on('mouseout', () => {
          setHovered(null);
          setHoverPos(null);
        });

        markersRef.current[p.id] = marker;
      });

      mapInstance.current = map;

      setTimeout(() => {
        if (mapInstance.current) mapInstance.current.invalidateSize();
      }, 300);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [items]);

  const handleListHover = (id: number | null) => {
    Object.values(markersRef.current).forEach((m: any) => {
      const el = m.getElement();
      if (el) el.querySelector('.custom-marker')?.classList.remove('active');
    });
    if (id !== null) {
      const marker = markersRef.current[id];
      if (marker) {
        const el = marker.getElement();
        if (el) el.querySelector('.custom-marker')?.classList.add('active');
        if (mapInstance.current) mapInstance.current.flyTo(marker.getLatLng(), 13, { duration: 0.8 });
      }
    }
  };

  return (
    <section className="sc" id="map">
      <div className="w">
        <div className="hd2">
          <div>
            <div className="mu" style={{ marginBottom: 6 }}>{t('map_sub')}</div>
            <h2>{t('map_title')}</h2>
          </div>
          <Link href="/novostroyki" className="bo" style={{ textDecoration: 'none' }}>
            {t('map_btn_all')}
          </Link>
        </div>

        <div className="mp">
          <div className="mb" style={{ position: 'relative' }}>
            <div id="leafletMap" ref={mapRef} />

            <div className="map-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
              {t('map_hint')}
            </div>

            {hovered && hoverPos && (
              <div style={{ position: 'absolute', left: hoverPos.x, top: hoverPos.y - 20, transform: 'translate(-50%, -100%)', background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: 8, width: 220, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, pointerEvents: 'none', display: 'flex', gap: 10 }}>
                <img src={hovered.img} alt="" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ minWidth: 0 }}>
                  <b style={{ display: 'block', fontSize: 13, color: 'var(--tx)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hovered.name}</b>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--mu)', marginBottom: 4 }}>{hovered.area} {t('pd_m2')} · {hovered.rooms}</span>
                  <b style={{ display: 'block', fontSize: 14, color: 'var(--g2)' }}>{hovered.price.toLocaleString('ru-RU')} ₽</b>
                </div>
              </div>
            )}
          </div>

          <div className="lst">
            {items.slice(0, 5).map((p) => (
              <div className="li" key={p.id} onMouseEnter={() => handleListHover(p.id)} onMouseLeave={() => handleListHover(null)}>
                <div className="th"><img src={p.img} alt="" /></div>
                <div>
                  <b className="sf" style={{ fontSize: 18 }}>{p.name}</b>
                  <div className="mu" style={{ fontSize: 12 }}>{p.address}</div>
                  <div className="pr" style={{ fontSize: 15 }}>{p.price.toLocaleString('ru-RU')} ₽</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}