'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import { useLoaderDone } from './use-loader-done';
import { getLenis } from './smooth-scroll';

const EASE = 'expo.out';
const q = <T extends HTMLElement = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

const STAGGER_GROUPS: Array<[string, gsap.TweenVars]> = [
  ['.swiper-slide', { y: 90, scale: 0.93 }],
  ['.ft > div', { y: 60 }],
  ['.team-grid .member', { y: 80, rotate: 2 }],
  ['.jr .cd', { y: 70 }],
  ['.lst .li', { x: 60 }],
];

export function PageAnimations() {
  const pathname = usePathname();
  const loaderDone = useLoaderDone();

  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    if (!loaderDone) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const timer = setTimeout(() => {
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1024px) and (hover: hover) and (pointer: fine)',
        },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
          if (!motion) return;
          const undo: Array<() => void> = [];

          // 1. Sarlavhalar
          q('.hd2').forEach((el) => {
            gsap.from(Array.from(el.children), {
              y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: EASE,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
          });

          // 2. Stagger guruhlar
          STAGGER_GROUPS.forEach(([sel, from]) => {
            const els = q(sel);
            if (!els.length) return;
            gsap.set(els, { opacity: 0, ...from });
            const enter = (batch: Element[]) =>
              gsap.to(batch, {
                opacity: 1, x: 0, y: 0, scale: 1, rotate: 0,
                duration: 1.1, stagger: 0.1, ease: EASE,
                overwrite: 'auto', clearProps: 'transform,opacity',
              });
            ScrollTrigger.batch(els, { start: 'top 92%', once: true, onEnter: enter, onEnterBack: enter });
          });

          // 3. Xarita
          q('.mb').forEach((el) => {
            gsap.from(el, {
              clipPath: 'inset(14% 10% 14% 10% round 32px)', opacity: 0,
              duration: 1.5, ease: EASE, clearProps: 'clipPath,opacity',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            });
          });

          // 4. Konsultatsiya
          q('.cs').forEach((el) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
            tl.from(el, { y: 80, scale: 0.94, opacity: 0, duration: 1.1, ease: EASE, clearProps: 'transform,opacity' })
              .from(el.querySelectorAll('h2, p, .fd, .bt'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: EASE }, '-=.7');
          });

          // 5. Parallaks
          q<HTMLImageElement>('.jr .im img, .team-grid .av2 img').forEach((img) => {
            gsap.fromTo(img, { scale: 1.18, yPercent: -5 }, {
              scale: 1.1, yPercent: 5, ease: 'none',
              scrollTrigger: { trigger: img.parentElement!, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });

          // 6. Narx hisoblagichi
          q('.swiper-slide .pr, .lst .li .pr').forEach((el) => {
            const final = el.textContent ?? '';
            const num = parseInt(final.replace(/\D/g, ''), 10);
            if (!num) return;
            el.textContent = '0 ₽';
            undo.push(() => { el.textContent = final; });
            const o = { v: 0 };
            ScrollTrigger.create({
              trigger: el.closest('.swiper-slide, .li') ?? el, start: 'top 92%', once: true,
              onEnter: () => {
                anime({
                  targets: o, v: num, round: 1, duration: 1900, delay: 250, easing: 'easeOutExpo',
                  update: () => { el.textContent = o.v.toLocaleString('ru-RU') + ' ₽'; },
                  complete: () => { el.textContent = final; },
                });
              },
            });
          });

          // 7. Header
          // const header = document.querySelector<HTMLElement>('header');
          // if (header) {
          //   ScrollTrigger.create({
          //     start: 0, end: 'max',
          //     onUpdate: (self) => {
          //       const y = self.scroll();
          //       header.classList.toggle('is-scrolled', y > 40);
          //       if (y > 420 && self.direction === 1) gsap.to(header, { yPercent: -110, duration: 0.5, ease: 'power3.out', overwrite: true });
          //       else if (self.direction === -1 || y <= 420) gsap.to(header, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: true });
          //     },
          //   });
          //   undo.push(() => { gsap.set(header, { clearProps: 'transform' }); header.classList.remove('is-scrolled'); });
          // }

          // 8. 3D Tilt (Desktop)
          if (desktop) {
            q('.bt, .bo, .vd').forEach((btn) => {
              const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1,.5)' });
              const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1,.5)' });
              const move = (e: PointerEvent) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
              };
              const leave = () => { xTo(0); yTo(0); };
              btn.addEventListener('pointermove', move);
              btn.addEventListener('pointerleave', leave);
              undo.push(() => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); });
            });

            q('.swiper-slide, .jr .cd').forEach((card) => {
              const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
              const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
              const enter = () => gsap.set(card, { transformPerspective: 900 });
              const move = (e: PointerEvent) => {
                const r = card.getBoundingClientRect();
                ry(((e.clientX - r.left) / r.width - 0.5) * 10);
                rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
              };
              const leave = () => { rx(0); ry(0); };
              card.addEventListener('pointerenter', enter);
              card.addEventListener('pointermove', move);
              card.addEventListener('pointerleave', leave);
              undo.push(() => {
                card.removeEventListener('pointerenter', enter);
                card.removeEventListener('pointermove', move);
                card.removeEventListener('pointerleave', leave);
              });
            });
          }

          return () => undo.forEach((fn) => fn());
        }
      );
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      mm.revert();
    };
  }, [pathname, loaderDone]);

  return null;
}