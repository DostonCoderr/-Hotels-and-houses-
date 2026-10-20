'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ============================================================
    // GSAP — suzuvchi sharlar
    // ============================================================
    const orbs = containerRef.current.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // ============================================================
    // VIDEO — fade in
    // ============================================================
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Sekinroq
      gsap.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* ============================================================ */}
      {/* VIDEO FON */}
      {/* ============================================================ */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/login-bg1.mp4" type="video/mp4" />
      </video>

      {/* ============================================================ */}
      {/* OVERLAY — krem palitra (video ustidan) */}
      {/* ============================================================ */}
      

      {/* ============================================================ */}
      {/* SUZUVCHI SHARLAR */}
      {/* ============================================================ */}
      <div className="orb absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="orb absolute top-[60%] right-[10%] w-96 h-96 rounded-full bg-amber-700/15 blur-3xl" />
      <div className="orb absolute bottom-[10%] left-[30%] w-80 h-80 rounded-full bg-orange-900/10 blur-3xl" />

      {/* ============================================================ */}
      {/* GRID PATTERN */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ============================================================ */}
      {/* NOISE OVERLAY */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}