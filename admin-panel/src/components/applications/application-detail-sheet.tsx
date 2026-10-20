'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  Building2,
  Hammer, // ✅ Hammer qo'shildi
  User,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Hash,
  Tag,
  Globe,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Application } from '@/types';
import {
  APPLICATION_STATUSES,
  APPLICATION_TYPES,
  APPLICATION_SOURCES,
} from '@/lib/api-applications';
import { formatDateTime, formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface ApplicationDetailSheetProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onChangeStatus?: () => void;
  onDelete?: (id: number) => void;
}

export function ApplicationDetailSheet({
  application,
  open,
  onClose,
  onChangeStatus,
  onDelete,
}: ApplicationDetailSheetProps) {
  const { t } = useTranslation();

  if (!application && open) return null;

  const STATUS_MAP = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s.value, s])
  );

  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    in_work: t.statusInWork,
    done: t.statusDone,
    closed: t.statusClosed,
  };

  const timeLabels = {
    now: t.timeNow,
    minutesAgo: t.timeMinutesAgo,
    hoursAgo: t.timeHoursAgo,
    daysAgo: t.timeDaysAgo,
  };

  return (
    <AnimatePresence>
      {open && application && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-x-0 bottom-0 top-10 z-[200] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-18 bottom-0 z-[201] w-full max-w-lg bg-card shadow-2xl flex flex-col h-[calc(100vh-4rem)] border-l border-border/40"
          >
            {/* SARLAVHA */}
            <div className="flex-shrink-0 flex items-start justify-between p-5 border-b border-border/40">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    {t.application} #{application.id}
                  </h2>
                  {(() => {
                    const s = STATUS_MAP[application.status] || STATUS_MAP.new;
                    return (
                      <Badge
                        variant="outline"
                        className={cn('text-xs border-0 gap-1', s.bg, s.color)}
                      >
                        <span>{s.icon}</span>
                        {statusLabels[application.status] || s.label}
                      </Badge>
                    );
                  })()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(application.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 z-[300]">
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${t.application} #${application.id}`
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {t.copyId}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onChangeStatus}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t.changeStatus}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete?.(application.id)}
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* KONTENT */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-5 space-y-5">
                {/* MIJOZ */}
                <Section title={t.client}>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {application.name}
                      </p>
                      {application.userId ? (
                        <Link
                          href={`/users/${application.userId}`}
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Hash className="h-3 w-3" />
                          {t.user} #{application.userId}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {t.anonymousClient}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <a
                      href={`tel:${application.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t.phone}
                        </p>
                        <p className="font-medium text-foreground truncate">
                          {application.phone}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    {application.email && (
                      <a
                        href={`mailto:${application.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {t.email}
                          </p>
                          <p className="font-medium text-foreground truncate">
                            {application.email}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </Section>

                {/* TAFSILOTLAR */}
                <Section title={t.applicationDetails}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {t.type}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {APPLICATION_TYPES[application.type] || application.type}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {t.source}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {APPLICATION_SOURCES[application.source] || application.source}
                      </p>
                    </div>
                  </div>
                </Section>

                {/* XABAR */}
                {application.message && (
                  <Section title={t.message}>
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {application.message}
                        </p>
                      </div>
                    </div>
                  </Section>
                )}

                {/* ✅ OBYEKT (Project yoki Property) */}
                {(application.project || application.property) && (
                  <Section title={t.property}>
                    {application.project ? (
                      <Link
                        href={`/projects/${application.project.id}`}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Hammer className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {application.project.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Проект #{application.project.id}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </Link>
                    ) : application.property ? (
                      <Link
                        href={`/properties/${application.property.id}`}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {application.property.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.property} #{application.property.id}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ) : null}
                  </Section>
                )}

                {/* TIMELINE */}
                <Section title={t.timeline}>
                  <div className="space-y-4 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                    <TimelineItem
                      color="blue"
                      title={t.applicationCreated}
                      time={formatRelativeTime(application.createdAt, timeLabels)}
                    />

                    {application.updatedAt !== application.createdAt && (
                      <TimelineItem
                        color="emerald"
                        title={t.lastUpdated}
                        time={formatRelativeTime(application.updatedAt, timeLabels)}
                      />
                    )}

                    <TimelineItem
                      color="primary"
                      title={`${t.status}: ${
                        statusLabels[application.status] || application.status
                      }`}
                      time={t.currentStatus}
                      isActive
                    />
                  </div>
                </Section>

                <div className="h-4" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex-shrink-0 p-4 border-t border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-full"
                >
                  {t.close}
                </Button>
                <Button onClick={onChangeStatus} className="flex-1 rounded-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t.changeStatus}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {title}
      </p>
      {children}
    </div>
  );
}

function TimelineItem({
  color,
  title,
  time,
  isActive,
}: {
  color: 'blue' | 'emerald' | 'primary' | 'muted';
  title: string;
  time: string;
  isActive?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    primary: 'bg-primary',
    muted: 'bg-muted-foreground',
  };

  return (
    <div className="relative flex items-start gap-3">
      <div
        className={cn(
          'w-4 h-4 rounded-full border-2 border-background flex items-center justify-center flex-shrink-0 mt-0.5 z-10',
          colors[color]
        )}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', isActive ? 'font-semibold text-foreground' : 'text-foreground')}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}