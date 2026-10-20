'use client';

import { motion } from 'framer-motion';
import { Eye, Heart, MessageSquare, Calendar } from 'lucide-react';
import { CountUp, Delta, Spark } from './dashboard-kit';

interface StatItem {
  label: string;
  value?: string; 
  raw?: number; 
  change: number;
  icon?: 'eye' | 'heart' | 'message' | 'calendar';
  spark?: number[]; 
}

interface PropertyStatsProps {
  stats: StatItem[];
}

const ICONS = { eye: Eye, heart: Heart, message: MessageSquare, calendar: Calendar };
const COLORS = {
  eye: 'hsl(var(--primary))',
  heart: '#f43f5e',
  message: '#10b981',
  calendar: '#f59e0b',
};

export function PropertyStats({ stats }: PropertyStatsProps) {
  return (
    <div className="bg-background  pb-3">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-px overflow-hidden  bg-border/40 lg:grid-cols-4"
      >
        {stats.map((s, i) => {
          const Icon = s.icon ? ICONS[s.icon] : null;
          const color = s.icon ? COLORS[s.icon] : 'hsl(var(--primary))';
          return (
            <div key={`${s.label}-${i}`} className="flex items-center justify-between gap-3 bg-card px-5 py-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />}
                  <span className="truncate">{s.label}</span>
                </p>
                <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                  {s.raw !== undefined ? <CountUp value={s.raw} /> : s.value}
                </p>
                {/* ⚠️ Faqat o'zgarish bo'lsa ko'rsatamiz */}
                {s.change !== 0 && <div className="mt-1"><Delta value={s.change} /></div>}
              </div>
              {/* ⚠️ Sparkline haqiqiy massiv bo'lsa */}
              {s.spark && s.spark.length > 0 && (
                <div className="hidden w-24 shrink-0 sm:block">
                  <Spark data={s.spark} color={color} height={48} />
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}