'use client';

import './site.css';
import './animations.css';
import { MotionConfig } from 'framer-motion';
import { SiteProviders } from '@/providers/site-providers';
import { ArchLoader } from '@/components/site/loader/arch-loader';
import { SiteHeader } from '@/components/site/header/site-header';
import { SiteFooter } from '@/components/site/footer/site-footer';
import { SiteToaster } from '@/components/site/common/toast';
import { VideoModal } from '@/components/site/common/video-modal';
import { ConsultModal } from '@/components/site/common/consult-modal';
import { SmoothScroll } from '@/components/site/animations/smooth-scroll';
import { ScrollProgress } from '@/components/site/animations/scroll-progress';
import { CustomCursor } from '@/components/site/animations/custom-cursor';
import { PageAnimations } from '@/components/site/animations/page-animations';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProviders>
      <MotionConfig reducedMotion="user">
        <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--tx)', transition: 'background 0.3s, color 0.3s' }}>
          <ArchLoader />
          <SmoothScroll />
          <ScrollProgress />
          <CustomCursor />
          <PageAnimations />
          <SiteHeader />
          {children}
          <SiteFooter />
          <SiteToaster />
          <VideoModal />
          <ConsultModal />
        </div>
      </MotionConfig>
    </SiteProviders>
  );
}