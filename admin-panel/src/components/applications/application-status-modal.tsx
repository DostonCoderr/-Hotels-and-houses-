'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Application } from '@/types';
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from '@/lib/api-applications';
import { useTranslation } from '@/lib/translations';

interface ApplicationStatusModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number, status: ApplicationStatus) => Promise<void>;
}

export function ApplicationStatusModal({
  application,
  open,
  onClose,
  onSubmit,
}: ApplicationStatusModalProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ApplicationStatus>('new');
  const [loading, setLoading] = useState(false);

  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    in_work: t.statusInWork,
    done: t.statusDone,
    closed: t.statusClosed,
  };

  useEffect(() => {
    if (application) {
      setSelected(application.status as ApplicationStatus);
    }
  }, [application]);

  const handleSubmit = async () => {
    if (!application) return;
    try {
      setLoading(true);
      await onSubmit(application.id, selected);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && application && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Overlay (Orqa fon) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal (Markazda) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-[201] w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Sarlavha */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {t.changeStatus}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {application.name}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tana */}
            <div className="p-6 space-y-2">
              {APPLICATION_STATUSES.map((status) => {
                const isSelected = selected === status.value;
                return (
                  <button
                    key={status.value}
                    onClick={() => setSelected(status.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left',
                      isSelected
                        ? `${status.bg} ${status.color} ring-2 ring-inset ring-current`
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <span className="text-2xl">{status.icon}</span>
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-medium',
                          isSelected ? status.color : 'text-foreground'
                        )}
                      >
                        {statusLabels[status.value] || status.label}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center',
                          status.bg
                        )}
                      >
                        <Check className={cn('h-4 w-4', status.color)} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pastki qism */}
            <div className="flex items-center gap-3 p-6 border-t border-border/40">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-full"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t.save}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}