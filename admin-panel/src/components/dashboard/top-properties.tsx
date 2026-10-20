'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';
import { formatPrice } from '@/lib/format';
import { UPLOADS_URL } from '@/lib/constants';
import { useLooseT } from './dashboard-kit';

interface TopPropertiesProps {
  properties: Property[];
  delay?: number;
}

export function TopProperties({ properties, delay = 0 }: TopPropertiesProps) {
  const T = useLooseT();
  const items = properties.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="rounded-3xl border-0 bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between px-3 pb-2 pt-3">
          <h3 className="text-base font-semibold text-foreground">{T.topProperties ?? 'Top obyektlar'}</h3>
          <Link href="/properties">
            <Button variant="ghost" size="sm" className="gap-1 rounded-full">
              {T.all ?? 'Barchasi'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building2 className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{T.noProperties ?? "Obyektlar yo'q"}</p>
          </div>
        ) : (
          <ol>
            {items.map((p, i) => (
              <motion.li key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + i * 0.05 }}>
                <Link href={`/properties/view/${p.id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/50">
                  {/* Reyting raqami — bu haqiqiy tartib, shuning uchun mazmunli */}
                  <span className="w-4 text-center text-sm font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    {p.images?.[0] ? (
                      <img src={`${UPLOADS_URL}${p.images[0].url}`} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.address}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-foreground">{formatPrice(p.price)}</p>
                    <p className="text-xs text-muted-foreground">{p.rooms} {T.roomsShort ?? 'xona'}</p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ol>
        )}
      </Card>
    </motion.div>
  );
}