'use client';

import { useEffect, useId, useState } from 'react';
import { animate } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

export function useLooseT() {
  const { t } = useTranslation();
  return t as unknown as Record<string, string | undefined>;
}

export function CountUp({ value }: { value: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, value, { duration: 1, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [value]);
  return <>{formatNumber(v)}</>;
}

export function Delta({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
        up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value)}%
    </span>
  );
}

export function Spark({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const id = 'sp' + useId().replace(/:/g, '');
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#${id})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ❌ O'CHIRILDI: seededSeries
// ❌ O'CHIRILDI: trendOf