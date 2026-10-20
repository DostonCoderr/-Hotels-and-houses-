'use client';

import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

// Global state
interface VideoModalStore {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const useVideoModal = create<VideoModalStore>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));

const VIDEOS = [
  { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', title: 'Ваш новый дом', sub: 'Новостройки Москвы' },
  { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', title: 'Новостройки', sub: 'Сдача в 2026 году' },
  { img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=675&fit=crop', title: 'Строительство домов', sub: 'Проект и стройка под ключ' },
  { img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop', title: 'Коммерческая', sub: 'Офисы и торговые помещения' },
];

export function VideoModal() {
  const { open, setOpen } = useVideoModal();
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!open) return;
    setIdx(0);
    intervalRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % VIDEOS.length);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div id="vm">
      <div className="vbk" onClick={() => setOpen(false)} />
      <div className="vbox">
        <button className="vx" onClick={() => setOpen(false)} aria-label="Закрыть">
          ✕
        </button>
        <div className="vst">
          {VIDEOS.map((v, i) => (
            <img
              key={v.img}
              src={v.img}
              alt=""
              style={{
                opacity: i === idx ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ))}
        </div>
        <div className="vcap">
          <h3>{VIDEOS[idx].title}</h3>
          <p>{VIDEOS[idx].sub}</p>
        </div>
        <div className="vpr">
          <i style={{ width: '100%', transition: 'width 0.5s' }} />
        </div>
      </div>
    </div>
  );
}