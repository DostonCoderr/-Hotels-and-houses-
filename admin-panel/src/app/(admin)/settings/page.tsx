'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { SettingsForm } from '@/components/forms/settings-form';
import { bulkUpdateSettings } from '@/lib/api-settings';
import { useTranslation } from '@/lib/translations';

export default function SettingsPage() {
  const { t } = useTranslation();

  const handleSubmit = async (flat: { key: string; value: string }[]) => {
    try {
      await bulkUpdateSettings(flat);
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      throw err;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 lg:p-8"
      >
        {/* Dekoratsiya */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <SettingsIcon className="h-7 w-7 text-primary-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-foreground">
                {t.settingsTitle}
              </h1>
              <Badge
                variant="outline"
                className="border-0 bg-primary/10 text-primary gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {t.admin}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {t.settingsSubtitle}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          FORMA
          ============================================================ */}
      <SettingsForm onSubmit={handleSubmit} />
    </div>
  );
}