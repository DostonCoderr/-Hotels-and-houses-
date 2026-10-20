'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/translations';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileSecurity } from '@/components/profile/profile-security';
import { ProfilePreferences } from '@/components/profile/profile-preferences';
import { ProfileActivity } from '@/components/profile/profile-activity';

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.profileTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.profileSubtitle}
          </p>
        </div>
      </motion.div>

      {/* ============================================================
          PROFIL SARLAVHASI (avatar, ism, email, rol)
          ============================================================ */}
      <ProfileHeader />

      {/* ============================================================
          ASOSIY MA'LUMOT
          ============================================================ */}
      <ProfileInfo />

      {/* ============================================================
          XAVFSIZLIK (parol o'zgartirish)
          ============================================================ */}
      <ProfileSecurity />

      {/* ============================================================
          SOZLAMALAR (til, mavzu, bildirishnomalar)
          ============================================================ */}
      <ProfilePreferences />

      {/* ============================================================
          FAOLLIK TARIXI
          ============================================================ */}
      <ProfileActivity />
    </div>
  );
}