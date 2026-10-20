'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Building2, ArrowRight } from 'lucide-react';
import { LoginForm } from '@/components/forms/login-form';
import { useRedirectIfAuthenticated } from '@/hooks/useAuth';

export default function LoginPage() {
  const { isLoading } = useRedirectIfAuthenticated();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // GSAP ANIMATSIYALAR
  // ============================================================
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Video playback rate
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }

    // 2. Orbs animatsiya
    const orbs = containerRef.current.querySelectorAll('.gsap-orb');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        x: `random(-80, 80)`,
        y: `random(-60, 60)`,
        scale: `random(0.9, 1.2)`,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // 3. Konsentrik doiralar
    const circles = containerRef.current.querySelectorAll('.gsap-circle');
    circles.forEach((circle, i) => {
      gsap.fromTo(
        circle,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          delay: 0.3 + i * 0.2,
          ease: 'power3.out',
        }
      );
      gsap.to(circle, {
        rotate: 360,
        duration: 60 + i * 20,
        repeat: -1,
        ease: 'none',
      });
    });

    // 4. Grid pattern animatsiya
    gsap.to('.gsap-grid', {
      backgroundPosition: '60px 60px',
      duration: 20,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-white/60 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex bg-[#0A0E1A] overflow-hidden"
    >
      {/* ============================================================
          CHAP TOMON — VIDEO FON (55%)
          ============================================================ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-black">
        {/* Video — yorqin + blur */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 blur-[1px]"
        >
          <source src="/videos/login-bg1.mp4" type="video/mp4" />
        </video>
    

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          {/* Top text */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-white/80 max-w-xs"
          >
            O'zbekistondagi eng zamonaviy ko'chmas mulk boshqaruv tizimi.
          </motion.p>

          {/* Center content */}
          <div className="space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              Boshqaring
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                ko'chmas mulkni
              </span>
            </motion.h1>

            {/* Real image + badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative max-w-md"
            >
              {/* Real image */}
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
                  alt="Zamonaviy uy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 -bottom-4 bg-white rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jami obyektlar</p>
                    <p className="text-lg font-bold text-gray-900">500+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center justify-between text-xs text-white/60"
          >
            <span>© 2026 Etagi Inc.</span>
            <div className="flex items-center gap-4">
              <span>O'zbekiston</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          O'NG TOMON — DARK FORM (45%)
          ============================================================ */}
      <div className="w-full lg:w-[45%] flex flex-col relative bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A1A1A]">
        {/* Glow top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-between p-8 lg:p-10"
        >
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Etagi</span>
          </div>

          <a
            href="#"
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors group"
          >
            <span>Yordam</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* RASM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-8 lg:px-10"
        >
          <div className="relative w-full h-40 lg:h-48 rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
              alt="Zamonaviy turar-joy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-orange-400 text-xs font-medium mb-1 uppercase tracking-wider">
                  Premium
                </p>
                <p className="text-white text-base font-bold">
                  Zamonaviy turar-joylar
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white text-xs font-semibold">500+</span>
              </div>
            </div>

            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl ring-1 ring-orange-500/30 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Forma */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8 lg:px-10 py-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Kirish
              </h2>
              <p className="text-white/50">
                Admin panelga kirish uchun ma'lumotlaringizni kiriting
              </p>
            </motion.div>

            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative z-10 flex items-center justify-between p-8 lg:p-10 text-xs text-white/40"
        >
          <span>© 2026 Etagi Inc.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Bog'lanish
            </a>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <span>O'zbekcha</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}